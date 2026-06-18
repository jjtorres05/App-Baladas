import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CORES, TAMANHOS } from '../constants/tema';

export default function TelaFavoritos({ navigation }) {
    const [favoritos, setFavoritos] = useState([]);

    // Carrega favoritos cada vez que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            carregarFavoritos();
        }, [])
    );

    const carregarFavoritos = async () => {
        try {
            const dados = await AsyncStorage.getItem('favoritosEstabelecimentos');
            if (dados) {
                setFavoritos(JSON.parse(dados));
            }
        } catch (erro) {
            console.error('Erro ao carregar favoritos:', erro);
        }
    };

    const removerFavorito = async (idEstabelecimento) => {
        try {
            const novaLista = favoritos.filter(
                (f) => f.id_estabelecimento !== idEstabelecimento && f.id !== idEstabelecimento
            );
            setFavoritos(novaLista);
            await AsyncStorage.setItem('favoritosEstabelecimentos', JSON.stringify(novaLista));
        } catch (erro) {
            console.error('Erro ao remover favorito:', erro);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={estilos.cartao}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DetalheLocal', { local: item })}
        >
            <Image
                source={{ uri: item.imagem }}
                style={estilos.imagemCartao}
            />
            <View style={estilos.infoCartao}>
                <Text style={estilos.nomeLocal} numberOfLines={1}>{item.nome}</Text>
                <Text style={estilos.categoriaLocal} numberOfLines={1}>{item.categoria}</Text>
                <View style={estilos.linhaInfo}>
                    <Ionicons name="star" size={14} color={CORES.secundaria} />
                    <Text style={estilos.avaliacao}>{item.avaliacao || item.media_nota || '—'}</Text>
                    <View style={[estilos.badgeStatus, { backgroundColor: item.aberto ? CORES.sucesso : CORES.perigo }]} />
                    <Text style={estilos.textoStatus}>{item.aberto ? 'Aberto' : 'Fechado'}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={estilos.botaoRemover}
                onPress={() => removerFavorito(item.id_estabelecimento || item.id)}
            >
                <Ionicons name="bookmark" size={24} color={CORES.secundaria} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.cabecalho}>Favoritos</Text>

            {favoritos.length > 0 ? (
                <FlatList
                    data={favoritos}
                    keyExtractor={(item) => String(item.id_estabelecimento || item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={estilos.lista}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={estilos.vazio}>
                    <Ionicons name="bookmark-outline" size={60} color={CORES.textoMudo} />
                    <Text style={estilos.textoVazio}>Nenhum favorito ainda</Text>
                    <Text style={estilos.textoSubVazio}>
                        Toque no ícone de bookmark em um estabelecimento para salvá-lo aqui
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: {
        color: CORES.texto,
        fontSize: TAMANHOS.xl,
        fontWeight: 'bold',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingTop: 16,
        paddingBottom: 12,
    },
    lista: { paddingHorizontal: TAMANHOS.espacamento },
    cartao: {
        flexDirection: 'row',
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        marginBottom: 12,
        overflow: 'hidden',
        alignItems: 'center',
    },
    imagemCartao: {
        width: 90,
        height: 90,
    },
    infoCartao: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    nomeLocal: {
        color: CORES.texto,
        fontSize: TAMANHOS.lg,
        fontWeight: '600',
    },
    categoriaLocal: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.sm,
        marginTop: 2,
    },
    linhaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    avaliacao: {
        color: CORES.secundaria,
        fontSize: TAMANHOS.sm,
        marginLeft: 4,
        marginRight: 12,
    },
    badgeStatus: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    textoStatus: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.sm,
    },
    botaoRemover: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    vazio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    textoVazio: {
        color: CORES.textoMudo,
        fontSize: TAMANHOS.lg,
        marginTop: 12,
        fontWeight: '600',
    },
    textoSubVazio: {
        color: CORES.textoMudo,
        fontSize: TAMANHOS.md,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
});
