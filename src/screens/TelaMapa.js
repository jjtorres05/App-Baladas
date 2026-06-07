import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { LOCAIS } from "../data/dadosMock";
import MapView, { Marker } from "react-native-maps";

const Cooredenadas_Locais = [
    { id: '1', latitude: -23.5505, longitude: -46.6333 },
    { id: '2', latitude: -23.5575, longitude: -46.6395 },
    { id: '3', latitude: -23.5435, longitude: -46.6250 },
    { id: '4', latitude: -23.5620, longitude: -46.6450 },
    { id: '5', latitude: -23.5480, longitude: -46.6280 },
];
export default function TelaMapa({navigation}){
    const locaisComCoordenadas = LOCAIS.map((local,i)=> ({
        ...local,
        ...Cooredenadas_Locais[i],
    }));
    return(
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.cabecalho}> Mapa</Text>
            <MapView style={estilos.mapa}
            initialRegion={{
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
            }}>
                {locaisComCoordenadas.map((local)=> (
                    <Marker key={local.id}coordinate={{
                        latitude:local.latitude,
                        longitude: local.longitude,
                    }}
                    title={local.nome}description={`${local.aberto? 'Aberto':'Fechado'} | Vibe: ${local.vibe} | ${local.preco}`}
                    onCalloutPress={()=> navigation.navigate('DetalheLocal',{local})}/>
                ))}
            </MapView>
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: {
        color: CORES.texto,
        fontSize: TAMANHOS.xl,
        fontWeight: 'bold',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingTop: 16,
        paddingBottom: 8,
    },
    mapa: { flex: 1 },
});