import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";

const MEUS_LOCAIS = [
    { id: '1', nome: '2800 Music Club', categoria: 'Club/Baladas', aberto: true, vibe: 92, avaliacoes: 128 },
    { id: '2', nome: 'Delega Gastro Bar', categoria: 'Barzinhos', aberto: true, vibe: 88, avaliacoes: 95 },
];

export default function TelaMeusEstabelecimentos({navigation}){
    const renderLocal = ({item})=>(
        <View style={estilos.cartao}>
            <View style={estilos.cartaoCabecalho}>
                <Ionicons name="business" size={24} color={CORES.primaria}/>
                <View style={{flex:1, marginLeft:12}}>
                    <Text style={estilos.nomeLocal}>
                        {item.nome}
                    </Text>
                    <Text style={estilos.categoriaLocal}>
                        {item.categoria}
                    </Text>
                </View>
                <View style={[estilos.badgeStatus, !item.aberto && {backgroundColor: CORES.perigo}]}>
                    <Text style={estilos.textoStatus}>
                        {item.aberto ? 'Aberto' : 'Fechado'}
                    </Text>
                </View>
            </View>
            <View style={estilos.estatisticas}>
                <View style={estilos.stat}>
                    <Text style={estilos.statNumero}>{item.vibe}</Text>
                    <Text style={estilos.statRotulo}>Vibe</Text>
                </View>
                <View  style={estilos.stat}>
                    <Text style={estilos.statNumero}>{item.avaliacoes}</Text>
                    <Text style={estilos.statRotulo}>Avaliacoes</Text>
                </View>
            </View>
        </View>
    );
    return (
        <SafeAreaView style={estilos.container}>
            <View style={estilos.cabecalho}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                </TouchableOpacity>
                <Text style={estilos.titulo}>Meus Estabelecimentos</Text>
                <View style={{width: 24}}/>
            </View>
            <FlatList 
                data={MEUS_LOCAIS}
                keyExtractor={(item)=> item.id}
                renderItem={renderLocal}
                contentContainerStyle={estilos.lista}
            />
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: TAMANHOS.espacamento, paddingVertical: 12,
    },
    titulo: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    lista: { paddingHorizontal: TAMANHOS.espacamento },
    cartao: { backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 16, marginBottom: 12 },
    cartaoCabecalho: { flexDirection: 'row', alignItems: 'center' },
    nomeLocal: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    categoriaLocal: { color: CORES.textoMudo, fontSize: TAMANHOS.sm, marginTop: 2 },
    badgeStatus: { backgroundColor: CORES.sucesso, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    textoStatus: { color: CORES.texto, fontSize: TAMANHOS.xs, fontWeight: '600' },
    estatisticas: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-around' },
    stat: { alignItems: 'center' },
    statNumero: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    statRotulo: { color: CORES.textoMudo, fontSize: TAMANHOS.xs, marginTop: 2 },
});