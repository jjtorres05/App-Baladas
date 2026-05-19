import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CORES,TAMANHOS } from "../constants/tema";
import { Ionicons } from "@expo/vector-icons";

export default function PostStatus({post}){
    return(
        <View style={estilos.container}>
            <View style={estilos.cabecalho}>
                <View style={estilos.avatar}>
                    <Ionicons name="person" size={18} color={CORES.textoSecundario}/>
                </View>
                <View>
                    <Text style={estilos.nomeUsuario}>{post.nomeUsuario}</Text>
                    <Text style={estilos.tempo}>{post.criadoEM}</Text>
                </View>
            </View>
            <Text style={estilos.texto}>{post.texto}</Text>
            {post.imagem && (
                <Image source={{uri: post.imagem}} style={estilos.imagemPost}/>

            )}
        </View>
    );
}
const estilos= StyleSheet.create({

    container: {
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda,
        paddingVertical: 16,
    },
    cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
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
    texto: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, lineHeight: 20 },
    imagemPost: { width: '100%', height: 200, borderRadius: TAMANHOS.raio, marginTop: 10 },
});