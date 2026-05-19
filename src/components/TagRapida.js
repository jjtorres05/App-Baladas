import React from "react";

import { TouchableOpacity,Text,StyleSheet } from "react-native";
import { CORES,TAMANHOS } from "../constants/tema";

export default function TagRapida({rotulo,selecionado,aoPresionar}){
    return(
        <TouchableOpacity 
        style={[estilos.tag, selecionado && estilos.tagSelecionada ]}
        onPress={aoPresionar}
        >
            <Text style ={[estilos.texto, selecionado && estilos.textoSelecionado]}>
                {rotulo}
            </Text>
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    tag:{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CORES.primaria,
        marginRight: 8,
        marginBottom: 8,
    },
    tagSelecionada:{
        backgroundColor: CORES.primaria,
    },
    texto:{
        color: CORES.primaria, fontSize: TAMANHOS.md},
        textoSelecionado: {color: CORES.texto},
    
});