import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";

export default function TelaProprietarioPainel({navigation}){
    const opcoes = [
        {
            icone: 'add-circle',
            titulo: 'Cadastrar Estabelecimento',
            descricao: 'Registrar um novo local',
            tela: 'CadastrarEstabelecimento',
        },
        {
            icone: 'megaphone',
            titulo: 'Postar Evento/promocao',
            descricao: 'Divulge eventos e promocoes',
            tela: 'PostarEvento',
        },
        {
            icone: 'restaurant',
            titulo: 'Gerenciar Cardapio',
            descricao: 'Gerencie seu cardapio a vontade',
            tela: 'GerenciarCardapio',
        },
        {
            icone: 'bar-chart',
            titulo: 'Meus Estabelecimentos',
            descricao: 'Veja o status dos seus locais',
            tela: 'MeusEstabelecimentos',
        },
    ];
    

    return(
        <SafeAreaView style= {estilos.container}>
            <ScrollView>
                {/*Cabecalho*/}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                    </TouchableOpacity>
                    <Text style={estilos.titulo}>
                        Painel do Proprietario
                    </Text>
                    <View style={{width: 24}}/>
                </View>
                {/*Info */}
                <View style={estilos.infoBox}>
                    <Ionicons name="business" size={40} color={CORES.primaria}/>
                    <Text style={estilos.infoTitulo}>
                        Gerencie seus estabelecimentos
                    </Text>
                    <Text style={estilos.infoTexto}>
                        Cadastrar locais, publique eventos e atualize o cardapio
                    </Text>
                </View>
                {/*Opcoes */}
                <View style={estilos.grade}>
                    {opcoes.map((op,i)=>(
                        <TouchableOpacity key={i}style={estilos.cartao}onPress={()=>{navigation.navigate(op.tela)}}>
                            <Ionicons name={op.icone}size={32} color={CORES.primaria}/>
                            <Text style={estilos.cartaoTitulo}>{op.titulo}</Text>
                            <Text style={estilos.cartaoDescricao}>{op.descricao}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
    titulo: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    infoBox: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: TAMANHOS.espacamento,
        marginHorizontal: TAMANHOS.espacamento,
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        marginBottom: 20,
    },
    infoTitulo: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginTop: 12 },
    infoTexto: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 6 },
    grade: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: TAMANHOS.espacamento,
    },
    cartao: {
        width: '48%',
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    cartaoTitulo: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600', marginTop: 10, textAlign: 'center' },
    cartaoDescricao: { color: CORES.textoMudo, fontSize: TAMANHOS.xs, textAlign: 'center', marginTop: 4 },
});