import React from "react";
import { View,Text, ScrollView, TextInput, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import {LOCAIS } from '../data/dadosMock'
import CartaoLocal from '../components/CartaoLocal'

export default function TelaHome({navigation}){

    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Barra de busca */}
                <View style={estilos.containerBusca}>
                    <Ionicons name="search" size={20} color={CORES.textoMudo}/>
                    <TextInput
                        style={estilos.entradaBusca}
                        placeholder="Procurar cidade ou localidade"
                        placeholderTextColor={CORES.textoMudo}
                    />

                </View>

                {/* Em Destaque */}
                <Text style={estilos.tituloSecao}>Em destaque</Text>
                <FlatList
                    data={LOCAIS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item)=> item.id}
                    contentContainerStyle={estilos.listaPadding}
                    renderItem={({item})=>(
                        <CartaoLocal
                        local={item}
                        aoPresionar={()=> navigation.navigate('DetalheLocal',{local:item})}
                        />
                    )}
                />

                {/* Baladas Perto */}
                <Text style={estilos.tituloSecao}>Baladas perto</Text>
                <FlatList
                    data={LOCAIS.filter((l)=> l.categoria==='Club/Baladas')}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item)=> item.id}
                    contentContainerStyle={estilos.listaPadding}
                    renderItem={({item})=>(
                        <CartaoLocal
                            local={item}
                            tamanho="pequeno"
                            aoPresionar={()=> navigation.navigate('DetalheLocal',{local: item})}
                        />
                    )}
                />

                {/* Top da Noite */}
                <Text style={estilos.tituloSecao}>Top da noite</Text>
                <FlatList
                    data={LOCAIS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item)=> item.id}
                    contentContainerStyle={estilos.listaPadding}
                    renderItem={({item})=>(
                        <CartaoLocal
                            local={item}
                            aoPresionar={()=> navigation.navigate('DetalheLocal',{local:item})}
                        />
                    )}
                />
                <View style={{height:20}}/>
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    containerBusca: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        margin: TAMANHOS.espacamento,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    entradaBusca: { flex: 1, color: CORES.texto, marginLeft: 10, fontSize: TAMANHOS.md },
    tituloSecao: {
        color: CORES.texto,
        fontSize: TAMANHOS.xl,
        fontWeight: 'bold',
        marginLeft: TAMANHOS.espacamento,
        marginTop: 20,
        marginBottom: 12,
    },
    listaPadding: { paddingLeft: TAMANHOS.espacamento },
});