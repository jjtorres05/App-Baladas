import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
export default function TelaMapa(){
    return(
        <SafeAreaView style={estilos.container}>
            <View style={estilos.conteudo}>
                <Ionicons name="map" size={80} color={CORES.primaria}/>
                <Text style={estilos.titulo}>Mapa</Text>
                <Text style={estilos.subtitulo}>
                    Aqui voce vai ver os locais perto de voce no mapa. {'\n'} (Nao tem integracao com google maps {':('} nem vai ter)
                </Text>
            </View>
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    conteudo: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    titulo: { color: CORES.texto, fontSize: TAMANHOS.xxl, fontWeight: 'bold', marginTop: 16 },
    subtitulo: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});