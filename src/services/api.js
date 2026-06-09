import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Trocar IP pela do computador que corre Django
const BASE_URL = 'http://192.168.1.XX:8000/api';

// HELPER PRINCIPAL — Todas as funcoes usam isso por dentro
// Agrega token JWT automáticamente a cada request
const requisicao = async (endpoint, opcoes = {}) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            ...opcoes.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const resposta = await fetch(`${BASE_URL}${endpoint}`, {
            ...opcoes,
            headers,
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro na requisição');
        }

        return dados;
    } catch (erro) {
        console.error('Erro API:', erro);
        throw erro;
    }
};


// AUTENTICAÇÃO
// POST /api/login/
// Usado en: TelaLogin
export const login = async (email, senha) => {
    const dados = await requisicao('/login/', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });

    // Guarda token e datos d usuario en el celular
    await AsyncStorage.setItem('token', dados.access);
    await AsyncStorage.setItem('refreshToken', dados.refresh);
    await AsyncStorage.setItem('idUsuario', String(dados.id_usuario));
    await AsyncStorage.setItem('username', dados.username);

    return dados;
};

// POST /api/cadastro/
// Usado TelaCadastro
export const registro = async (nome, username, email, senha, tipo = 'cliente') => {
    const dados = await requisicao('/cadastro/', {
        method: 'POST',
        body: JSON.stringify({ nome, username, email, senha, tipo }),
    });

    await AsyncStorage.setItem('token', dados.access);
    await AsyncStorage.setItem('refreshToken', dados.refresh);
    await AsyncStorage.setItem('idUsuario', String(dados.id_usuario));
    await AsyncStorage.setItem('username', dados.username);

    return dados;
};

// apaga todo do celular
// Usado em: TelaPerfil
export const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'refreshToken', 'idUsuario', 'username']);
};

// Usado en: NavegadorPrincipal (al abrir la app)
export const getUsuarioLogado = async () => {
    const idUsuario = await AsyncStorage.getItem('idUsuario');
    const username = await AsyncStorage.getItem('username');
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;
    return { idUsuario, username, token };
};


// ESTABELECIMENTOS

// GET /api/estabelecimentos/
// Usado en: TelaHome, TelaExplorar, TelaMapa
// Filtros opcionales: { nome, categoria, aberto, ordem }
export const listarEstabelecimentos = (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return requisicao(`/estabelecimentos/${params ? '?' + params : ''}`);
};

// POST /api/estabelecimentos/cadastrar/
// Usado en: TelaCadastroEstabelecimento
export const cadastrarEstabelecimento = (dados) =>
    requisicao('/estabelecimentos/cadastrar/', {
        method: 'POST',
        body: JSON.stringify(dados),
    });

// GET /api/estabelecimentos/cadastrar/?id_proprietario=X
// Usado en: TelaMeusEstabelecimentos, TelaPostarEvento, TelaGerenciarCardapio
export const meusEstabelecimentos = (idProprietario) =>
    requisicao(`/estabelecimentos/cadastrar/?id_proprietario=${idProprietario}`);

// POSTAGENS


// GET /api/postagens/?id_estabelecimento=X
// Usado en: TelaDetalheLocal (ver reviews de un bar)
export const postagensDoLocal = (idEstabelecimento) =>
    requisicao(`/postagens/?id_estabelecimento=${idEstabelecimento}`);

// POST /api/postagens/cliente/
// Usado en: TelaFormAvaliacao (cliente hace review)
export const postagemCliente = (dados) =>
    requisicao('/postagens/cliente/', {
        method: 'POST',
        body: JSON.stringify(dados),
    });

// POST /api/postagens/estabelecimento/
// Usado en: Publicación del dueño
export const postagemEstabelecimento = (dados) =>
    requisicao('/postagens/estabelecimento/', {
        method: 'POST',
        body: JSON.stringify(dados),
    });

// POST /api/postagens/evento/
// Usado en: TelaPostarEvento
export const postagemEvento = (dados) =>
    requisicao('/postagens/evento/', {
        method: 'POST',
        body: JSON.stringify(dados),
    });

// GET /api/compartilhar/:id_postagem/
// Usado en: Compartir un post
export const compartilharPostagem = (idPostagem) =>
    requisicao(`/compartilhar/${idPostagem}/`);


// CARDÁPIO

// POST /api/cardapio/
// Usado en: TelaGerenciarCardapio (agregar producto)
export const adicionarProduto = (dados) =>
    requisicao('/cardapio/', {
        method: 'POST',
        body: JSON.stringify(dados),
    });

// GET /api/cardapio/?id_estabelecimento=X
// Usado en: TelaGerenciarCardapio (listar productos)
export const listarProdutos = (idEstabelecimento) =>
    requisicao(`/cardapio/?id_estabelecimento=${idEstabelecimento}`);


// interacoes

// POST /api/reacoes/
// Usado en: Feed (concordar/discordar en un review)
export const reagir = (idUsuario, idPostagem, tipoReacao) =>
    requisicao('/reacoes/', {
        method: 'POST',
        body: JSON.stringify({
            id_usuario: idUsuario,
            id_postagem: idPostagem,
            tipo_reacao: tipoReacao, // 'concordar' o 'discordar'
        }),
    });

// POST /api/favoritar/
// Usado en: Feed (guardar post en favoritos)
export const favoritar = (idUsuario, idPostagem) =>
    requisicao('/favoritar/', {
        method: 'POST',
        body: JSON.stringify({
            id_usuario: idUsuario,
            id_postagem: idPostagem,
        }),
    });

// DELETE /api/favoritar/
// Usado en: Feed (quitar de favoritos)
export const desfavoritar = (idUsuario, idPostagem) =>
    requisicao('/favoritar/', {
        method: 'DELETE',
        body: JSON.stringify({
            id_usuario: idUsuario,
            id_postagem: idPostagem,
        }),
    });

// POST /api/denuncias/
// Usado en: Feed (reportar post)
export const denunciar = (idUsuario, idPostagem, tipoDenuncia) =>
    requisicao('/denuncias/', {
        method: 'POST',
        body: JSON.stringify({
            id_usuario: idUsuario,
            id_postagem: idPostagem,
            tipo_denuncia: tipoDenuncia, // 'ofensivo', 'spam', 'inapropriado'
        }),
    });

// QR CODE / PRESENÇA
// POST /api/presenca/
// Usado en: Escaneo de QR code en el local
export const confirmarPresenca = (idUsuario, qrCode) =>
    requisicao('/presenca/', {
        method: 'POST',
        body: JSON.stringify({
            id_usuario: idUsuario,
            qr_code: qrCode,
        }),
    });

// UPLOAD DE IMAGEN

// POST /api/upload/
// Usado en: Cualquier pantalla que sube foto (Cadastro, PostarEvento, etc.)
// NOTA: Esta función NO usa el helper requisicao porque manda FormData, no JSON
export const uploadImagem = async (uri) => {
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('imagem', {
        uri: uri,
        type: 'image/jpeg',
        name: 'foto.jpg',
    });

    const resposta = await fetch(`${BASE_URL}/upload/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // NO poner Content-Type aquí, fetch lo agrega automático con el boundary
        },
        body: formData,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao enviar imagem');
    }

    // Retorna la URL completa de la imagen
    // Backend retorna: { url: "/media/abc123.jpg" }
    // Convertimos a: "http://192.168.1.XX:8000/media/abc123.jpg"
    return `${BASE_URL.replace('/api', '')}${dados.url}`;
};
