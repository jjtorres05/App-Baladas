import React, { useState } from "react";
import { View,Text, ScrollView, TextInput, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import {LOCAIS } from '../data/dadosMock'
import CartaoLocal from '../components/CartaoLocal'

export default function TelaHome({navigation}){
    const [busca, setBusca]= useState('');
    const locaisFiltrados = busca.trim() ? LOCAIS.filter((l)=> l.nome.toLowerCase().includes(busca.toLowerCase())) : LOCAIS;
    const irParaLocal = (item)=> navigation.navigate('DetalheLocal', {local: item});
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
                        value={busca}
                        onChangeText={setBusca}
                    />
                    {busca.length > 0 &&(
                        <Ionicons name= "close-circle" size={20} color={CORES.textoMudo} onPress={()=> setBusca('')}/>
                    )}
                </View>
                {/*se esta procurand, mostra resultados */}
                {busca.trim() ? (
                    <View style={estilos.resultados}>
                        <Text style= {estilos.tituloSecao}>Resultados para "{busca}"</Text>
                        {locaisFiltrados.length > 0 ? (
                            locaisFiltrados.map((item)=>(
                                <CartaoLocal key={item.id} local={item} aoPresionar={()=>irParaLocal(item)}/>
                            ))
                        ): (
                            <Text style={estilos.semResultados}>Nenhum local encontrado</Text>
                        )}
                    </View>
                ) : (
                    <>
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
                        
                    </>
                )}
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
    resultados: { paddingHorizontal: TAMANHOS.espacamento },
    semResultados: { color: CORES.textoMudo, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 40 },
});