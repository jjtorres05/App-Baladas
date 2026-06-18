import React from "react";
import { Text, ImageBackground, TouchableOpacity,StyleSheet } from "react-native";
import { CORES,TAMANHOS } from "../constants/tema";

export default function CartaoCategoria ({categoria, aoPresionar,}){
    return(
        <TouchableOpacity style={estilos.cartao}  onPress={aoPresionar} activeOpacity={0.8}>
            <ImageBackground 
                source={{uri: categoria.imagem}}
                style={estilos.imagem}
                imageStyle={{borderRadius: TAMANHOS.raio}}
            >
                <Text style={estilos.nome}>
                    {categoria.nome} {categoria.emoji}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}
const estilos= StyleSheet.create({
    cartao: { width: '48%', marginBottom: 12 },
    imagem: {
        height: 120,
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: TAMANHOS.raio,
    },
    nome: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
});