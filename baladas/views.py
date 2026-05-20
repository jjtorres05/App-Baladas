from rest_framework.views import APIView
from django.db.models import Avg
from rest_framework.response import Response
from .models import (
    Usuario,
    Cliente,
    Proprietario,
    Estabelecimento,
    Cardapio,
    Produto,
    Postagem,
    PostagemCliente,
    PostagemEstabelecimento,
    Foto,
    Denuncia,
    Reacao,
    Favoritar,
    Endereco,
    Cpf,
)
from .serializers import (
    UsuarioSerializer,
    ClienteSerializer,
    ProprietarioSerializer,
    EstabelecimentoSerializer,
    CardapioSerializer,
    ProdutoSerializer,
    PostagemSerializer,
    PostagemClienteSerializer,
    PostagemEstabelecimentoSerializer,
    FotoSerializer,
    DenunciaSerializer,
    ReacaoSerializer,
    FavoritarSerializer,
    EnderecoSerializer,
    CpfSerializer,
)


class EstabelecimentoListView(APIView):
    def get(self, request):
        ordem = request.query_params.get("ordem", None)
        nome = request.query_params.get("nome", None)

        estabelecimentos = Estabelecimento.objects.annotate(
            ticket_medio=Avg("cardapio__produto__preco"),
            media_nota=Avg(
                "id_proprietario__id_usuario__postagem__postagemcliente__nota"
            ),
        )

        if nome:
            estabelecimentos = estabelecimentos.filter(nome__icontains=nome)

        if ordem == "alfabetica":
            estabelecimentos = estabelecimentos.order_by("nome")

        elif ordem == "ticket":
            estabelecimentos = estabelecimentos.order_by("ticket_medio")

        elif ordem == "nota":
            estabelecimentos = estabelecimentos.order_by("-media_nota")

        serializer = EstabelecimentoSerializer(estabelecimentos, many=True)
        return Response(serializer.data)


class PostagemClienteView(APIView):
    def post(self, request):
        postagem_data = {
            "id_usuario": request.data.get("id_usuario"),
            "legenda": request.data.get("legenda"),
            "avaliacoes": 0,
        }

        postagem = Postagem.objects.create(**postagem_data)

        postagem_cliente = PostagemCliente.objects.create(
            id_postagem=postagem, nota=request.data.get("nota")
        )

        url_foto = request.data.get("url_foto", None)
        if url_foto:
            Foto.objects.create(
                url=url_foto, id_usuario=postagem.id_usuario, id_postagem=postagem
            )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class PostagemEstabelecimentoView(APIView):
    def post(self, request):
        postagem_data = {
            "id_usuario": request.data.get("id_usuario"),
            "legenda": request.data.get("legenda"),
        }

        postagem = Postagem.objects.create(**postagem_data)

        postagem_estabelecimento = PostagemEstabelecimento.objects.create(
            id_postagem=postagem, promocoes=request.data.get("promocoes", None)
        )

        url_foto = request.data.get("url_foto", None)
        if url_foto:
            Foto.objects.create(
                url=url_foto, id_usuario=postagem.id_usuario, id_postagem=postagem
            )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class ReacaoView(APIView):
    def post(self, request):

        tipo = request.data.get("tipo_reacao")
        if tipo not in ["concordar", "discordar"]:
            return Response(
                {"erro": "tipo_reacao deve ser 'concordar' ou 'discordar'"}, status=400
            )

        reacao = Reacao.objects.create(
            id_usuario=Usuario.objects.get(pk=request.data.get("id_usuario")),
            id_postagem_cliente=PostagemCliente.objects.get(
                pk=request.data.get("id_postagem")
            ),
            tipo_reacao=tipo,
        )

        return Response({"id_reacao": reacao.id_reacao}, status=201)


class DenunciaView(APIView):
    def post(self, request):

        tipo = request.data.get("tipo_denuncia")
        if tipo not in ["ofensivo", "spam", "inapropriado"]:
            return Response({"erro": "tipo_denuncia invalido"}, status=400)

        denuncia = Denuncia.objects.create(
            id_usuario_autor=Usuario.objects.get(pk=request.data.get("id_usuario")),
            id_postagem_alvo=Postagem.objects.get(pk=request.data.get("id_postagem")),
            tipo_denuncia=tipo,
        )

        return Response({"id_denuncia": denuncia.id_denuncia}, status=201)


class FavoritarView(APIView):
    def post(self, request):
        cliente = Cliente.objects.get(pk=request.data.get("id_usuario"))
        postagem_cliente = PostagemCliente.objects.get(
            pk=request.data.get("id_postagem")
        )

        ja_favoritou = Favoritar.objects.filter(
            id_usuario=cliente, id_postagem_cliente=postagem_cliente
        ).exists()

        if ja_favoritou:
            return Response({"erro": "postagem já favoritada"}, status=400)

        Favoritar.objects.create(
            id_usuario=cliente, id_postagem_cliente=postagem_cliente
        )

        return Response({"mensagem": "favoritado com sucesso"}, status=201)

    def delete(self, request):
        cliente = Cliente.objects.get(pk=request.data.get("id_usuario"))
        postagem_cliente = PostagemCliente.objects.get(
            pk=request.data.get("id_postagem")
        )

        Favoritar.objects.filter(
            id_usuario=cliente, id_postagem_cliente=postagem_cliente
        ).delete()

        return Response({"mensagem": "favoritado removido"}, status=200)


class CompartilharPostagemView(APIView):
    def get(self, request, id_postagem):
        postagem = Postagem.objects.get(pk=id_postagem)
        serializer = PostagemSerializer(postagem)
        return Response(serializer.data, status=200)


class CadastrarEstabelecimentoView(APIView):
    def post(self, request):
        proprietario = Proprietario.objects.get(pk=request.data.get("id_proprietario"))

        endereco = Endereco.objects.create(
            rua=request.data.get("rua"),
            bairro=request.data.get("bairro"),
            numero=request.data.get("numero"),
            complemento=request.data.get("complemento", None),
            id_usuario=proprietario.id_usuario,
        )

        import uuid

        qr_code = str(uuid.uuid4())

        estabelecimento = Estabelecimento.objects.create(
            id_proprietario=proprietario, id_endereco=endereco, qr_code=qr_code
        )

        return Response(
            {
                "id_estabelecimento": estabelecimento.id_estabelecimento,
                "qr_code": estabelecimento.qr_code,
            },
            status=201,
        )

    def get(self, request):
        id_proprietario = request.query_params.get("id_proprietario")
        estabelecimentos = Estabelecimento.objects.filter(
            id_proprietario=id_proprietario
        )
        serializer = EstabelecimentoSerializer(estabelecimentos, many=True)
        return Response(serializer.data)


class EventoView(APIView):
    def post(self, request):
        proprietario = Proprietario.objects.get(pk=request.data.get("id_proprietario"))

        postagem = Postagem.objects.create(
            id_usuario=proprietario.id_usuario,
            legenda=request.data.get("legenda"),
            avaliacoes=0,
        )

        PostagemEstabelecimento.objects.create(
            id_postagem=postagem, promocoes=request.data.get("promocoes", None)
        )

        url_foto = request.data.get("url_foto", None)
        if url_foto:
            Foto.objects.create(
                url=url_foto, id_usuario=proprietario.id_usuario, id_postagem=postagem
            )

        return Response({"id_postagem": postagem.id_postagem}, status=201)


class ProdutoView(APIView):
    # adicionar produto ao cardápio
    def post(self, request):
        cardapio = Cardapio.objects.filter(
            id_estabelecimento=request.data.get("id_estabelecimento")
        ).first()

        if not cardapio:
            cardapio = Cardapio.objects.create(
                id_estabelecimento=Estabelecimento.objects.get(
                    pk=request.data.get("id_estabelecimento")
                )
            )

        produto = Produto.objects.create(
            id_cardapio=cardapio,
            nome=request.data.get("nome"),
            preco=request.data.get("preco"),
            descricao=request.data.get("descricao", None),
        )

        return Response({"id_produto": produto.id_produto}, status=201)

    def get(self, request):
        id_estabelecimento = request.query_params.get("id_estabelecimento")
        produtos = Produto.objects.filter(
            id_cardapio__id_estabelecimento=id_estabelecimento
        )
        serializer = ProdutoSerializer(produtos, many=True)
        return Response(serializer.data)


class ConfirmarPresencaView(APIView):
    def post(self, request):
        qr_code = request.data.get("qr_code")
        id_usuario = request.data.get("id_usuario")

        try:
            estabelecimento = Estabelecimento.objects.get(qr_code=qr_code)
        except Estabelecimento.DoesNotExist:
            return Response({"erro": "QR code invalido"}, status=404)

        try:
            cliente = Cliente.objects.get(pk=id_usuario)
        except Cliente.DoesNotExist:
            return Response({"erro": "Usuario nao e cliente"}, status=400)

        return Response(
            {
                "mensagem": "presenca confirmada",
                "estabelecimento": estabelecimento.id_estabelecimento,
            },
            status=200,
        )
