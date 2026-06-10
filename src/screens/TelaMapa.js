import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { LOCAIS } from "../data/dadosMock";
import MapView, { Marker } from "react-native-maps";
import { listarEstabelecimentos } from "../services/api";

// Coordenadas mock espalhadas por Londrina-PR
const Cooredenadas_Locais = [
    { id: '1', latitude: -23.3045, longitude: -51.1696 },  // Centro
    { id: '2', latitude: -23.3100, longitude: -51.1640 },  // Av. Higienópolis
    { id: '3', latitude: -23.3200, longitude: -51.1600 },  // Lago Igapó
    { id: '4', latitude: -23.3250, longitude: -51.1870 },  // Gleba Palhano
    { id: '5', latitude: -23.2980, longitude: -51.1750 },  // Av. Madre Leônia
];
export default function TelaMapa({navigation}){
    const [locais, setLocais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    useEffect(()=>{
        carregarLocais();
    },[]);

    const carregarLocais = async ()=>{
        try{
            const dados = await listarEstabelecimentos();
            if(dados && dados.length > 0){
                //se a API retorna lat/long usa esses dados, se nao, usa mock coords
                const locaisComCord = dados.map((local,i)=>({
                    ...local,
                    latitude: local.latitude || Cooredenadas_Locais[i]?.latitude,
                    longitude: local.longitude || Cooredenadas_Locais[i]?.longitude,
                })).filter(l => l.latitude && l.longitude);
                setLocais(locaisComCord);
            }else{
                usarMock();
            }
        }catch (erro){
            console.log('Mapa usando dados mock');
            usarMock();
        }
        setCarregando(false);
    }
    const usarMock= ()=>{
        const mock = LOCAIS.map((local, i)=>({
            ...local,
            ...Cooredenadas_Locais[i],
        }));
        setLocais(mock);
    };
    
    return(
        <SafeAreaView style={estilos.container}>
            <Text style={estilos.cabecalho}> Mapa</Text>
            {carregando ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' color={CORES.primaria}/>
                </View>
            ) : (
                <MapView style={estilos.mapa}
                    initialRegion={{
                        latitude: -23.3045,
                        longitude: -51.1696,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                    }}>
                    {locais.map((local) => (
                        <Marker
                            key={local.id || local.id_estabelecimento}
                            coordinate={{
                                latitude: parseFloat(local.latitude),
                                longitude: parseFloat(local.longitude),
                            }}
                            title={local.nome}
                            description={`${local.aberto ? 'Aberto' : 'Fechado'} | ${local.categoria || ''}`}
                            onCalloutPress={() => navigation.navigate('DetalheLocal', { local })}
                        />
                    ))}
                </MapView>
            )}
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