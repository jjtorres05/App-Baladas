import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { logout, getUsuarioLogado } from "../services/api";

export default function TelaPerfil({navigation, aoSair}){
    const [usuario, setUsuario] = useState(null);
    useEffect(()=>{
        carregarUsuario();
    },[]);
    
    const carregarUsuario= async () => {
        const dados = await getUsuarioLogado();
        if (dados) setUsuario(dados);
    }

    const confirmarSaida= ()=>{
        Alert.alert('Sair', 'Tem certeza que deseja sair?',[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async ()=> {
                    await logout();
                    if(aoSair) aoSair();
                },
            },
        ]);
    };

    return(
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.cabecalho}>Perfil</Text>
            <View style={estilos.avatarContainer}>
                <View style={estilos.avatar}>
                    <Ionicons name="person" size={50} color={CORES.textoSecundario}/>
                </View>
                <Text style={estilos.nome}>{usuario?.username || 'Usuario'}</Text>
                <Text style={estilos.email}>ID: {usuario?.idUsuario || '-'}</Text>
            </View>
            <View style={estilos.menu}>
                {[
                    { icone: 'create', rotulo: 'Editar Perfil' },
                    { icone: 'bookmark', rotulo: 'Lugares Salvos', acao: ()=> navigation.navigate('Favoritos')},
                    { icone: 'settings', rotulo: 'Configurações' },
                ].map((item,indice)=>(
                    <TouchableOpacity key={indice} style={estilos.itemMenu} onPress={item.acao || (()=>Alert.alert(item.rotulo, 'Disponivel na proxima versao com integracao do backend'))}>
                        <Ionicons name={item.icone} size={22} color={CORES.primaria}/>
                        <Text style={estilos.textoMenu}>{item.rotulo}</Text>
                        <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario}/>
                    </TouchableOpacity>
                ))}
            </View>
            {/*Botao Proprietario */}
            <TouchableOpacity style={estilos.botaoProprietario} onPress={()=> navigation.getParent()?.navigate('ProprietarioPainel')}>
                <Ionicons name="business" size={22} color={CORES.fundo}/>
                <Text style={estilos.textoProprietario}>Sou Proprietário</Text>
            </TouchableOpacity>
            {/*Botao Sair */}
            <TouchableOpacity style={estilos.botaoSair} onPress={confirmarSaida}>
                <Ionicons name="log-out" size={22} color={CORES.perigo}/>
                <Text style={estilos.textoSair}>Sair da conta</Text>
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
        paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: CORES.borda,
    },
    textoMenu: { flex: 1, color: CORES.texto, fontSize: TAMANHOS.lg, marginLeft: 12 },
    botaoProprietario: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: CORES.secundaria,
        marginHorizontal: TAMANHOS.espacamento, marginTop: 24, paddingVertical: 14, borderRadius: TAMANHOS.raio,
    },
    textoProprietario: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginLeft: 8 },
    botaoSair: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 20, paddingVertical: 16,
    },
    textoSair: { color: CORES.perigo, fontSize: TAMANHOS.lg, fontWeight: '600', marginLeft: 8 },
});