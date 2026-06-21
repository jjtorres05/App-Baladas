import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, TAMANHOS } from '../constants/tema';
import { POSTS_STATUS } from '../data/dadosMock';
import PostStatus from '../components/PostStatus';
import { postagensDoLocal, eventosDoLocal, listarProdutos } from '../services/api';

export default function TelaDetalheLocal({ route, navigation }) {
    const { local } = route.params;
    const [ehFavorito, setEhFavorito] = useState(false);

    const [postLocal, setPostLocal] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const idLocal = local.id_estabelecimento || local.id;
        carregarPosts(idLocal);
        carregarEventos(idLocal);
        carregarCardapio(idLocal);
    }, []);

    const carregarPosts = async (idLocal) => {
        try {
            const dados = await postagensDoLocal(idLocal);
            if (dados && dados.length > 0) {
                setPostLocal(dados);
            } else {
                const mock = POSTS_STATUS.filter((p) => p.localId === idLocal);
                setPostLocal(mock);
            }
        } catch (erro) {
            const mock = POSTS_STATUS.filter((p) => p.localId === (local.id_estabelecimento || local.id));
            setPostLocal(mock);
        }
    };

    const carregarEventos = async (idLocal) => {
        try {
            const dados = await eventosDoLocal(idLocal);
            if (dados) setEventos(dados);
        } catch (erro) {
            console.log('Sem eventos');
        }
    };

    const carregarCardapio = async (idLocal) => {
        try {
            const dados = await listarProdutos(idLocal);
            if (dados) setProdutos(dados);
        } catch (erro) {
            console.log('Sem cardápio');
        }
    };

    // Verifica se já é favorito ao abrir a tela
    useEffect(() => {
        verificarFavorito();
    }, []);

    const verificarFavorito = async () => {
        try {
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const chave = `favoritosEstabelecimentos_${idUsuario}`;
            const dados = await AsyncStorage.getItem(chave);
            if (dados) {
                const favoritos = JSON.parse(dados);
                const idLocal = local.id_estabelecimento || local.id;
                const existe = favoritos.some(
                    (f) => (f.id_estabelecimento || f.id) === idLocal
                );
                setEhFavorito(existe);
            }
        } catch (erro) {
            console.error('Erro ao verificar favorito:', erro);
        }
    };

    const alternarFavorito = async () => {
        try {
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const chave = `favoritosEstabelecimentos_${idUsuario}`;
            const dados = await AsyncStorage.getItem(chave);
            let favoritos = dados ? JSON.parse(dados) : [];
            const idLocal = local.id_estabelecimento || local.id;

            if (ehFavorito) {
                favoritos = favoritos.filter(
                    (f) => (f.id_estabelecimento || f.id) !== idLocal
                );
                setEhFavorito(false);
            } else {
                favoritos.push(local);
                setEhFavorito(true);
            }

            await AsyncStorage.setItem(chave, JSON.stringify(favoritos));
        } catch (erro) {
            console.error('Erro ao alterar favorito:', erro);
        }
    };

    const compartilhar = async () => {
        try {
            await Share.share({
                message: `Confere esse lugar: ${local.nome}! Baixe o Qual a Boa para ver mais.`,
            });
        } catch (erro) {
            console.error('Erro ao compartilhar:', erro);
        }
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cabeçalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto} />
                    </TouchableOpacity>
                    <Text style={estilos.nomeLocal} numberOfLines={1}>{local.nome}</Text>
                    <View style={estilos.botoesHeader}>
                        <TouchableOpacity onPress={compartilhar} style={estilos.botaoHeader}>
                            <Ionicons name="share-outline" size={22} color={CORES.texto} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={alternarFavorito} style={estilos.botaoHeader}>
                            <Ionicons
                                name={ehFavorito ? 'bookmark' : 'bookmark-outline'}
                                size={22}
                                color={ehFavorito ? CORES.secundaria : CORES.texto}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Imagem */}
                <Image source={{ uri: local.imagem }} style={estilos.imagemPrincipal} />

                {/* Info rápida */}
                <View style={estilos.barraInfo}>
                    <View style={estilos.itemInfo}>
                        <Ionicons name="star" size={16} color={CORES.secundaria} />
                        <Text style={estilos.textoInfo}>{local.avaliacao || local.media_nota || '—'}</Text>
                    </View>
                    <View style={estilos.itemInfo}>
                        <View style={[estilos.bolinha, { backgroundColor: local.aberto ? CORES.sucesso : CORES.perigo }]} />
                        <Text style={estilos.textoInfo}>{local.aberto ? 'Aberto' : 'Fechado'}</Text>
                    </View>
                    {local.preco && (
                        <View style={estilos.itemInfo}>
                            <Text style={estilos.textoInfo}>{local.preco}</Text>
                        </View>
                    )}
                    <View style={estilos.itemInfo}>
                        <Ionicons name="chatbubble-outline" size={16} color={CORES.textoSecundario} />
                        <Text style={estilos.textoInfo}>{postLocal.length} opiniões</Text>
                    </View>
                </View>

                {/* Descrição */}
                <View style={estilos.secao}>
                    <Text style={estilos.tituloSecao}>Descrição</Text>
                    <Text style={estilos.descricao}>{local.descricao}</Text>
                </View>

                {/* Endereço e telefone */}
                {(local.endereco || local.telefone) && (
                    <View style={estilos.secao}>
                        {local.endereco && (
                            <View style={estilos.linhaDetalhe}>
                                <Ionicons name="location-outline" size={18} color={CORES.primaria} />
                                <Text style={estilos.textoDetalhe}>{local.endereco}</Text>
                            </View>
                        )}
                        {local.telefone && (
                            <View style={estilos.linhaDetalhe}>
                                <Ionicons name="call-outline" size={18} color={CORES.primaria} />
                                <Text style={estilos.textoDetalhe}>{local.telefone}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Eventos */}
                {eventos.length > 0 && (
                    <View style={estilos.secao}>
                        <Text style={estilos.tituloSecao}>Eventos</Text>
                        {eventos.map((evento) => (
                            <View key={evento.id_postagem} style={estilos.cartaoEvento}>
                                {evento.imagem && (
                                    <Image source={{ uri: evento.imagem }} style={estilos.imagemEvento} />
                                )}
                                <Text style={estilos.tituloEvento}>{evento.titulo}</Text>
                                {evento.data_evento && (
                                    <View style={estilos.linhaDetalhe}>
                                        <Ionicons name="calendar-outline" size={16} color={CORES.primaria} />
                                        <Text style={estilos.textoDetalhe}>{evento.data_evento}</Text>
                                    </View>
                                )}
                                <Text style={estilos.descricao}>{evento.descricao}</Text>
                                {evento.promocao && (
                                    <View style={estilos.badgePromocao}>
                                        <Ionicons name="pricetag-outline" size={14} color={CORES.secundaria} />
                                        <Text style={estilos.textoPromocao}>{evento.promocao}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Cardápio */}
                {produtos.length > 0 && (
                    <View style={estilos.secao}>
                        <Text style={estilos.tituloSecao}>Cardápio</Text>
                        {produtos.map((item) => (
                            <View key={item.id_produto || item.id} style={estilos.itemProduto}>
                                <View style={{ flex: 1 }}>
                                    <Text style={estilos.nomeProduto}>{item.nome}</Text>
                                    {item.descricao && <Text style={estilos.descProduto}>{item.descricao}</Text>}
                                </View>
                                <Text style={estilos.precoProduto}>R$ {item.preco}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Opiniões / Status */}
                <View style={estilos.secao}>
                    <Text style={estilos.tituloSecao}>Opiniões recentes</Text>
                    {postLocal.length > 0 ? (
                        postLocal.map((post) => <PostStatus key={post.id || post.id_postagem} post={post} />)
                    ) : (
                        <Text style={estilos.semPosts}>Nenhuma opinião ainda. Seja o primeiro!</Text>
                    )}
                </View>

                {/* Botão avaliar */}
                <TouchableOpacity
                    style={estilos.botaoAvaliar}
                    onPress={() => navigation.navigate('FormAvaliacao', { local })}
                >
                    <Ionicons name="create-outline" size={20} color={CORES.fundo} />
                    <Text style={estilos.textoBotaoAvaliar}>Enviar meu status</Text>
                </TouchableOpacity>
                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingVertical: 12,
    },
    nomeLocal: {
        color: CORES.texto,
        fontSize: TAMANHOS.xl,
        fontWeight: 'bold',
        flex: 1,
        marginHorizontal: 12,
    },
    botoesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    botaoHeader: {
        marginLeft: 12,
        padding: 4,
    },
    imagemPrincipal: { width: '100%', height: 220 },
    barraInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingVertical: 12,
        gap: 16,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bolinha: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    textoInfo: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.md,
        marginLeft: 4,
    },
    secao: {
        paddingHorizontal: TAMANHOS.espacamento,
        marginTop: 8,
    },
    tituloSecao: {
        color: CORES.texto,
        fontSize: TAMANHOS.lg,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    descricao: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.md,
        lineHeight: 20,
    },
    linhaDetalhe: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    textoDetalhe: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.md,
        marginLeft: 8,
    },
    semPosts: {
        color: CORES.textoMudo,
        fontSize: TAMANHOS.md,
        textAlign: 'center',
        marginTop: 20,
    },
    cartaoEvento: {
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        padding: 14,
        marginBottom: 10,
    },
    imagemEvento: {
        width: '100%',
        height: 150,
        borderRadius: TAMANHOS.raio,
        marginBottom: 10,
    },
    tituloEvento: {
        color: CORES.texto,
        fontSize: TAMANHOS.lg,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    badgePromocao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.cartao,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    textoPromocao: {
        color: CORES.secundaria,
        fontSize: TAMANHOS.sm,
        fontWeight: '600',
        marginLeft: 4,
    },
    itemProduto: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.superficie,
        padding: 14,
        borderRadius: TAMANHOS.raio,
        marginBottom: 8,
    },
    nomeProduto: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    descProduto: { color: CORES.textoMudo, fontSize: TAMANHOS.sm, marginTop: 2 },
    precoProduto: { color: CORES.secundaria, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    botaoAvaliar: {
        backgroundColor: CORES.secundaria,
        marginHorizontal: TAMANHOS.espacamento,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: TAMANHOS.raio,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    textoBotaoAvaliar: {
        color: CORES.fundo,
        fontSize: TAMANHOS.lg,
        fontWeight: 'bold',
    },
});
