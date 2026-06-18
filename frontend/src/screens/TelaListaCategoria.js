import React,{useEffect, useState} from "react";
import { View,Text,FlatList,TouchableOpacity,Image,SafeAreaView,StyleSheet, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import { LOCAIS } from "../data/dadosMock";
import { listarEstabelecimentos } from "../services/api";

export default function TelaListaCategoria({route,navigation}){
    const [locais, setLocais]= useState([]);
    const [carregando, setCarregando]= useState(true);
    const [mostrarFiltro, setMostrarFiltro]= useState(false);
    const [mostrarOrdem, setMostrarOrdem]= useState(false);
    const [filtroAtivo, setFiltroAtivo]= useState(null);
    const [ordemAtiva, setOrdemAtiva]= useState(null);
    const {categoria} = route.params;

    const opcoesFiltro = [
        { label: 'Todos', valor: null },
        { label: 'Abertos agora', valor: 'true' },
        { label: 'Fechados', valor: 'false' },
    ];
    const opcoesOrdem = [
        { label: 'Padrão', valor: null },
        { label: 'Alfabética (A-Z)', valor: 'alfabetica' },
        { label: 'Melhor avaliado', valor: 'nota' },
        { label: 'Ticket médio', valor: 'ticket' },
    ];
    useEffect(()=>{
        carregarLocais();
    },[filtroAtivo, ordemAtiva]);

    const carregarLocais= async()=>{
        setCarregando(true);
        try{
            const params = { categoria: categoria.nome };
            if (filtroAtivo) params.aberto = filtroAtivo;
            if (ordemAtiva) params.ordem = ordemAtiva;

            const dados= await listarEstabelecimentos(params);
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
        let filtrados= LOCAIS.filter((l)=> l.categoria === categoria.nome);
        if (filtroAtivo === 'true') filtrados = filtrados.filter(l => l.aberto);
        if (filtroAtivo === 'false') filtrados = filtrados.filter(l => !l.aberto);
        if (ordemAtiva === 'alfabetica') filtrados.sort((a,b) => a.nome.localeCompare(b.nome));
        if (ordemAtiva === 'nota') filtrados.sort((a,b) => (b.avaliacao || 0) - (a.avaliacao || 0));
        setLocais(filtrados.length > 0 ? filtrados : LOCAIS);
    };
    const selecionarFiltro = (valor) => {
        setFiltroAtivo(valor);
        setMostrarFiltro(false);
    };
    const selecionarOrdem = (valor) => {
        setOrdemAtiva(valor);
        setMostrarOrdem(false);
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
                <TouchableOpacity style={[estilos.botaoFiltro, filtroAtivo && estilos.botaoFiltroAtivo]} onPress={() => setMostrarFiltro(true)}>
                    <Text style={estilos.textoFiltro}>{filtroAtivo === 'true' ? 'Abertos' : filtroAtivo === 'false' ? 'Fechados' : 'Filtro'}</Text>
                    <Ionicons name="chevron-down" size={14} color={CORES.texto}/>
                </TouchableOpacity>
                <TouchableOpacity style={[estilos.botaoFiltro, ordemAtiva && estilos.botaoFiltroAtivo]} onPress={() => setMostrarOrdem(true)}>
                    <Text style={estilos.textoFiltro}>{ordemAtiva ? opcoesOrdem.find(o => o.valor === ordemAtiva)?.label : 'Ordenar'}</Text>
                    <Ionicons name="chevron-down" size={14} color={CORES.texto}/>
                </TouchableOpacity>
            </View>

            {/* Modal Filtro */}
            <Modal visible={mostrarFiltro} transparent animationType="fade" onRequestClose={() => setMostrarFiltro(false)}>
                <TouchableOpacity style={estilos.fundoModal} activeOpacity={1} onPress={() => setMostrarFiltro(false)}>
                    <View style={estilos.conteudoModal}>
                        <Text style={estilos.tituloModal}>Filtrar por</Text>
                        {opcoesFiltro.map((op) => (
                            <TouchableOpacity key={op.label} style={[estilos.opcaoModal, filtroAtivo === op.valor && estilos.opcaoAtiva]} onPress={() => selecionarFiltro(op.valor)}>
                                <Text style={[estilos.textoOpcao, filtroAtivo === op.valor && estilos.textoOpcaoAtiva]}>{op.label}</Text>
                                {filtroAtivo === op.valor && <Ionicons name="checkmark" size={18} color={CORES.primaria}/>}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal Ordenar */}
            <Modal visible={mostrarOrdem} transparent animationType="fade" onRequestClose={() => setMostrarOrdem(false)}>
                <TouchableOpacity style={estilos.fundoModal} activeOpacity={1} onPress={() => setMostrarOrdem(false)}>
                    <View style={estilos.conteudoModal}>
                        <Text style={estilos.tituloModal}>Ordenar por</Text>
                        {opcoesOrdem.map((op) => (
                            <TouchableOpacity key={op.label} style={[estilos.opcaoModal, ordemAtiva === op.valor && estilos.opcaoAtiva]} onPress={() => selecionarOrdem(op.valor)}>
                                <Text style={[estilos.textoOpcao, ordemAtiva === op.valor && estilos.textoOpcaoAtiva]}>{op.label}</Text>
                                {ordemAtiva === op.valor && <Ionicons name="checkmark" size={18} color={CORES.primaria}/>}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    botaoFiltroAtivo: { backgroundColor: CORES.secundaria },
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
    fundoModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conteudoModal: {
        backgroundColor: CORES.superficie,
        borderRadius: TAMANHOS.raio,
        padding: 20,
        width: '80%',
    },
    tituloModal: {
        color: CORES.texto,
        fontSize: TAMANHOS.lg,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    opcaoModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: CORES.borda || '#333',
    },
    opcaoAtiva: {
        backgroundColor: 'rgba(138,43,226,0.1)',
        marginHorizontal: -10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    textoOpcao: { color: CORES.texto, fontSize: TAMANHOS.md },
    textoOpcaoAtiva: { color: CORES.primaria, fontWeight: 'bold' },
});
