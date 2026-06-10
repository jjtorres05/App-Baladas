import React, {useState, useEffect} from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { CORES, TAMANHOS } from "../constants/tema";
import { meusEstabelecimentos, postagemEvento, uploadImagem } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEUS_LOCAIS = [
    { id: '1', nome: '2800 Music Club' },
    { id: '2', nome: 'Delega Gastro Bar' },
];

export default function TelaPostarEvento({navigation}){
    const [localSelecionado, setLocalSelecionado] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [promocao, setPromocao] = useState('');
    const [data, setData] = useState('');
    const [imagem, setImagem] = useState(null);
    const [carregando, setCarregando]= useState(false);
    const [meusLocais, setMeusLocais]= useState(MEUS_LOCAIS);

    useEffect(()=>{
        carregarLocais();
    },[]);

    const carregarLocais= async()=>{
        try{
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const dados = await meusEstabelecimentos(idUsuario);
            if(dados && dados.length > 0){
                setMeusLocais(dados);
            }
        }catch(erro){
            console.log('Usando locais mock');
        }
    };


    const escolherImagem = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!resultado.canceled) {
            setImagem(resultado.assets[0].uri);
        }
    };

    const tirarFoto = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
            Alert.alert('Permissao necessaria', 'Precisamos de acesso a camera');
            return;
        }
        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!resultado.canceled) {
            setImagem(resultado.assets[0].uri);
        }
    };

    const aoEscolherMedia = () => {
        Alert.alert('Adicionar imagem do evento', 'Escolha uma opcao', [
            { text: 'Camera', onPress: tirarFoto },
            { text: 'Galeria', onPress: escolherImagem },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const publicar = async () => {
        if (!localSelecionado) {
            Alert.alert('Selecione um local', 'Escolha o estabelecimento do evento');
            return;
        }
        if (!titulo || !descricao) {
            Alert.alert('Campos obrigatorios', 'Preencha pelo menos titulo e descricao');
            return;
        }
        setCarregando(true);
        try{
            let urlImagem = null;
            if(imagem){
                urlImagem= await uploadImagem(imagem);
            }
            const idLocal= localSelecionado.id_estabelecimento || localSelecionado.id;
            await postagemEvento({
                id_estabelecimento: idLocal,
                titulo,
                descricao,
                promocao,
                data_evento: data,
                imagem: urlImagem,
            });
            Alert.alert('Evento Publicado!', `"${titulo}" foi publicado em ${localSelecionado.nome}`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }catch (erro){
            Alert.alert('Erro', erro.message || 'Nao foi possivel publicar');
        }
        setCarregando(false);
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.conteudo}>
                {/*Cabecalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto} />
                    </TouchableOpacity>
                    <Text style={estilos.titulo}>Postar Evento</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/*Selecionar local */}
                <Text style={estilos.rotulo}>Selecione o estabelecimento</Text>
                <View style={estilos.listaLocais}>
                    {meusLocais.map((local) => {
                        const idLocal = local.id_estabelecimento || local.id;
                        const selecionado = (localSelecionado?.id_estabelecimento || localSelecionado?.id) === idLocal;
                        return (
                            <TouchableOpacity
                                key={idLocal}
                                style={[estilos.botaoLocal, selecionado && estilos.botaoLocalSelecionado]}
                                onPress={() => setLocalSelecionado(local)}
                            >
                                <Ionicons name="business" size={18} color={selecionado ? CORES.fundo : CORES.primaria} />
                                <Text style={[estilos.textoLocal, selecionado && estilos.textoLocalSelecionado]}>
                                    {local.nome}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {localSelecionado ? (
                    <>
                        {/*Titulo */}
                        <Text style={estilos.rotulo}>Titulo do evento</Text>
                        <TextInput style={estilos.entrada} placeholder="Ex: Noite de funk" placeholderTextColor={CORES.textoMudo} value={titulo} onChangeText={setTitulo} />

                        {/*Descricao */}
                        <Text style={estilos.rotulo}>Descricao</Text>
                        <TextInput style={[estilos.entrada, { height: 100, textAlignVertical: 'top' }]} placeholder="Descreva o evento, horario, atracoes..." placeholderTextColor={CORES.textoMudo} value={descricao} onChangeText={setDescricao} multiline />

                        {/*Promocao */}
                        <Text style={estilos.rotulo}>Promocao (opcional)</Text>
                        <TextInput style={estilos.entrada} placeholder="Ex: 2x1 ate as 22h" placeholderTextColor={CORES.textoMudo} value={promocao} onChangeText={setPromocao} />

                        {/*Data */}
                        <Text style={estilos.rotulo}>Data do evento</Text>
                        <TextInput style={estilos.entrada} placeholder="Ex: 20/07/2026" placeholderTextColor={CORES.textoMudo} value={data} onChangeText={setData} />

                        {/*Imagem */}
                        <Text style={estilos.rotulo}>Imagem do evento</Text>
                        <TouchableOpacity style={estilos.botaoImagem} onPress={aoEscolherMedia}>
                            <Ionicons name="image-outline" size={20} color={CORES.texto} />
                            <Text style={estilos.textoImagem}> Escolher imagem</Text>
                        </TouchableOpacity>
                        {imagem && (
                            <View style={estilos.previewContainer}>
                                <Image source={{ uri: imagem }} style={estilos.preview} />
                                <TouchableOpacity style={estilos.botaoRemover} onPress={() => setImagem(null)}>
                                    <Ionicons name="close-circle" size={28} color={CORES.perigo} />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/*Publicar */}
                        <TouchableOpacity style={[estilos.botaoPublicar, carregando &&{opacity:0.6}]} onPress={publicar} disabled={carregando}>
                            {carregando ? (<ActivityIndicator color={CORES.fundo}/>):(
                                <Text style={estilos.textoPublicar}>Publicar evento</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={estilos.avisoContainer}>
                        <Ionicons name="alert-circle-outline" size={40} color={CORES.textoMudo} />
                        <Text style={estilos.avisoTexto}>Selecione um estabelecimento acima para publicar um evento</Text>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    conteudo: { paddingHorizontal: TAMANHOS.espacamento },
    cabecalho: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12,
    },
    titulo: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    rotulo: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600', marginTop: 16, marginBottom: 8 },
    listaLocais: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    botaoLocal: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 20, borderWidth: 1, borderColor: CORES.primaria,
        marginRight: 8, marginBottom: 8,
    },
    botaoLocalSelecionado: { backgroundColor: CORES.primaria },
    textoLocal: { color: CORES.primaria, fontSize: TAMANHOS.md, marginLeft: 6 },
    textoLocalSelecionado: { color: CORES.fundo },
    avisoContainer: { alignItems: 'center', marginTop: 40 },
    avisoTexto: { color: CORES.textoMudo, fontSize: TAMANHOS.md, textAlign: 'center', marginTop: 12 },
    entrada: {
        backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio, padding: 14,
        color: CORES.texto, fontSize: TAMANHOS.md, borderWidth: 1, borderColor: CORES.borda, marginBottom: 8,
    },
    botaoImagem: {
        backgroundColor: CORES.primaria, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 12, borderRadius: TAMANHOS.raio, alignSelf: 'flex-start',
    },
    textoImagem: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    previewContainer: { position: 'relative', marginTop: 12 },
    preview: { width: '100%', height: 200, borderRadius: TAMANHOS.raio },
    botaoRemover: { position: 'absolute', top: 8, right: 8 },
    botaoPublicar: {
        backgroundColor: CORES.secundaria, paddingVertical: 16, borderRadius: TAMANHOS.raio,
        alignItems: 'center', marginTop: 24,
    },
    textoPublicar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});