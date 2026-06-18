import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { meusEstabelecimentos } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEUS_LOCAIS = [
    { id: '1', nome: '2800 Music Club', categoria: 'Club/Baladas', aberto: true, vibe: 92, avaliacoes: 128 },
    { id: '2', nome: 'Delega Gastro Bar', categoria: 'Barzinhos', aberto: true, vibe: 88, avaliacoes: 95 },
];

export default function TelaMeusEstabelecimentos({navigation}){
    const [locais, setLocais]= useState(MEUS_LOCAIS);
    const [carregando, setCarregando]= useState(true);
    const [qrModal, setQrModal]= useState(null);
    useEffect(()=> {
        carregarLocais();
    },[]);
    const carregarLocais = async()=>{
        try{
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const dados = await meusEstabelecimentos(idUsuario);
            if(dados && dados.length > 0){
                setLocais(dados);
            }
        }catch (erro){
            console.log('Usadndo locais mock');
        }
        setCarregando(false);
    };
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
                    <Text style={estilos.statNumero}>{item.vibe || '-'}</Text>
                    <Text style={estilos.statRotulo}>Vibe</Text>
                </View>
                <View  style={estilos.stat}>
                    <Text style={estilos.statNumero}>{item.avaliacoes || '-'}</Text>
                    <Text style={estilos.statRotulo}>Avaliacoes</Text>
                </View>
            </View>
            {item.qr_code && (
                <TouchableOpacity style={estilos.botaoQR} onPress={() => setQrModal(item)}>
                    <Ionicons name="qr-code-outline" size={18} color={CORES.texto}/>
                    <Text style={estilos.textoQR}>Ver QR Code</Text>
                </TouchableOpacity>
            )}
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
            
            {carregando ? (
                <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                    <ActivityIndicator size='large' color={CORES.primaria}/>
                </View>
            ):(
                <FlatList 
                data={locais}
                keyExtractor={(item)=> String(item.id_estabelecimento || item.id)}
                renderItem={renderLocal}
                contentContainerStyle={estilos.lista}
                />
            )}

            {/* Modal QR Code */}
            <Modal visible={!!qrModal} transparent animationType="fade" onRequestClose={() => setQrModal(null)}>
                <TouchableOpacity style={estilos.fundoModal} activeOpacity={1} onPress={() => setQrModal(null)}>
                    <View style={estilos.conteudoModal}>
                        <Text style={estilos.tituloModal}>{qrModal?.nome}</Text>
                        <Text style={estilos.subtituloModal}>QR Code do estabelecimento</Text>
                        <Image
                            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrModal?.qr_code}` }}
                            style={estilos.imagemQR}
                        />
                        <Text style={estilos.codigoQR}>{qrModal?.qr_code}</Text>
                        <TouchableOpacity style={estilos.botaoFechar} onPress={() => setQrModal(null)}>
                            <Text style={estilos.textoFechar}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

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
    botaoQR: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: CORES.primaria, borderRadius: TAMANHOS.raio,
        paddingVertical: 10, marginTop: 12,
    },
    textoQR: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600', marginLeft: 8 },
    fundoModal: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center',
    },
    conteudoModal: {
        backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio,
        padding: 24, alignItems: 'center', width: '85%',
    },
    tituloModal: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    subtituloModal: { color: CORES.textoMudo, fontSize: TAMANHOS.sm, marginTop: 4, marginBottom: 20 },
    imagemQR: { width: 250, height: 250, borderRadius: 12, backgroundColor: '#fff' },
    codigoQR: { color: CORES.textoMudo, fontSize: TAMANHOS.xs, marginTop: 12 },
    botaoFechar: {
        backgroundColor: CORES.primaria, borderRadius: TAMANHOS.raio,
        paddingVertical: 12, paddingHorizontal: 40, marginTop: 20,
    },
    textoFechar: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
});