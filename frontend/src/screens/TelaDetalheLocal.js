import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, TAMANHOS } from '../constants/tema';
import { POSTS_STATUS } from '../data/dadosMock';
import PostStatus from '../components/PostStatus';
import { postagensDoLocal } from '../services/api';

export default function TelaDetalheLocal({ route, navigation }) {
    const { local } = route.params;
    const [ehFavorito, setEhFavorito] = useState(false);

    // Posts desse local (mock por enquanto, depois vem da API)
    const [postLocal, setPostLocal]= useState([]);

    useEffect(()=>{
        carregarPosts();
    },[]);
    const carregarPosts = async() => {
        try {
            const idLocal= local.id_estabelecimento || local.id;
            const dados = await postagensDoLocal(idLocal);
            if(dados && dados.length > 0){
                setPostLocal(dados);
            }else{
                //Api respondeu mas nao tem posts usa mock
                const mock= POSTS_STATUS.filter((p)=>p.localId===idLocal);
                setPostLocal(mock);
            }
        }catch(erro){//Api nao respondeu
            const mock = POSTS_STATUS.filter((p)=> p.localId===(local.id_estabelecimento || local.id));
            setPostLocal(mock);
        }
    };

    // Verifica se já é favorito ao abrir a tela
    useEffect(() => {
        verificarFavorito();
    }, []);

    const verificarFavorito = async () => {
        try {
            const dados = await AsyncStorage.getItem('favoritosEstabelecimentos');
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
            const dados = await AsyncStorage.getItem('favoritosEstabelecimentos');
            let favoritos = dados ? JSON.parse(dados) : [];
            const idLocal = local.id_estabelecimento || local.id;

            if (ehFavorito) {
                // Remove dos favoritos
                favoritos = favoritos.filter(
                    (f) => (f.id_estabelecimento || f.id) !== idLocal
                );
                setEhFavorito(false);
            } else {
                // Adiciona aos favoritos
                favoritos.push(local);
                setEhFavorito(true);
            }

            await AsyncStorage.setItem('favoritosEstabelecimentos', JSON.stringify(favoritos));
            // TODO: integrar com API quando Eduardo criar endpoint de favoritar estabelecimento
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
