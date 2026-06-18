import React, { useState } from "react";
import { View,Text,TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from "react-native";
import { CORES,TAMANHOS } from "../constants/tema";
import { registro } from "../services/api";

export default function TelaCadastro({navigation, aoEntrar}){

    const [nome,setNome]= useState('');
    const [username,setUsername]= useState('');
    const [email,setEmail]= useState('');
    const [senha,setSenha]= useState('');
    const [carregando, setCarregando]= useState(false);
    const aoCadastrar = async () => {
        if (!nome.trim() || !username.trim() || !email.trim() || !senha.trim()) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        setCarregando(true);
        try {
            await registro(nome, username, email, senha, 'cliente');
            aoEntrar();
        } catch (erro) {
            Alert.alert('Erro ao cadastrar', erro.message || 'Tente novamente');
        }
        setCarregando(false);
    };

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
                    placeholder="Nome de usuário"
                    placeholderTextColor={CORES.textoMudo}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
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
                {/*>Botao cadastrar */}
                <TouchableOpacity style={[estilos.botao, carregando && {opacity:0.6}]} onPress={aoCadastrar} disabled={carregando}>
                    {carregando ? ( <ActivityIndicator color={CORES.texto}/>):(
                        <Text style={estilos.textoBotao}>Criar Conta</Text>
                    )}
                </TouchableOpacity>
                {/**Link para login */}
                <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
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