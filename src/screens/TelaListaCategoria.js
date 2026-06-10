import React,{useEffect, useState} from "react";
import { View,Text,FlatList,TouchableOpacity,Image,SafeAreaView,StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { LOCAIS } from "../data/dadosMock";
import { listarEstabelecimentos } from "../services/api";

export default function TelaListaCategoria({route,navigation}){
    const [locais, setLocais]= useState([]);
    const [carregando, setCarregando]= useState(true);
    const {categoria} = route.params;
    useEffect(()=>{
        carregarLocais();
    },[]);
    const carregarLocais= async()=>{
        try{
            const dados= await listarEstabelecimentos({
                categoria: categoria.nome
            });
            if(dados && dados.length > 0){
                setLocais(dados);
            }else{
                usarMock();
            }
        }catch (erro){
            console.log('Usando mock');
            usarMock();
        }
        setCarregando(false);
    };
    const usarMock= ()=>{
        const filtrados= LOCAIS.filter((l)=> l.categoria === categoria.nome);
        setLocais(filtrados.length > 0 ? filtrados : LOCAIS);
    };
    
    const renderLocal = ({item})=> (
        <TouchableOpacity
        style={estilos.itemLocal}
        onPress={()=> navigation.navigate('DetalheLocal', {local:item})}
        >
            <Image source={{uri: item.imagem}} style= {estilos.imagemLocal} />
            <View style= {estilos.infoLocal}>
                <Text style={estilos.nomeLocal}>{item.nome}</Text>
                <View style ={estilos.linha}>
                    <Ionicons name='star' size={12} color={CORES.secundaria}/>
                    <Text style={estilos.avaliacao}> {item.avaliacao} </Text>
                    <Text style={estilos.numAvaliacoes}>({item.numAvaliacoes} avaliacoes)</Text>
                </View>
                <Text style={estilos.vibe}>Vibe: {item.vibe}</Text>
                <Text style={estilos.detalhe}>preco: {item.preco} · Fila: {item.fila} </Text>
            </View>
        </TouchableOpacity>
    );
    return(
        <SafeAreaView style={estilos.container}>
            <View style={estilos.cabecalho}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                </TouchableOpacity>
                <Text style= {estilos.tituloCabecalho}>{categoria.nome}</Text>
                <View style={{width: 24}}/>
            </View>
            {/*filtros */}
            <View style={estilos.filtros}>
                <TouchableOpacity style={estilos.botaoFiltro}>
                    <Text style={estilos.textoFiltro}>Filtro</Text>
                    <Ionicons name="chevron-down" size={14} color={CORES.texto}/>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.botaoFiltro}>
                    <Text style={estilos.textoFiltro}>Ordenar</Text>
                    <Ionicons name="chevron-down" size={14} color={CORES.texto}/>
                </TouchableOpacity>
            </View>
            {/*lista */}
            {carregando ?(
                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color={CORES.primaria}/>
                </View>
            ):(
                <FlatList
                data={locais}
                keyExtractor={(item)=> String(item.id_estabelecimento || item.id)}
                renderItem={renderLocal}
                contentContainerStyle={estilos.lista}
                showsVerticalScrollIndicator={false}
                />
            )}
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
    tituloCabecalho: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    filtros: {
        flexDirection: 'row',
        paddingHorizontal: TAMANHOS.espacamento,
        marginBottom: 12,
    },
    botaoFiltro: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.primaria,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    textoFiltro: { color: CORES.texto, fontSize: TAMANHOS.sm, marginRight: 4 },
    lista: { paddingHorizontal: TAMANHOS.espacamento },
    itemLocal: {
        flexDirection: 'column',
        marginBottom: 20,
        borderRadius: TAMANHOS.raio,
        overflow: 'hidden',
        backgroundColor: CORES.superficie,
    },
    imagemLocal: { width: '100%', height: 180 },
    infoLocal: { padding: 12 },
    nomeLocal: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    linha: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    avaliacao: { color: CORES.secundaria, fontSize: TAMANHOS.sm },
    numAvaliacoes: { color: CORES.textoMudo, fontSize: TAMANHOS.sm },
    vibe: { color: CORES.texto, fontSize: TAMANHOS.sm, marginTop: 4 },
    detalhe: { color: CORES.textoSecundario, fontSize: TAMANHOS.sm, marginTop: 2 },
});
