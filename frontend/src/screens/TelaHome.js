import React, { useState, useEffect } from "react";
import { View,Text, ScrollView, TextInput, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import {LOCAIS } from '../data/dadosMock'
import CartaoLocal from '../components/CartaoLocal'
import { listarEstabelecimentos } from "../services/api";

export default function TelaHome({navigation}){
    const [busca, setBusca]= useState('');
    const [locais, setLocais]= useState(LOCAIS); // comeca com mock como fallback
    const [carregando, setCarregando]= useState(true);
    
    useEffect(()=>{
        carregarLocais();
    },[]);
    const carregarLocais = async ()=> {
        try{
            const dados = await listarEstabelecimentos();
            if(dados && dados.length > 0){
                setLocais(dados);
            }
            //se a API nao retorna nada(porque no tiene establecimentos cadastrados) mantinen los mock
        }catch (erro){
            console.log('Usando dados mock(back offline',erro.message);
        }
        setCarregando(false);
    };

    const locaisFiltrados = busca.trim() ? locais.filter((l)=> l.nome.toLowerCase().includes(busca.toLowerCase())) : locais;
    const irParaLocal = (item)=> navigation.navigate('DetalheLocal', {local: item});
    if(carregando){
        return(
            <SafeAreaView style={[estilos.container, {justifyContent:'center', alignItems:'center'}]}>
                <ActivityIndicator size='large' color={CORES.primaria}/>
            </SafeAreaView>
        );
    }
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
                                <CartaoLocal key={item.id || item.id_estabelecimento} local={item} aoPresionar={()=>irParaLocal(item)}/>
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
                            data={locais}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=> String(item.id || item.id_estabelecimento)}
                            contentContainerStyle={estilos.listaPadding}
                            renderItem={({item})=>(
                                <CartaoLocal
                                local={item}
                                aoPresionar={()=> irParaLocal(item)}
                                />
                            )}
                        />

                        {/* Baladas Perto */}
                        <Text style={estilos.tituloSecao}>Baladas perto</Text>
                        <FlatList
                            data={locais.filter((l)=> l.categoria==='Club/Baladas')}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=> String(item.id || item.id_estabelecimento)}
                            contentContainerStyle={estilos.listaPadding}
                            renderItem={({item})=>(
                                <CartaoLocal
                                    local={item}
                                    tamanho="pequeno"
                                    aoPresionar={()=> irParaLocal(item)}
                                />
                            )}
                        />

                        {/* Top da Noite */}
                        <Text style={estilos.tituloSecao}>Top da noite</Text>
                        <FlatList
                            data={locais}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=> String(item.id || item.id_estabelecimento)}
                            contentContainerStyle={estilos.listaPadding}
                            renderItem={({item})=>(
                                <CartaoLocal
                                    local={item}
                                    aoPresionar={()=> irParaLocal(item)}
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