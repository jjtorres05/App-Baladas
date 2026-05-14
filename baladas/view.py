from rest_framework.views import APIView
from django.db.models import Avg
from rest_framework.response import Response
from .models import Estabelecimento
from .serializers import EstabelecimentoSerializer


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
