import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES, TAMANHOS } from "../constants/tema";
import { logout, getUsuarioLogado, atualizarPerfil, alterarSenha } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaPerfil({navigation, aoSair}){
    const [usuario, setUsuario] = useState(null);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);
    const [editNome, setEditNome] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editTelefone, setEditTelefone] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    useEffect(()=>{
        carregarUsuario();
    },[]);

    const carregarUsuario = async () => {
        const dados = await getUsuarioLogado();
        if (dados) setUsuario(dados);
    };

    const abrirEditar = () => {
        setEditNome(usuario?.nome || '');
        setEditEmail(usuario?.email || '');
        setEditTelefone(usuario?.telefone || '');
        setModalEditar(true);
    };

    const salvarPerfil = async () => {
        if (!editNome.trim()) {
            Alert.alert('Erro', 'Nome não pode estar vazio');
            return;
        }
        try {
            const dados = await atualizarPerfil(usuario.idUsuario, editNome, editEmail, editTelefone);
            await AsyncStorage.setItem('nome', dados.nome || '');
            await AsyncStorage.setItem('email', dados.email || '');
            setUsuario({ ...usuario, nome: dados.nome, email: dados.email });
            setModalEditar(false);
            Alert.alert('Perfil atualizado');
        } catch (erro) {
            Alert.alert('Erro', erro.message || 'Não foi possível atualizar');
        }
    };

    const salvarSenha = async () => {
        if (!senhaAtual || !novaSenha) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }
        try {
            await alterarSenha(usuario.idUsuario, senhaAtual, novaSenha);
            setModalSenha(false);
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            Alert.alert('Senha alterada com sucesso');
        } catch (erro) {
            Alert.alert('Erro', erro.message || 'Senha atual inválida');
        }
    };

    const confirmarSaida = () => {
        Alert.alert('Sair', 'Tem certeza que deseja sair?',[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async ()=> {
                    await logout();
                    if(aoSair) aoSair();
                },
            },
        ]);
    };

    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView>
                <Text style={estilos.cabecalho}>Perfil</Text>
                <View style={estilos.avatarContainer}>
                    <View style={estilos.avatar}>
                        <Ionicons name="person" size={50} color={CORES.textoSecundario}/>
                    </View>
                    <Text style={estilos.nome}>{usuario?.nome || usuario?.username || 'Usuário'}</Text>
                    <Text style={estilos.email}>{usuario?.email || `@${usuario?.username}`}</Text>
                </View>
                <View style={estilos.menu}>
                    <TouchableOpacity style={estilos.itemMenu} onPress={abrirEditar}>
                        <Ionicons name="create" size={22} color={CORES.primaria}/>
                        <Text style={estilos.textoMenu}>Editar Perfil</Text>
                        <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={estilos.itemMenu} onPress={() => { setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha(''); setModalSenha(true); }}>
                        <Ionicons name="lock-closed" size={22} color={CORES.primaria}/>
                        <Text style={estilos.textoMenu}>Alterar Senha</Text>
                        <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={estilos.itemMenu} onPress={() => navigation.navigate('Favoritos')}>
                        <Ionicons name="bookmark" size={22} color={CORES.primaria}/>
                        <Text style={estilos.textoMenu}>Lugares Salvos</Text>
                        <Ionicons name="chevron-forward" size={20} color={CORES.textoSecundario}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={estilos.botaoProprietario} onPress={()=> navigation.getParent()?.navigate('ProprietarioPainel')}>
                    <Ionicons name="business" size={22} color={CORES.fundo}/>
                    <Text style={estilos.textoProprietario}>Sou Proprietário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.botaoSair} onPress={confirmarSaida}>
                    <Ionicons name="log-out" size={22} color={CORES.perigo}/>
                    <Text style={estilos.textoSair}>Sair da conta</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal Editar Perfil */}
            <Modal visible={modalEditar} transparent animationType="slide" onRequestClose={() => setModalEditar(false)}>
                <View style={estilos.fundoModal}>
                    <View style={estilos.conteudoModal}>
                        <Text style={estilos.tituloModal}>Editar Perfil</Text>
                        <Text style={estilos.rotulo}>Nome</Text>
                        <TextInput style={estilos.entrada} value={editNome} onChangeText={setEditNome} placeholderTextColor={CORES.textoMudo}/>
                        <Text style={estilos.rotulo}>Email</Text>
                        <TextInput style={estilos.entrada} value={editEmail} onChangeText={setEditEmail} keyboardType="email-address" placeholderTextColor={CORES.textoMudo}/>
                        <Text style={estilos.rotulo}>Telefone</Text>
                        <TextInput style={estilos.entrada} value={editTelefone} onChangeText={setEditTelefone} keyboardType="phone-pad" placeholderTextColor={CORES.textoMudo}/>
                        <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarPerfil}>
                            <Text style={estilos.textoSalvar}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={estilos.botaoCancelar} onPress={() => setModalEditar(false)}>
                            <Text style={estilos.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Alterar Senha */}
            <Modal visible={modalSenha} transparent animationType="slide" onRequestClose={() => setModalSenha(false)}>
                <View style={estilos.fundoModal}>
                    <View style={estilos.conteudoModal}>
                        <Text style={estilos.tituloModal}>Alterar Senha</Text>
                        <Text style={estilos.rotulo}>Senha atual</Text>
                        <TextInput style={estilos.entrada} value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry placeholderTextColor={CORES.textoMudo}/>
                        <Text style={estilos.rotulo}>Nova senha</Text>
                        <TextInput style={estilos.entrada} value={novaSenha} onChangeText={setNovaSenha} secureTextEntry placeholderTextColor={CORES.textoMudo}/>
                        <Text style={estilos.rotulo}>Confirmar nova senha</Text>
                        <TextInput style={estilos.entrada} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry placeholderTextColor={CORES.textoMudo}/>
                        <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarSenha}>
                            <Text style={estilos.textoSalvar}>Alterar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={estilos.botaoCancelar} onPress={() => setModalSenha(false)}>
                            <Text style={estilos.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.fundo },
    cabecalho: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold', paddingHorizontal: TAMANHOS.espacamento, paddingTop: 16 },
    avatarContainer: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: CORES.superficie,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    nome: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    email: { color: CORES.textoSecundario, fontSize: TAMANHOS.md, marginTop: 4 },
    menu: { paddingHorizontal: TAMANHOS.espacamento },
    itemMenu: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: CORES.borda,
    },
    textoMenu: { flex: 1, color: CORES.texto, fontSize: TAMANHOS.lg, marginLeft: 12 },
    botaoProprietario: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: CORES.secundaria,
        marginHorizontal: TAMANHOS.espacamento, marginTop: 24, paddingVertical: 14, borderRadius: TAMANHOS.raio,
    },
    textoProprietario: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginLeft: 8 },
    botaoSair: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 20, paddingVertical: 16, paddingBottom: 30,
    },
    textoSair: { color: CORES.perigo, fontSize: TAMANHOS.lg, fontWeight: '600', marginLeft: 8 },
    fundoModal: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center',
    },
    conteudoModal: {
        backgroundColor: CORES.superficie, borderRadius: TAMANHOS.raio,
        padding: 24, width: '90%',
    },
    tituloModal: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold', marginBottom: 16 },
    rotulo: { color: CORES.textoSecundario, fontSize: TAMANHOS.sm, marginTop: 10, marginBottom: 4 },
    entrada: {
        backgroundColor: CORES.fundo, borderRadius: TAMANHOS.raio, padding: 12,
        color: CORES.texto, fontSize: TAMANHOS.md, borderWidth: 1, borderColor: CORES.borda,
    },
    botaoSalvar: {
        backgroundColor: CORES.secundaria, borderRadius: TAMANHOS.raio,
        paddingVertical: 14, alignItems: 'center', marginTop: 20,
    },
    textoSalvar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
    botaoCancelar: {
        paddingVertical: 12, alignItems: 'center', marginTop: 8,
    },
    textoCancelar: { color: CORES.textoMudo, fontSize: TAMANHOS.md },
});