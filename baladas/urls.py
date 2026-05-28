from django.urls import path
from .views import (
    EstabelecimentoListView,
    CadastrarEstabelecimentoView,
    PostagemClienteView,
    PostagemEstabelecimentoView,
    EventoView,
    ReacaoView,
    DenunciaView,
    FavoritarView,
    CompartilharPostagemView,
    ProdutoView,
    ConfirmarPresencaView,
)

urlpatterns = [
    path("estabelecimentos/", EstabelecimentoListView.as_view()),
    path("estabelecimentos/cadastrar/", CadastrarEstabelecimentoView.as_view()),
    path("postagens/cliente/", PostagemClienteView.as_view()),
    path("postagens/estabelecimento/", PostagemEstabelecimentoView.as_view()),
    path("postagens/evento/", EventoView.as_view()),
    path("reacoes/", ReacaoView.as_view()),
    path("denuncias/", DenunciaView.as_view()),
    path("favoritar/", FavoritarView.as_view()),
    path("compartilhar/<int:id_postagem>/", CompartilharPostagemView.as_view()),
    path("cardapio/", ProdutoView.as_view()),
    path("presenca/", ConfirmarPresencaView.as_view()),
]
