import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, TAMANHOS } from '../constants/tema';

export default function TelaNotificacoes() {
    return (
        <SafeAreaView style={estilos.container}>
        <Text style={estilos.cabecalho}>Notificações</Text>
        <View style={estilos.conteudo}>
            <Ionicons name="notifications-off" size={60} color={CORES.textoMudo} />
            <Text style={estilos.textoVazio}>Nenhuma notificação por enquanto</Text>
        </View>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold', paddingHorizontal: TAMANHOS.espacamento, paddingTop: 16 },
    conteudo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    textoVazio: { color: CORES.textoMudo, fontSize: TAMANHOS.lg, marginTop: 12 },
});