import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";

export default function TelaPerfil(){
    return(
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.avatar}>Perfil</Text>
            <View style={estilos.avatarContainer}>
                <View style={estilos.avatar}>
                    <Ionicons name="person" size={50} color={CORES.textoSecundario}/>
                </View>
                <Text style={estilos.nome}>Usuarios</Text>
                <Text style={estilos.email}>Usuario@email.com</Text>
            </View>
            <View style={estilos.menu}>
                {[
                    { icone: 'create', rotulo: 'Editar Perfil' },
                    { icone: 'bookmark', rotulo: 'Lugares Salvos' },
                    { icone: 'settings', rotulo: 'Configurações' },
                    { icone: 'help-circle', rotulo: 'Ajuda' },
                ].map((item,indice)=>(
                    <TouchableOpacity key={indice} style={estilos.itemMenu}>
                        <Ionicons name={item.icone} size={22} color={CORES.primaria}/>
                        <Text style={estilos.textoMenu}>{item.rotulo}</Text>
                        <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario}/>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={estilos.botaoSair}>
                <Ionicons name="log-out" size={22} color={CORES.perigo}/>
                <Text style={estilos.testoSair}>Sair da conta</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold', paddingHorizontal: TAMANHOS.espacamento, paddingTop: 16 },
    avatarContainer: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: CORES.superficie,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    nome: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    email: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, marginTop: 4 },
    menu: { paddingHorizontal: TAMANHOS.espacamento },
    itemMenu: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 0.5, borderBottomColor: CORES.borda,
    },
    textoMenu: { flex: 1, color: CORES.texto, fontSize: TAMANHOS.lg, marginLeft: 12 },
    botaoSair: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 30, paddingVertical: 16,
    },
    textoSair: { color: CORES.perigo, fontSize: TAMANHOS.lg, fontWeight: '600', marginLeft: 8 },
});