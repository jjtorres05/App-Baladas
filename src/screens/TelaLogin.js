import React, { useState } from "react";
import { View, Text, TextInput,TouchableOpacity,StyleSheet,SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
export default function TelaLogin({navigation,aoEntrar}){
    const[email,setEmail]=useState('');
    const[senha,setSenha]=useState('');
    return(
        <SafeAreaView style={estilos.container}>
            <View style={estilos.conteudo}>
                <Text style={estilos.titulo}>Qual a Boa</Text>
                <Text style={estilos.subtitulo}>Entrar na sua conta</Text>
                <Text style={estilos.descricao}>
                    Insira seu email e senha para continuar
                </Text>
                <TextInput
                    style={estilos.entrada}
                    placeholder="email@domini.com"
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
                    <Text style={estilos.textoBotao}>Continuar</Text>
                </TouchableOpacity>

                <View style={estilos.divisor}>
                    <View style={estilos.linha}/>
                    <Text style={estilos.textoDivisor}>ou</Text>
                    <View style={estilos.linha}/>
                </View>

                <TouchableOpacity style={estilos.botaoSocial}>
                    <Ionicons name="logo-google" size={20} color={CORES.texto}/>
                    <Text style={estilos.textoSocial}>Continuar com Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate('Cadastro')}>
                    <Text style={estilos.textoLink}>
                        Nao tem conta? Crie uma contra
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    conteudo: { flex: 1, paddingHorizontal: TAMANHOS.espacamento * 1.5, justifyContent: 'center' },
    titulo: { fontSize: TAMANHOS.xxxl, fontWeight: 'bold', color: CORES.texto, textAlign: 'center', marginBottom: 40 },
    subtitulo: { fontSize: TAMANHOS.xl, fontWeight: 'bold', color: CORES.texto, textAlign: 'center' },
    descricao: { fontSize: TAMANHOS.md, color: CORES.textoSecundario, textAlign: 'center', marginBottom: 30, marginTop: 8 },
    entrada: { backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 16, color: CORES.texto, fontSize: TAMANHOS.lg, marginBottom: 12, borderWidth: 1, borderColor: CORES.borda },
    botao: { backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: CORES.borda, marginTop: 4 },
    textoBotao: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600' },
    divisor: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    linha: { flex: 1, height: 1, backgroundColor: CORES.borda },
    textoDivisor: { color: CORES.textoSecundario, marginHorizontal: 16 },
    botaoSocial: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: CORES.borda },
    textoSocial: { color: CORES.texto, fontSize: TAMANHOS.lg, marginLeft: 12 },
    textoLink: { color: CORES.primaria, textAlign: 'center', marginTop: 16, fontSize: TAMANHOS.md },
    termos: { color: CORES.textoMudo, textAlign: 'center', fontSize: TAMANHOS.xs, marginTop: 24, lineHeight: 16 },
});