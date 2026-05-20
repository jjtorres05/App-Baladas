from rest_framework import serializers
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


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"


class ProprietarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proprietario
        fields = "__all__"


class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = "__all__"


class CpfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cpf
        fields = "__all__"


class EstabelecimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estabelecimento
        fields = "__all__"


class CardapioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cardapio
        fields = "__all__"


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = "__all__"


class PostagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postagem
        fields = "__all__"


class PostagemClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostagemCliente
        fields = "__all__"


class PostagemEstabelecimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostagemEstabelecimento
        fields = "__all__"


class FotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foto
        fields = "__all__"


class DenunciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = "__all__"


class ReacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reacao
        fields = "__all__"


class FavoritarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favoritar
        fields = "__all__"
