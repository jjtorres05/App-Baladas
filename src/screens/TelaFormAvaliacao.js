import React,{useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES,TAMANHOS } from "../constants/tema";
import TagRapida from '../components/TagRapida';

export default function TelaFormAvaliacao({route, navigation}){
    const {local}= route.params;
    const [locConfirmada, setLocConfirmada]= useState(false);
    const [vibe,setVibe]= useState(null);
    const [musica, setMusica]= useState(null);
    const [fila,setFila]= useState(null);
    const [preco,setPreco]= useState(null);
    const [seguranca,setSeguranca]= useState(null);
    const [pessoas,setPessoas]= useState(20);
    const [tempoEspera,setTempoEspera]= useState(null);
    const [comentario,setComentario]= useState(null);

    const enviar=()=>{
        Alert.alert('Status enviado!','Obrigado por compartilhar',[{
            text: 'OK', onPress: ()=> navigation.goBack()
        },]);
    };

    return(
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}contentContainerStyle={estilos.conteudo}>
                {/**aqui es a parte do cabecalo */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto}/>
                    </TouchableOpacity>
                    <Text style={estilos.nomeLocal}>{local.nome}</Text>
                    <View style={estilos.badge}>
                        <Text style={estilos.textoBadge}>Aberto</Text>
                        <View style={estilos.bolinha}/>
                    </View>
                </View>
                <View style={estilos.separador}/>{/**separador */}
                {/**aqui seria a parte de localizacion */}
                <Text style={estilos.pergunta}>Voce esta aqui?</Text>
                <TouchableOpacity style={estilos.botaoLoc} onPress={()=>{setLocConfirmada(true); Alert.alert('Localizacao confirmada!!');}}>
                    <Text style={estilos.textoLoc}>
                        {locConfirmada ? 'Localizacao confirmada': 'Confirmar com google maps'}
                    </Text>
                </TouchableOpacity>
                <View style={estilos.separador}/>{/**separador */}
                {/**Vibe */}
                <Text style={estilos.pergunta}>
                    O que voce esta achando da vibe?
                </Text>
                <View style={estilos.opcoes}>
                    {['Excelente','Bom','Ok','Fraco'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={vibe === op} aoPresionar={()=> setVibe(op)}/>
                    ))}
                </View>

                {/**Musica */}
                <Text style={estilos.pergunta}>
                    Tipo de musica do Local?
                </Text>
                <View style={estilos.opcoes}>
                    {['Electronica','Funk','Pop','Rock'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={musica===op} aoPresionar={()=> setMusica(op)}/>
                    ))}
                </View>
                {/**Fila */}
                <Text style={estilos.pergunta}>
                    Tem fila?
                </Text>
                <View style={estilos.opcoes}>
                    {['Sem fila', 'Rapida', 'Media','Longa'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={fila===op} aoPresionar={()=> setFila(op)}/>
                    ))}
                </View>
                {/**Preco */}
                <Text style={estilos.pergunta}>
                    Precos?
                </Text>
                <View style={estilos.opcoes}>
                    {['$', '$$', '$$$'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={preco===op} aoPresionar={()=> setPreco(op)}/>
                    ))}
                </View>
                {/**seguranca */}
                <Text style={estilos.pergunta}>
                    O local tem seguranca?
                </Text>
                <View style={estilos.opcoes}>
                    {['Alta', 'Ok', 'Baixa'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={seguranca===op} aoPresionar={()=> setSeguranca(op)}/>
                    ))}
                </View>
                <View style={estilos.separador} />
                {/**Pessoas */}
                <Text style={estilos.pergunta}>
                    Cuantas pessoas voce esta vendo?
                </Text>
                <View style={estilos.contador}>
                    <TouchableOpacity style={estilos.botaoContador}onPress={()=>setPessoas(Math.max(0, pessoas-5))}>
                        <Text style={estilos.textoContador}>-</Text>
                    </TouchableOpacity>
                    <Text style={estilos.numeroPessoas}>
                        {pessoas}
                    </Text>
                    <TouchableOpacity style={estilos.botaoContador}onPress={()=> setPessoas(pessoas +5)}>
                        <Text style={estilos.textoContador}>+</Text>
                    </TouchableOpacity>
                </View>
                {/**Tempo de espera */}
                <Text style={estilos.pergunta}>
                    Tempo de espera?
                </Text>
                <View style={estilos.opcoes}>
                    {['0-5m', '5-10m', '10-20','20+m'].map((op)=>(
                        <TagRapida key={op} rotulo={op} selecionado={tempoEspera===op} aoPresionar={()=> setTempoEspera(op)}/>
                    ))}
                </View>
                <View style={estilos.separador} />
                {/* Comentários rápidos */}
                <Text style={estilos.pergunta}>Comentarios rápidos</Text>
                <View style={estilos.opcoes}>
                    {['Lotado', 'Bom dj', 'Promo 2×1', 'Outro'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={comentario === op} aoPresionar={() => setComentario(op)} />
                    ))}
                </View>
                {/**upLoad foto ou videos*/}
                <Text style={estilos.pergunta}>
                    Adicionar foto/videos (opcional)
                </Text>
                <TouchableOpacity style={estilos.botaoUpload}>
                    <Text style={estilos.textoUpload}>Subir arquivo</Text>
                </TouchableOpacity>
                {/**Enviar */}
                <TouchableOpacity style={estilos.botaoEnviar}onPress={enviar}>
                    <Text style={estilos.textoEnviar}>
                        Enviar agora
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 30 }} />
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
    nomeLocal: { color: CORES.texto, fontSize: TAMANHOS.xl, fontWeight: 'bold' },
    badge: { flexDirection: 'row', alignItems: 'center' },
    textoBadge: { color: CORES.texto, fontSize: TAMANHOS.md, marginRight: 6 },
    bolinha: { width: 12, height: 12, borderRadius: 6, backgroundColor: CORES.sucesso },
    separador: { height: 1, backgroundColor: CORES.primaria, marginVertical: 16 },
    pergunta: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    opcoes: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    botaoLoc: {
        backgroundColor: CORES.primaria,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: TAMANHOS.raio,
        alignSelf: 'flex-start',
    },
    textoLoc: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    contador: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    botaoContador: {
        backgroundColor: CORES.primaria,
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoContador: { color: CORES.texto, fontSize: 20, fontWeight: 'bold' },
    numeroPessoas: { color: CORES.texto, fontSize: 20, fontWeight: 'bold', marginHorizontal: 16 },
    botaoUpload: {
        backgroundColor: CORES.primaria,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: TAMANHOS.raio,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    textoUpload: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    botaoEnviar: {
        backgroundColor: CORES.secundaria,
        paddingVertical: 16,
        borderRadius: TAMANHOS.raio,
        alignItems: 'center',
        marginTop: 10,
    },
    textoEnviar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});