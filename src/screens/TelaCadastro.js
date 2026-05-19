import React, { use, useState } from "react";
import { View,Text,TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { CORES,TAMANHOS } from "../constants/tema";

export default function TelaCadastro({navigation, aoEntrar}){

    const [nome,setNome]= useState('');
    const [email,setEmail]= useState('');
    const [senha,setSenha]= useState('');

    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={estilos.conteudo}>
                <Text style={estilos.titulo}>Qual a Boa</Text>
                <Text style={estilos.subtitulo}>Crie uma conta</Text>
                <Text style={estilos.descricao}>
                    Insria seus dados para se registrar no aplicativo
                </Text>

                <TextInput
                    style={estilos.entrada}
                    placeholder="Nome completo"
                    placeholderTextColor={CORES.textoMudo}
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput
                    style={estilos.entrada}
                    placeholder="email@dominio.com"
                    placeholderTextColor={CORES.textoMudo}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={estilos.entrada}
                    placeholder="Senha"
                    placeholderTextColor={CORES.textoMudo}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />
                
                <TouchableOpacity style={estilos.botao} onPress={aoEntrar}>
                    <Text style={estilos.textoLink}>Já tem conta? Entrar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    conteudo: { flexGrow: 1, paddingHorizontal: TAMANHOS.espacamento * 1.5, justifyContent: 'center' },
    titulo: { fontSize: TAMANHOS.xxxl, fontWeight: 'bold', color: CORES.texto, textAlign: 'center', marginBottom: 40 },
    subtitulo: { fontSize: TAMANHOS.xl, fontWeight: 'bold', color: CORES.texto, textAlign: 'center' },
    descricao: { fontSize: TAMANHOS.md, color: CORES.textoSecundario, textAlign: 'center', marginBottom: 30, marginTop: 8 },
    entrada: { backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 16, color: CORES.texto, fontSize: TAMANHOS.lg, marginBottom: 12, borderWidth: 1, borderColor: CORES.borda },
    botao: { backgroundColor: CORES.primaria, borderRadius: TAMANHOS.raio, padding: 16, alignItems: 'center', marginTop: 8 },
    textoBotao: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600' },
    textoLink: { color: CORES.primaria, textAlign: 'center', marginTop: 20, fontSize: TAMANHOS.md },
});