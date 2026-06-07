import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES, TAMANHOS } from "../constants/tema";

const MEUS_LOCAIS = [
    { id: '1', nome: '2800 Music Club' },
    { id: '2', nome: 'Delega Gastro Bar' },
];

export default function TelaGerenciarCardapio({ navigation }) {
    const [localSelecionado, setLocalSelecionado] = useState(null);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [produtos, setProdutos] = useState([
        { id: '1', nome: 'Caipirinha', preco: '18.00', descricao: 'Limão, cachaça e açúcar' },
        { id: '2', nome: 'Cerveja Artesanal', preco: '22.00', descricao: 'IPA local 600ml' },
    ]);

    const adicionarProduto = () => {
        if (!nome || !preco) {
            Alert.alert('Preencha nome e preço');
            return;
        }
        const novo = { id: String(Date.now()), nome, preco, descricao };
        setProdutos([...produtos, novo]);
        setNome('');
        setPreco('');
        setDescricao('');
        Alert.alert('Produto adicionado!');
    };

    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView contentContainerStyle={estilos.conteudo}>
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto} />
                    </TouchableOpacity>
                    <Text style={estilos.titulo}>Gerenciar Cardápio</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Selecionar local */}
                <Text style={estilos.secaoTitulo}>Selecione o estabelecimento</Text>
                <View style={estilos.listaLocais}>
                    {MEUS_LOCAIS.map((local) => (
                        <TouchableOpacity
                            key={local.id}
                            style={[estilos.botaoLocal, localSelecionado?.id === local.id && estilos.botaoLocalSelecionado]}
                            onPress={() => setLocalSelecionado(local)}
                        >
                            <Ionicons name="business" size={18} color={localSelecionado?.id === local.id ? CORES.fundo : CORES.primaria} />
                            <Text style={[estilos.textoLocal, localSelecionado?.id === local.id && estilos.textoLocalSelecionado]}>
                                {local.nome}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {localSelecionado ? (
                    <>
                        {/* Formulário */}
                        <Text style={estilos.secaoTitulo}>Adicionar produto em "{localSelecionado.nome}"</Text>

                        <TextInput style={estilos.entrada} placeholder="Nome do produto" placeholderTextColor={CORES.textoMudo} value={nome} onChangeText={setNome} />
                        <TextInput style={estilos.entrada} placeholder="Preço (R$)" placeholderTextColor={CORES.textoMudo} value={preco} onChangeText={setPreco} keyboardType="numeric" />
                        <TextInput style={estilos.entrada} placeholder="Descrição (opcional)" placeholderTextColor={CORES.textoMudo} value={descricao} onChangeText={setDescricao} />

                        <TouchableOpacity style={estilos.botaoAdicionar} onPress={adicionarProduto}>
                            <Ionicons name="add" size={20} color={CORES.texto} />
                            <Text style={estilos.textoAdicionar}> Adicionar</Text>
                        </TouchableOpacity>

                        {/* Lista */}
                        <Text style={estilos.secaoTitulo}>Produtos atuais</Text>
                        {produtos.map((item) => (
                            <View key={item.id} style={estilos.itemProduto}>
                                <View style={{ flex: 1 }}>
                                    <Text style={estilos.nomeProduto}>{item.nome}</Text>
                                    <Text style={estilos.descProduto}>{item.descricao}</Text>
                                </View>
                                <Text style={estilos.precoProduto}>R$ {item.preco}</Text>
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={estilos.avisoContainer}>
                        <Ionicons name="alert-circle-outline" size={40} color={CORES.textoMudo} />
                        <Text style={estilos.avisoTexto}>Selecione um estabelecimento acima para gerenciar o cardápio</Text>
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
    secaoTitulo: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },
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
        color: CORES.texto, fontSize: TAMANHOS.md, borderWidth: 1, borderColor: CORES.borda, marginBottom: 10,
    },
    botaoAdicionar: {
        backgroundColor: CORES.primaria, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: TAMANHOS.raio, marginTop: 4,
    },
    textoAdicionar: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    itemProduto: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.superficie,
        padding: 14, borderRadius: TAMANHOS.raio, marginBottom: 8,
    },
    nomeProduto: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    descProduto: { color: CORES.textoMudo, fontSize: TAMANHOS.sm, marginTop: 2 },
    precoProduto: { color: CORES.secundaria, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});