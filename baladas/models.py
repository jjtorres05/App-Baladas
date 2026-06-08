from django.db import models


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    username = models.CharField(unique=True, max_length=50)
    email = models.CharField(unique=True, max_length=100, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    senha = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'usuario'


class Cliente(models.Model):
    id_usuario = models.OneToOneField(Usuario, models.DO_NOTHING, db_column='id_usuario', primary_key=True)
    favorito = models.BooleanField(blank=True, null=True)
    curtido = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cliente'


class Proprietario(models.Model):
    id_usuario = models.OneToOneField(Usuario, models.DO_NOTHING, db_column='id_usuario', primary_key=True)

    class Meta:
        managed = False
        db_table = 'proprietario'


class Endereco(models.Model):
    id_endereco = models.AutoField(primary_key=True)
    rua = models.CharField(max_length=100, blank=True, null=True)
    bairro = models.CharField(max_length=50, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=100, blank=True, null=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'endereco'


class Cpf(models.Model):
    id_cpf = models.AutoField(primary_key=True)
    numero = models.CharField(unique=True, max_length=11)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')

    class Meta:
        managed = False
        db_table = 'cpf'


class Estabelecimento(models.Model):
    id_estabelecimento = models.AutoField(primary_key=True)
    id_proprietario = models.ForeignKey(Proprietario, models.DO_NOTHING, db_column='id_proprietario')
    qr_code = models.TextField(unique=True, blank=True, null=True)
    id_endereco = models.ForeignKey(Endereco, models.DO_NOTHING, db_column='id_endereco', blank=True, null=True)
    nome = models.CharField(max_length=100, blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    imagem = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    aberto = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'estabelecimento'


class Cardapio(models.Model):
    id_cardapio = models.AutoField(primary_key=True)
    id_estabelecimento = models.ForeignKey(Estabelecimento, models.DO_NOTHING, db_column='id_estabelecimento')
    data_criado = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cardapio'


class Produto(models.Model):
    id_produto = models.AutoField(primary_key=True)
    id_cardapio = models.ForeignKey(Cardapio, models.DO_NOTHING, db_column='id_cardapio')
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField(blank=True, null=True)
    data_incluido = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'produto'


class Postagem(models.Model):
    id_postagem = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_estabelecimento = models.ForeignKey(Estabelecimento, models.DO_NOTHING, db_column='id_estabelecimento', blank=True, null=True)
    legenda = models.TextField(blank=True, null=True)
    avaliacoes = models.IntegerField(blank=True, null=True)
    data_postagem = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'postagem'


class PostagemCliente(models.Model):
    id_postagem = models.OneToOneField(Postagem, models.DO_NOTHING, db_column='id_postagem', primary_key=True)
    nota = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'postagem_cliente'


class PostagemEstabelecimento(models.Model):
    id_postagem = models.OneToOneField(Postagem, models.DO_NOTHING, db_column='id_postagem', primary_key=True)
    promocoes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'postagem_estabelecimento'


class Foto(models.Model):
    id_foto = models.AutoField(primary_key=True)
    url = models.TextField()
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_postagem = models.ForeignKey(Postagem, models.DO_NOTHING, db_column='id_postagem', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'foto'


class Denuncia(models.Model):
    id_denuncia = models.AutoField(primary_key=True)
    id_usuario_autor = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario_autor')
    id_postagem_alvo = models.ForeignKey(Postagem, models.DO_NOTHING, db_column='id_postagem_alvo', blank=True, null=True)
    tipo_denuncia = models.CharField(max_length=50, blank=True, null=True)
    numero_registro = models.CharField(max_length=50, blank=True, null=True)
    data_feita = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'denuncia'


class Reacao(models.Model):
    id_reacao = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, models.DO_NOTHING, db_column='id_usuario')
    id_postagem_cliente = models.ForeignKey(PostagemCliente, models.DO_NOTHING, db_column='id_postagem_cliente')
    tipo_reacao = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reacao'


class Favoritar(models.Model):
    pk = models.CompositePrimaryKey('id_usuario', 'id_postagem_cliente')
    id_usuario = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='id_usuario')
    id_postagem_cliente = models.ForeignKey(PostagemCliente, models.DO_NOTHING, db_column='id_postagem_cliente')

    class Meta:
        managed = False
        db_table = 'favoritar'