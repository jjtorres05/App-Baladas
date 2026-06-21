from django.urls import path
from .views import (
    CadastroView,
    LoginView,
    EstabelecimentoListView,
    CadastrarEstabelecimentoView,
    PostagemClienteView,
    PostagemEstabelecimentoView,
    PostagensEstabelecimentoView,
    EventosEstabelecimentoView,
    EventoView,
    ReacaoView,
    DenunciaView,
    FavoritarView,
    CompartilharPostagemView,
    ProdutoView,
    ConfirmarPresencaView,
    UploadImagemView,
)

urlpatterns = [
    # auth
    path('cadastro/', CadastroView.as_view()),
    path('login/', LoginView.as_view()),

    # estabelecimentos
    path('estabelecimentos/', EstabelecimentoListView.as_view()),
    path('estabelecimentos/cadastrar/', CadastrarEstabelecimentoView.as_view()),

    # postagens
    path('postagens/cliente/', PostagemClienteView.as_view()),
    path('postagens/estabelecimento/', PostagemEstabelecimentoView.as_view()),
    path('postagens/evento/', EventoView.as_view()),
    path('postagens/', PostagensEstabelecimentoView.as_view()),
    path('eventos/', EventosEstabelecimentoView.as_view()),

    # interações
    path('reacoes/', ReacaoView.as_view()),
    path('denuncias/', DenunciaView.as_view()),
    path('favoritar/', FavoritarView.as_view()),
    path('compartilhar/<int:id_postagem>/', CompartilharPostagemView.as_view()),

    # cardápio
    path('cardapio/', ProdutoView.as_view()),

    # qr code
    path('presenca/', ConfirmarPresencaView.as_view()),

    # upload
    path('upload/', UploadImagemView.as_view()),
]