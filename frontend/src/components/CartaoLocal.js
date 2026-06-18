import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";

export default function CartaoLocal({local, aoPresionar, tamanho='medio'}){
    const ehPequeno = tamanho === 'pequeno';

    return(
        <TouchableOpacity
        style ={[estilos.cartao, ehPequeno && estilos.cartaoPequeno]}
        onPress={aoPresionar}
        activeOpacity={0.8}
        >
            <Image
            source={{uri: local.imagem}}
            style={[estilos.imagem, ehPequeno && estilos.imagemPequena]}
            />
            <View style={[estilos.sobreposicao]}>
                <Text style={[estilos.nome, ehPequeno && estilos.nomePequeno]} numberOfLines={1}>
                    {local.nome}
                </Text>
                {!ehPequeno && (
                    <View style={estilos.info}>
                        <Ionicons name='star' size={12} color={CORES.secundaria}/>
                        <Text style={estilos.avaliacao}>{local.avaliacao}</Text>
                        <Text style={estilos.ponto}>.</Text>
                        <Text style={estilos.meta}>{local.aberto ? 'Aberto': 'Fechado'}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    cartao: { width: 200, marginRight: 12, borderRadius: TAMANHOS.raio, overflow: 'hidden' },
    cartaoPequeno: { width: 150 },
    imagem: { width: '100%', height: 140, borderRadius: TAMANHOS.raio },
    imagemPequena: { height: 100 },
    sobreposicao: { padding: 8 },
    nome: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    nomePequeno: { fontSize: TAMANHOS.sm },
    info: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    avaliacao: { color: CORES.secundaria, fontSize: TAMANHOS.sm, marginLeft: 4 },
    ponto: { color: CORES.textoMudo, marginHorizontal: 6 },
    meta: { color: CORES.textoSecundario, fontSize: TAMANHOS.sm },
});