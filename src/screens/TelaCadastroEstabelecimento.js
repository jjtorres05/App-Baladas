import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES, TAMANHOS } from "../constants/tema";
import * as ImagePicker from 'expo-image-picker';
import TagRapida from "../components/TagRapida";
import { cadastrarEstabelecimento, uploadImagem } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaCadastroEstabelecimento({navigation}){
    const [nome, setNome]= useState('');
    const [rua, setRua]= useState('');
    const [bairro, setBairro]= useState('');
    const [numero, setNumero]= useState('');
    const [complemento, setComplemento]= useState('');
    const [telefone, setTelefone]= useState('');
    const [categoria, setCategoria]= useState('');
    const [descricao, setDescricao]= useState('');
    const [imagemSelecionada, setImagemSelecionada]= useState(null);
    const categorias= ['Club/Baladas', 'Musica ao vivo', 'Barzinhos', 'Ao ar livre'];
    const escolherImagem = async ()=> {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images','videos'],
            allowsEditting: true,
            quality: 0.8,
        });
        if(!resultado.canceled){
            setImagemSelecionada(resultado.assets[0].uri);
        }
    };
    const tirarFoto = async ()=> {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if(!permissao.granted){
            Alert.alert('Permissao necessaria', 'Precisamos de acesso a camera');
            return;
        }
        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });
        if (!resultado.canceled) {
            setImagemSelecionada(resultado.assets[0].uri);
        }
    };
    const aoEscolherMedia = ()=>{
            Alert.alert('Adicionar Foto do seu local','Escolha uma opcao',[
                {text: 'Camera', onPress: tirarFoto},
                {text: 'Galeria',onPress: escolherImagem},
                {text: 'Cancelar',style: 'cancel'},
            ]);
    };

    const cadastrar = async ()=>{
        if (!nome.trim() || !rua || !numero || !categoria){
            Alert.alert('Campos obrigatorios', 'Preencha pelo menos o nome, endereco e categoria');
            return;
        }
        try{
            let urlImagem = null;
            if(imagemSelecionada){
                urlImagem= await uploadImagem(imagemSelecionada);
            }
            const idUsuario= await AsyncStorage.getItem('idUsuario');
            await cadastrarEstabelecimento({
                id_proprietario: idUsuario,
                nome,
                categoria,
                descricao,
                rua,
                bairro,
                numero,
                complemento,
                telefone,
                imagem: urlImagem,
            });
            Alert.alert('Estabelecimentos cadastrado!',`"${nome}" foi registrado com sucesso\n QR code gerado automaticamente`,
                [{text: 'OK', onPress:()=> navigation.goBack()}]
            );
        }catch (erro){
            Alert.alert(`Erro`,erro.message || 'Nao foi possivel cadastrar');
        }
    };
    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.conteudo}>
                {/*Cabecalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                    </TouchableOpacity>
                    <Text style={estilos.titulo}>
                        Cadastrar Estabelecimento
                    </Text>
                    <View style={{width:24}}/>
                </View>
                {/*Nome */}
                <Text style={estilos.rotulo}>Nome do estabalecimento</Text>
                <TextInput style={estilos.entrada} placeholder="Ex: Bar do ze" placeholderTextColor={CORES.textoMudo} value={nome} onChangeText={setNome}/>
                {/*Categoria */}
                <Text style={estilos.rotulo}>Categoria</Text>
                <View style={estilos.opcoes}>
                    {categorias.map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={categoria===op} aoPresionar={()=> setCategoria(op)}/>
                    ))}
                </View>
                {/*Descricao */}
                <Text style={estilos.rotulo}>Descricao </Text>
                <TextInput style={[estilos.entrada, {height: 80, textAlignVertical: 'top'}]} placeholder="Conte sobre o seu estabelecimento..." placeholderTextColor={CORES.textoMudo} value={descricao} onChangeText={setDescricao} multiline />
                {/*Endereco */}
                <Text style={estilos.rotulo}>Endereco</Text>
                <TextInput style={estilos.entrada} placeholder="Rua" placeholderTextColor={CORES.textoMudo} value={rua} onChangeText={setRua}/>
                <View style={estilos.linhaEndereco}>
                    <TextInput style={[estilos.entrada, {flex: 1, marginRight: 8}]} placeholder="Numero" placeholderTextColor={CORES.textoMudo} value={numero} onChangeText={setNumero} keyboardType="numeric"/>
                    <TextInput style={[estilos.entrada, {flex: 2}]} placeholder="Bairro" placeholderTextColor={CORES.textoMudo} value={bairro} onChangeText={setBairro}/>
                </View>
                <TextInput style={estilos.entrada} placeholder="Complemento (opcional)" placeholderTextColor={CORES.textoMudo} value={complemento} onChangeText={setComplemento}/>
                {/*Telefone */}
                <Text style={estilos.rotulo}>Telefone</Text>
                <TextInput style={estilos.entrada} placeholder="(11) 99999-9999" placeholderTextColor={CORES.textoMudo} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad"/>
                {/*Foto */}
                <Text style={estilos.rotulo}>Foto do estabelecimento</Text>
                <TouchableOpacity style={estilos.botaoUpload} onPress={aoEscolherMedia}>
                    <Ionicons name="cloud-upload-outline" size={18} color={CORES.texto}/>
                    <Text style={estilos.textoUpload}>Subir foto</Text>
                </TouchableOpacity>
                {imagemSelecionada && (
                    <View style={estilos.previewContainer}>
                        <Image source={{uri: imagemSelecionada}} style={estilos.previewImagem}/>
                        <TouchableOpacity style= {estilos.botaoRemover} onPress={()=>setImagemSelecionada(null)}>
                            <Ionicons name="close-circle" size={28} color={CORES.perigo}/>
                        </TouchableOpacity>
                    </View>
                )}  
                {/*Botao cadastrar */}
                <TouchableOpacity style= {estilos.botaoCadastrar} onPress={cadastrar}>
                    <Text style= {estilos.textoCadastrar}>Cadastrar</Text>
                </TouchableOpacity>
                <View style={{height:30}}/>
            </ScrollView>
        </SafeAreaView>
    );
}
const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    conteudo: { paddingHorizontal: TAMANHOS.espacamento },
    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    titulo: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    rotulo: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    entrada: {
        backgroundColor: CORES.superficie,
        color: CORES.texto,
        borderRadius: TAMANHOS.raio,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: TAMANHOS.md,
        marginBottom: 8,
    },
    opcoes: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    linhaEndereco: { flexDirection: 'row' },
    botaoUpload: {
        backgroundColor: CORES.primaria,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: TAMANHOS.raio,
        alignSelf: 'flex-start',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textoUpload: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600', marginLeft: 8 },
    previewContainer: { position: 'relative', marginBottom: 16 },
    previewImagem: { width: '100%', height: 200, borderRadius: TAMANHOS.raio },
    botaoRemover: { position: 'absolute', top: 8, right: 8 },
    botaoCadastrar: {
        backgroundColor: CORES.secundaria,
        paddingVertical: 16,
        borderRadius: TAMANHOS.raio,
        alignItems: 'center',
        marginTop: 10,
    },
    textoCadastrar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});