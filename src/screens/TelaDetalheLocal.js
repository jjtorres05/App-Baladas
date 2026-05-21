import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import {POSTS_STATUS} from '../data/dadosMock';
import PostStatus from '../components/PostStatus';

export default function TelaDetalheLocal({route, navigation}){
    const {local}= route.params;
    const postLocal= POSTS_STATUS.filter((p)=> p.localId===local.id);
    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/*cabecalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                    </TouchableOpacity>
                    <Text style={estilos.nomeLocal}> {local.nome}</Text>
                    <View style={{width: 24}}/>
                </View>
                {/*Imagem */}
                <Image source={{uri: local.imagem}} style={estilos.imagemPrincipal}/>
                {/*Curtidas e comentarios */}
                <View style={estilos.barraInteracao}>
                    <View style={estilos.itemInteracao}>
                        <Ionicons name="heart" size ={18} color={CORES.perigo}/>
                        <Text style={estilos.textoInteracao}> like</Text>
                    </View>
                    <View style={estilos.itemIteracao}>
                        <Ionicons name="chatbubble-outline" size={18} color={CORES.textoSecundario}/>
                        <Text style={estilos.textoInteracao}>{postLocal.length} comentarios</Text>
                    </View>
                </View>
                {/*Descricao */}
                <View style={estilos.secao}>
                    <Text style={estilos.tituloSecao}>Descricao do lugar:</Text>
                    <Text style={estilos.descricao}>{local.descricao}</Text>
                </View>
                {/*Oponioes */}
                <View style={estilos.secao}>
                    <Text style={estilos.tituloSecao}>Opinioes/status mais recente/deixar opiniao</Text>
                    {postLocal.length > 0 ?(
                        postLocal.map((post)=> <PostStatus key={post.id} post={post}/>)):(
                            <Text style={estilos.semPosts}>Nenhuma opiniao aind. Seja o primeiro!</Text>
                        )
                    }
                </View>
                {/*Botao avaliar */}
                <TouchableOpacity
                style={estilos.botaoAvaliar}
                onPress={()=>navigation.navigate('FormAvaliacao', {local})}>
                    <Text style={estilos.textoBotaoAvaliar}>Enviar meu status</Text>
                </TouchableOpacity>
                <View style={{height: 30}}/>
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
    nomeLocal: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    imagemPrincipal: { width: '100%', height: 220 },
    barraInteracao: {
        flexDirection: 'row',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingVertical: 12,
    },
    itemInteracao: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    textoInteracao: { color: CORES.textoSecundario, fontSize: TAMANHOS.md },
    secao: { paddingHorizontal: TAMANHOS.espacamento, marginTop: 8 },
    tituloSecao: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginBottom: 8 },
    descricao: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, lineHeight: 20 },
    semPosts: { color: CORES.textoMudo, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 20 },
    botaoAvaliar: {
        backgroundColor: CORES.secundaria,
        marginHorizontal: TAMANHOS.espacamento,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: TAMANHOS.raio,
        alignItems: 'center',
    },
    textoBotaoAvaliar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});