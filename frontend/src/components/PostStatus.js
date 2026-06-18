import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CORES, TAMANHOS } from '../constants/tema';
import { Ionicons } from '@expo/vector-icons';
import { reagir, denunciar } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PostStatus({ post }) {
    const [reacao, setReacao] = useState(null); // 'concordar' | 'discordar' | null

    const aoReagir = async (tipo) => {
        if (reacao === tipo) {
            setReacao(null); // desfaz a reação
        } else {
            setReacao(tipo);
        }
        try{
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const idPostagem = post.id_postagem || post.id;
            await reagir(idUsuario,idPostagem, tipo);
        }catch (erro){
            console.log('Erro ao reagir (back offilne):',erro.message);
        }
    };

    const aoDenunciar = () => {
        Alert.alert(
            'Denunciar postagem',
            'Qual o motivo da denúncia?',
            [
                { text: 'Ofensivo', onPress: () => confirmarDenuncia('ofensivo') },
                { text: 'Spam', onPress: () => confirmarDenuncia('spam') },
                { text: 'Inapropriado', onPress: () => confirmarDenuncia('inapropriado') },
                { text: 'Cancelar', style: 'cancel' },
            ]
        );
    };

    const confirmarDenuncia = async (tipo) => {
        try{
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const idPostagem = post.id_postagem || post.id;
            await denunciar(idUsuario,idPostagem,tipo);
            Alert.alert('Denúncia enviada', 'Obrigado por ajudar a manter a comunidade segura.');
        }catch(erro){
            Alert.alert('Denuncia registrada','Obrigado pelo aviso');
            console.log('Erro ao denunciar',erro.message);
        }
    };

    return (
        <View style={estilos.container}>
            {/* Cabeçalho — avatar + nome + tempo */}
            <View style={estilos.cabecalho}>
                <View style={estilos.avatar}>
                    <Ionicons name="person" size={18} color={CORES.textoSecundario} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={estilos.nomeUsuario}>{post.nomeUsuario || post.usuario?.nome}</Text>
                    <Text style={estilos.tempo}>{post.criadoEM || post.data_postagem}</Text>
                </View>
                {/* Botão denunciar */}
                <TouchableOpacity onPress={aoDenunciar} style={estilos.botaoDenunciar}>
                    <Ionicons name="flag-outline" size={18} color={CORES.textoMudo} />
                </TouchableOpacity>
            </View>

            {/* Texto do post */}
            <Text style={estilos.texto}>{post.texto || post.legenda}</Text>

            {/* Nota (se houver) */}
            {(post.nota !== undefined && post.nota !== null) && (
                <View style={estilos.linhaNota}>
                    <Ionicons name="star" size={14} color={CORES.secundaria} />
                    <Text style={estilos.textoNota}>{post.nota}</Text>
                </View>
            )}

            {/* Imagem (se houver) */}
            {(post.imagem || (post.fotos && post.fotos.length > 0)) && (
                <Image
                    source={{ uri: post.imagem || post.fotos[0] }}
                    style={estilos.imagemPost}
                />
            )}

            {/* Barra de interações — concordar / discordar */}
            <View style={estilos.barraInteracoes}>
                <TouchableOpacity
                    style={[estilos.botaoReacao, reacao === 'concordar' && estilos.botaoReacaoAtivo]}
                    onPress={() => aoReagir('concordar')}
                >
                    <Ionicons
                        name={reacao === 'concordar' ? 'thumbs-up' : 'thumbs-up-outline'}
                        size={18}
                        color={reacao === 'concordar' ? CORES.sucesso : CORES.textoSecundario}
                    />
                    <Text style={[
                        estilos.textoReacao,
                        reacao === 'concordar' && { color: CORES.sucesso }
                    ]}>
                        Concordo
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[estilos.botaoReacao, reacao === 'discordar' && estilos.botaoReacaoAtivo]}
                    onPress={() => aoReagir('discordar')}
                >
                    <Ionicons
                        name={reacao === 'discordar' ? 'thumbs-down' : 'thumbs-down-outline'}
                        size={18}
                        color={reacao === 'discordar' ? CORES.perigo : CORES.textoSecundario}
                    />
                    <Text style={[
                        estilos.textoReacao,
                        reacao === 'discordar' && { color: CORES.perigo }
                    ]}>
                        Discordo
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
        paddingVertical: 16,
    },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: CORES.superficie,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    nomeUsuario: { color: CORES.texto, fontWeight: '600', fontSize: TAMANHOS.md },
    tempo: { color: CORES.textoMudo, fontSize: TAMANHOS.xs },
    botaoDenunciar: {
        padding: 6,
    },
    texto: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, lineHeight: 20 },
    linhaNota: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    textoNota: {
        color: CORES.secundaria,
        fontSize: TAMANHOS.sm,
        marginLeft: 4,
        fontWeight: '600',
    },
    imagemPost: {
        width: '100%',
        height: 200,
        borderRadius: TAMANHOS.raio,
        marginTop: 10,
    },
    barraInteracoes: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 12,
    },
    botaoReacao: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: CORES.superficie,
    },
    botaoReacaoAtivo: {
        backgroundColor: CORES.cartao,
    },
    textoReacao: {
        color: CORES.textoSecundario,
        fontSize: TAMANHOS.sm,
        marginLeft: 6,
        fontWeight: '500',
    },
});
