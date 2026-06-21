from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.conf import settings
import uuid
import os

from .models import (
    Usuario, Cliente, Proprietario,
    Estabelecimento, Cardapio, Produto,
    Postagem, PostagemCliente, PostagemEstabelecimento, PostagemEvento,
    Foto, Denuncia, Reacao, Favoritar,
    FavoritarEstabelecimento, Presenca,
    Endereco, Cpf,
)
from .serializers import (
    UsuarioSerializer, ClienteSerializer, ProprietarioSerializer,
    EstabelecimentoSerializer, CardapioSerializer, ProdutoSerializer,
    PostagemSerializer, PostagemClienteSerializer, PostagemEstabelecimentoSerializer,
    FotoSerializer, DenunciaSerializer, ReacaoSerializer,
    FavoritarSerializer, EnderecoSerializer, CpfSerializer,
)


# HELPER: extrai usuário do token JWT
def get_usuario_do_token(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        token = AccessToken(auth.split(' ')[1])
        return Usuario.objects.get(pk=token['id_usuario'])
    except Exception:
        return None


# AUTH
class CadastroView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email    = request.data.get('email')
        senha    = request.data.get('senha')
        nome     = request.data.get('nome')
        tipo     = request.data.get('tipo')  # 'cliente' ou 'proprietario'

        if Usuario.objects.filter(username=username).exists():
            return Response({"erro": "username já cadastrado"}, status=400)

        if email and Usuario.objects.filter(email=email).exists():
            return Response({"erro": "email já cadastrado"}, status=400)

        usuario = Usuario.objects.create(
            nome=nome,
            username=username,
            email=email,
            telefone=request.data.get('telefone', None),
            data_nascimento=request.data.get('data_nascimento', None),
            senha=make_password(senha)
        )

        if tipo == 'cliente':
            Cliente.objects.create(id_usuario=usuario)
        elif tipo == 'proprietario':
            Proprietario.objects.create(id_usuario=usuario)

        refresh = RefreshToken()
        refresh['id_usuario'] = usuario.id_usuario
        refresh['username']   = usuario.username

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "id_usuario": usuario.id_usuario,
            "username": usuario.username,
            "nome": usuario.nome,
            "email": usuario.email,
        }, status=201)


class LoginView(APIView):
    def post(self, request):
        email    = request.data.get('email', None)
        username = request.data.get('username', None)
        senha    = request.data.get('senha')

        try:
            if email:
                usuario = Usuario.objects.get(email=email)
            else:
                usuario = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response({"erro": "usuário não encontrado"}, status=404)

        if not check_password(senha, usuario.senha):
            return Response({"erro": "senha incorreta"}, status=401)

        refresh = RefreshToken()
        refresh['id_usuario'] = usuario.id_usuario
        refresh['username']   = usuario.username

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "id_usuario": usuario.id_usuario,
            "username": usuario.username,
            "nome": usuario.nome,
            "email": usuario.email,
        }, status=200)


# ESTABELECIMENTO
class EstabelecimentoListView(APIView):
    def get(self, request):
        ordem     = request.query_params.get('ordem', None)
        nome      = request.query_params.get('nome', None)
        categoria = request.query_params.get('categoria', None)
        aberto    = request.query_params.get('aberto', None)

        estabelecimentos = Estabelecimento.objects.annotate(
            ticket_medio=Avg('cardapio__produto__preco'),
        )

        if nome:
            estabelecimentos = estabelecimentos.filter(nome__icontains=nome)
        if categoria:
            estabelecimentos = estabelecimentos.filter(categoria__icontains=categoria)
        if aberto is not None:
            estabelecimentos = estabelecimentos.filter(aberto=(aberto.lower() == 'true'))

        if ordem == 'alfabetica':
            estabelecimentos = estabelecimentos.order_by('nome')
        elif ordem == 'ticket':
            estabelecimentos = estabelecimentos.order_by('ticket_medio')
        elif ordem == 'nota':
            estabelecimentos = estabelecimentos.order_by('-media_nota')

        serializer = EstabelecimentoSerializer(estabelecimentos, many=True)
        return Response(serializer.data)


class CadastrarEstabelecimentoView(APIView):
    def post(self, request):
        id_prop = request.data.get('id_proprietario')
        proprietario, _ = Proprietario.objects.get_or_create(
            id_usuario=Usuario.objects.get(pk=id_prop)
        )

        endereco = Endereco.objects.create(
            rua=request.data.get('rua'),
            bairro=request.data.get('bairro'),
            numero=request.data.get('numero'),
            complemento=request.data.get('complemento', None),
            id_usuario=proprietario.id_usuario
        )

        estabelecimento = Estabelecimento.objects.create(
            id_proprietario=proprietario,
            id_endereco=endereco,
            qr_code=str(uuid.uuid4()),
            nome=request.data.get('nome'),
            categoria=request.data.get('categoria', None),
            descricao=request.data.get('descricao', None),
            telefone=request.data.get('telefone', None),
            imagem=request.data.get('imagem', None),
            latitude=request.data.get('latitude', None),
            longitude=request.data.get('longitude', None),
            aberto=request.data.get('aberto', True),
        )

        return Response({
            "id_estabelecimento": estabelecimento.id_estabelecimento,
            "qr_code": estabelecimento.qr_code
        }, status=201)

    def get(self, request):
        id_proprietario = request.query_params.get('id_proprietario')
        try:
            proprietario = Proprietario.objects.get(id_usuario=id_proprietario)
        except Proprietario.DoesNotExist:
            return Response([], status=200)
        estabelecimentos = Estabelecimento.objects.filter(id_proprietario=proprietario)
        serializer = EstabelecimentoSerializer(estabelecimentos, many=True)
        return Response(serializer.data)


# POSTAGENS
class PostagemClienteView(APIView):
    def post(self, request):
        postagem = Postagem.objects.create(
            id_usuario=Usuario.objects.get(pk=request.data.get('id_usuario')),
            id_estabelecimento=Estabelecimento.objects.get(pk=request.data.get('id_estabelecimento')) if request.data.get('id_estabelecimento') else None,
            legenda=request.data.get('legenda'),
            avaliacoes=0,
            imagem=request.data.get('imagem'),
            vibe=request.data.get('vibe'),
            musica=request.data.get('musica'),
            fila=request.data.get('fila'),
            preco=request.data.get('preco'),
            seguranca=request.data.get('seguranca'),
            pessoas=request.data.get('pessoas'),
            tempo_espera=request.data.get('tempo_espera'),
            metodo_presenca=request.data.get('metodo_presenca'),
        )

        PostagemCliente.objects.create(
            id_postagem=postagem,
            nota=request.data.get('nota')
        )

        url_foto = request.data.get('url_foto', None)
        if url_foto:
            Foto.objects.create(
                url=url_foto,
                id_usuario=postagem.id_usuario,
                id_postagem=postagem
            )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class PostagemEstabelecimentoView(APIView):
    def post(self, request):
        postagem = Postagem.objects.create(
            id_usuario=Usuario.objects.get(pk=request.data.get('id_usuario')),
            id_estabelecimento=Estabelecimento.objects.get(pk=request.data.get('id_estabelecimento')) if request.data.get('id_estabelecimento') else None,
            legenda=request.data.get('legenda'),
            avaliacoes=0
        )

        PostagemEstabelecimento.objects.create(
            id_postagem=postagem,
            promocoes=request.data.get('promocoes', None)
        )

        url_foto = request.data.get('url_foto', None)
        if url_foto:
            Foto.objects.create(
                url=url_foto,
                id_usuario=postagem.id_usuario,
                id_postagem=postagem
            )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class EventoView(APIView):
    def post(self, request):
        id_usuario = request.data.get('id_usuario')
        usuario = Usuario.objects.get(pk=id_usuario) if id_usuario else None

        postagem = Postagem.objects.create(
            id_usuario=usuario,
            id_estabelecimento=Estabelecimento.objects.get(pk=request.data.get('id_estabelecimento')) if request.data.get('id_estabelecimento') else None,
            legenda=request.data.get('descricao'),
            imagem=request.data.get('imagem'),
            avaliacoes=0,
        )

        PostagemEvento.objects.create(
            id_postagem=postagem,
            titulo=request.data.get('titulo'),
            descricao=request.data.get('descricao'),
            promocao=request.data.get('promocao'),
            data_evento=request.data.get('data_evento'),
            imagem=request.data.get('imagem'),
        )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class PostagensEstabelecimentoView(APIView):
    def get(self, request):
        id_estabelecimento = request.query_params.get('id_estabelecimento')

        if not id_estabelecimento:
            return Response({"erro": "id_estabelecimento é obrigatório"}, status=400)

        postagens = Postagem.objects.filter(
            id_estabelecimento=id_estabelecimento,
            postagemcliente__isnull=False,
        ).select_related('id_usuario')

        resultado = []
        for p in postagens:
            fotos = list(Foto.objects.filter(id_postagem=p).values_list('url', flat=True))
            try:
                nota = p.postagemcliente.nota
            except PostagemCliente.DoesNotExist:
                nota = None

            resultado.append({
                "id_postagem": p.id_postagem,
                "legenda": p.legenda,
                "data_postagem": p.data_postagem,
                "avaliacoes": p.avaliacoes,
                "nota": nota,
                "fotos": fotos,
                "imagem": p.imagem,
                "usuario": {
                    "id_usuario": p.id_usuario.id_usuario,
                    "nome": p.id_usuario.nome,
                    "username": p.id_usuario.username,
                }
            })

        return Response(resultado, status=200)


class EventosEstabelecimentoView(APIView):
    def get(self, request):
        id_estabelecimento = request.query_params.get('id_estabelecimento')

        if not id_estabelecimento:
            return Response({"erro": "id_estabelecimento é obrigatório"}, status=400)

        eventos = PostagemEvento.objects.filter(
            id_postagem__id_estabelecimento=id_estabelecimento
        ).select_related('id_postagem', 'id_postagem__id_usuario')

        resultado = []
        for e in eventos:
            resultado.append({
                "id_postagem": e.id_postagem.id_postagem,
                "titulo": e.titulo,
                "descricao": e.descricao,
                "promocao": e.promocao,
                "data_evento": e.data_evento,
                "imagem": e.imagem or e.id_postagem.imagem,
                "usuario": {
                    "nome": e.id_postagem.id_usuario.nome,
                    "username": e.id_postagem.id_usuario.username,
                }
            })

        return Response(resultado, status=200)


class CompartilharPostagemView(APIView):
    def get(self, request, id_postagem):
        postagem = Postagem.objects.get(pk=id_postagem)
        serializer = PostagemSerializer(postagem)
        return Response(serializer.data, status=200)


# INTERAÇÕES
class ReacaoView(APIView):
    def post(self, request):
        tipo = request.data.get('tipo_reacao')
        if tipo not in ['concordar', 'discordar']:
            return Response({"erro": "tipo_reacao deve ser 'concordar' ou 'discordar'"}, status=400)

        reacao = Reacao.objects.create(
            id_usuario=Usuario.objects.get(pk=request.data.get('id_usuario')),
            id_postagem=Postagem.objects.get(pk=request.data.get('id_postagem')),
            tipo_reacao=tipo
        )

        return Response({"id_reacao": reacao.id_reacao}, status=201)


class DenunciaView(APIView):
    def post(self, request):
        tipo = request.data.get('tipo_denuncia')
        if tipo not in ['ofensivo', 'spam', 'inapropriado']:
            return Response({"erro": "tipo_denuncia invalido"}, status=400)

        denuncia = Denuncia.objects.create(
            id_usuario_autor=Usuario.objects.get(pk=request.data.get('id_usuario')),
            id_postagem_alvo=Postagem.objects.get(pk=request.data.get('id_postagem')),
            tipo_denuncia=tipo
        )

        return Response({"id_denuncia": denuncia.id_denuncia}, status=201)


class FavoritarView(APIView):
    def post(self, request):
        cliente = Cliente.objects.get(pk=request.data.get('id_usuario'))
        postagem_cliente = PostagemCliente.objects.get(pk=request.data.get('id_postagem'))

        if Favoritar.objects.filter(id_usuario=cliente, id_postagem_cliente=postagem_cliente).exists():
            return Response({"erro": "postagem já favoritada"}, status=400)

        Favoritar.objects.create(id_usuario=cliente, id_postagem_cliente=postagem_cliente)
        return Response({"mensagem": "favoritado com sucesso"}, status=201)

    def delete(self, request):
        cliente = Cliente.objects.get(pk=request.data.get('id_usuario'))
        postagem_cliente = PostagemCliente.objects.get(pk=request.data.get('id_postagem'))

        Favoritar.objects.filter(id_usuario=cliente, id_postagem_cliente=postagem_cliente).delete()
        return Response({"mensagem": "favoritado removido"}, status=200)


# CARDÁPIO
class ProdutoView(APIView):
    def post(self, request):
        cardapio = Cardapio.objects.filter(
            id_estabelecimento=request.data.get('id_estabelecimento')
        ).first()

        if not cardapio:
            cardapio = Cardapio.objects.create(
                id_estabelecimento=Estabelecimento.objects.get(pk=request.data.get('id_estabelecimento'))
            )

        produto = Produto.objects.create(
            id_cardapio=cardapio,
            nome=request.data.get('nome'),
            preco=request.data.get('preco'),
            descricao=request.data.get('descricao', None)
        )

        return Response({"id_produto": produto.id_produto}, status=201)

    def get(self, request):
        id_estabelecimento = request.query_params.get('id_estabelecimento')
        produtos = Produto.objects.filter(id_cardapio__id_estabelecimento=id_estabelecimento)
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data)


# QR CODE / PRESENÇA
class ConfirmarPresencaView(APIView):
    def post(self, request):
        try:
            estabelecimento = Estabelecimento.objects.get(qr_code=request.data.get('qr_code'))
        except Estabelecimento.DoesNotExist:
            return Response({"erro": "QR code invalido"}, status=404)

        try:
            usuario = Usuario.objects.get(pk=request.data.get('id_usuario'))
        except Usuario.DoesNotExist:
            return Response({"erro": "Usuario nao encontrado"}, status=400)

        Presenca.objects.create(
            id_usuario=usuario,
            id_estabelecimento=estabelecimento,
            qr_code=request.data.get('qr_code'),
            metodo='qr',
        )

        return Response({
            "mensagem": "presenca confirmada",
            "estabelecimento": estabelecimento.id_estabelecimento,
            "nome": estabelecimento.nome
        }, status=200)


class UploadImagemView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        arquivo = request.FILES.get('imagem')

        if not arquivo:
            return Response({"erro": "nenhum arquivo enviado"}, status=400)

        # gera nome único para o arquivo
        extensao = arquivo.name.split('.')[-1]
        nome_arquivo = f"{uuid.uuid4()}.{extensao}"
        caminho = os.path.join(settings.MEDIA_ROOT, nome_arquivo)

        # garante que a pasta media existe
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

        # salva o arquivo
        with open(caminho, 'wb+') as destino:
            for chunk in arquivo.chunks():
                destino.write(chunk)

        url = f"{settings.MEDIA_URL}{nome_arquivo}"
        return Response({"url": url}, status=201)


class PerfilView(APIView):
    def get(self, request):
        id_usuario = request.query_params.get('id_usuario')
        try:
            usuario = Usuario.objects.get(pk=id_usuario)
        except Usuario.DoesNotExist:
            return Response({"erro": "Usuário não encontrado"}, status=404)

        return Response({
            "id_usuario": usuario.id_usuario,
            "nome": usuario.nome,
            "username": usuario.username,
            "email": usuario.email,
            "telefone": usuario.telefone,
        }, status=200)

    def put(self, request):
        id_usuario = request.data.get('id_usuario')
        try:
            usuario = Usuario.objects.get(pk=id_usuario)
        except Usuario.DoesNotExist:
            return Response({"erro": "Usuário não encontrado"}, status=404)

        nome = request.data.get('nome')
        email = request.data.get('email')
        telefone = request.data.get('telefone')

        if email and email != usuario.email:
            if Usuario.objects.filter(email=email).exclude(pk=id_usuario).exists():
                return Response({"erro": "Email já cadastrado"}, status=400)

        if nome:
            usuario.nome = nome
        if email:
            usuario.email = email
        if telefone is not None:
            usuario.telefone = telefone

        usuario.save()

        return Response({
            "nome": usuario.nome,
            "email": usuario.email,
            "telefone": usuario.telefone,
        }, status=200)


class AlterarSenhaView(APIView):
    def post(self, request):
        id_usuario = request.data.get('id_usuario')
        senha_atual = request.data.get('senha_atual')
        nova_senha = request.data.get('nova_senha')

        try:
            usuario = Usuario.objects.get(pk=id_usuario)
        except Usuario.DoesNotExist:
            return Response({"erro": "Usuário não encontrado"}, status=404)

        if not check_password(senha_atual, usuario.senha):
            return Response({"erro": "Senha atual inválida"}, status=401)

        usuario.senha = make_password(nova_senha)
        usuario.save()

        return Response({"mensagem": "Senha alterada com sucesso"}, status=200)