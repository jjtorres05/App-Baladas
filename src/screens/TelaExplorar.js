import React, {useState, useEffect} from "react";
import { Text, View,ScrollView,TextInput,StyleSheet,Image,SafeAreaView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import CartaoCategoria from "../components/CartaoCategoria"
import {CATEGORIAS, LOCAIS} from "../data/dadosMock"
import CartaoLocal from "../components/CartaoLocal";
import { listarEstabelecimentos } from "../services/api";

export default function TelaExplorar({navigation}){
    const [busca, setBusca]= useState('');
    const [locais, setLocais]= useState(LOCAIS);

    useEffect(()=> {
        carregarLocais();
    },[]);
    const carregarLocais= async ()=>{
        try{
            const dados = await listarEstabelecimentos();
            if(dados && dados.length > 0){
                setLocais(dados);
            }
        }catch(erro){
            console.log('Usando dados mock no explorar');
        }
    };
    const locaisFiltrados = busca.trim() ? locais.filter((l) =>
    l.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (l.categoria && l.categoria.toLowerCase().includes(busca.toLowerCase()))
) : [];


    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Busca */}
                <View style={estilos.containerBusca}>
                    <Ionicons name="search" size={20} color={CORES.textoMudo}/>
                    <TextInput
                        style={estilos.entradaBusca}
                        placeholder="Procura por tipo de lugar"
                        placeholderTextColor={CORES.textoMudo}value={busca}onChangeText={setBusca}
                    />
                    {busca.length > 0 && (
                        <Ionicons name="close-circle" size={20} color={CORES.textoMudo} onPress={()=>setBusca('')}/>
                    )}
                </View>

                {busca.trim() ? (
                    <View style={estilos.resultados}>
                        <Text style={estilos.tituloSecao}>Resultados para "{busca}"</Text>
                        {locaisFiltrados.length > 0 ? (
                            locaisFiltrados.map((item)=> (
                                <CartaoLocal key={item.id || item.id_estabelecimento}local={item}aoPresionar={()=>navigation.navigate('DetalheLocal',{local: item})}/>
                            ))
                        ) : (
                            <Text style={estilos.semResultados}>Nenhum local encontrado</Text>
                        )}
                    </View>
                ) : (
                    <>
                        {/* Banner */}
                        <View style={estilos.banner}>
                            <Image 
                                source={{uri: 'https://picsum.photos/600/200?random=30'}}
                                style={estilos.imagemBanner}
                            />
                            <Text style={estilos.textoBanner}>Poderia te interessar</Text>
                        </View>

                        {/* Categorias */}
                        <Text style={estilos.tituloSecao}>O que voce esta procurando hoje?</Text>
                        <Text style={estilos.subtituloSecao}>Encontre lugares que estejam na mesma sintonia que você</Text>

                        <View style={estilos.grade}>
                            {CATEGORIAS.map((cat)=>(
                                <CartaoCategoria
                                    key={cat.id}
                                    categoria={cat}
                                    aoPresionar={()=> navigation.navigate('ListaCategoria',{categoria:cat})}
                                />
                            ))}
                        </View>
                    </>
                )}
                
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
    banner: { marginHorizontal: TAMANHOS.espacamento, borderRadius: TAMANHOS.raio, overflow: 'hidden', marginBottom: 20 },
    imagemBanner: { width: '100%', height: 120 },
    textoBanner: { position: 'absolute', bottom: 12, right: 12, color: CORES.secundaria, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    tituloSecao: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginHorizontal: TAMANHOS.espacamento, marginTop: 10 },
    subtituloSecao: { color: CORES.textoSecundario, fontSize: TAMANHOS.sm, marginHorizontal: TAMANHOS.espacamento, marginBottom: 16, marginTop: 4 },
    grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: TAMANHOS.espacamento },
    resultados: { paddingHorizontal: TAMANHOS.espacamento },
    semResultados: { color: CORES.textoMudo, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 40 },
});