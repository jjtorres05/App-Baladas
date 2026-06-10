import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, TAMANHOS } from '../constants/tema';
import TagRapida from '../components/TagRapida';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postagemCliente, uploadImagem } from '../services/api';

export default function TelaFormAvaliacao({ route, navigation }) {
    const { local } = route.params;

    // Presença
    const [presencaConfirmada, setPresencaConfirmada] = useState(false);
    const [metodoPresenca, setMetodoPresenca] = useState(null); // 'gps' | 'qr'
    const [verificandoGPS, setVerificandoGPS] = useState(false);
    const [mostrarCamera, setMostrarCamera] = useState(false);
    const [permissaoCamera, pedirPermissaoCamera] = useCameraPermissions();

    // Formulário
    const [vibe, setVibe] = useState(null);
    const [musica, setMusica] = useState(null);
    const [fila, setFila] = useState(null);
    const [preco, setPreco] = useState(null);
    const [seguranca, setSeguranca] = useState(null);
    const [pessoas, setPessoas] = useState(20);
    const [tempoEspera, setTempoEspera] = useState(null);
    const [comentario, setComentario] = useState(null);
    const [imagemSelecionada, setImagemSelecionada] = useState(null);

    const [carregando, setCarregando]= useState(false);
    
    // VERIFICAÇÃO POR GPS
    const verificarPorGPS = async () => {
        setVerificandoGPS(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua localização');
                setVerificandoGPS(false);
                return;
            }

            const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = posicao.coords;

            // Se o local tem coordenadas, verifica distância
            if (local.latitude && local.longitude) {
                const distancia = calcularDistancia(
                    latitude, longitude,
                    parseFloat(local.latitude), parseFloat(local.longitude)
                );

                // Aceita se estiver a menos de 200 metros
                if (distancia <= 200) {
                    setPresencaConfirmada(true);
                    setMetodoPresenca('gps');
                    Alert.alert('Presença confirmada!', 'Localização verificada com sucesso.');
                } else {
                    Alert.alert(
                        'Você não parece estar no local',
                        `Você está a aproximadamente ${Math.round(distancia)}m do estabelecimento. Tente usar o QR Code.`
                    );
                }
            } else {
                // Se não tem coordenadas cadastradas, aceita por enquanto
                setPresencaConfirmada(true);
                setMetodoPresenca('gps');
                Alert.alert('Localização registrada!', 'Presença confirmada.');
            }
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível obter sua localização');
        }
        setVerificandoGPS(false);
    };

    // Calcula distância entre 2 coordenadas (em metros) — fórmula de Haversine
    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // raio da Terra em metros
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // VERIFICAÇÃO POR QR CODE
    const verificarPorQR = async () => {
        if (!permissaoCamera?.granted) {
            const resultado = await pedirPermissaoCamera();
            if (!resultado.granted) {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para escanear o QR Code');
                return;
            }
        }
        setMostrarCamera(true);
    };

    const aoEscanearQR = (evento) => {
        const qrCode = evento.data;
        setMostrarCamera(false);

        // Verifica se o QR code corresponde ao local
        if (local.qr_code && qrCode === local.qr_code) {
            setPresencaConfirmada(true);
            setMetodoPresenca('qr');
            Alert.alert('Presença confirmada!', 'QR Code verificado com sucesso.');
        } else {
            // TODO: verificar no backend → confirmarPresenca(idUsuario, qrCode)
            // Por enquanto aceita qualquer QR (para testes)
            setPresencaConfirmada(true);
            setMetodoPresenca('qr');
            Alert.alert('Presença confirmada!', 'QR Code registrado.');
        }
    };

    // IMAGEM
    const escolherImagem = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!resultado.canceled) {
            setImagemSelecionada(resultado.assets[0].uri);
        }
    };

    const tirarFoto = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera');
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

    const aoEscolherMedia = () => {
        Alert.alert('Adicionar foto/vídeo', 'Escolha uma opção', [
            { text: 'Câmera', onPress: tirarFoto },
            { text: 'Galeria', onPress: escolherImagem },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    // ENVIAR
    const enviar = async () => {
        if (!presencaConfirmada) {
            Alert.alert('Confirme sua presença', 'Você precisa confirmar que está no local antes de enviar.');
            return;
        }
        setCarregando(true);
        try{
            let urlImagem= null;
            if(imagemSelecionada){
                urlImagem= await uploadImagem(imagemSelecionada);
            }
            const idUsuario = await AsyncStorage.getItem('idUsuario');
            const idLocal = local.id_estabelecimento || local.id;
            await postagemCliente({
                id_usuario: idUsuario,
                id_estabelecimento: idLocal,
                legenda: comentario || '',
                nota: vibe === 'Excelente' ? 5 : vibe === 'Bom' ? 4 : vibe === 'Ok' ? 3 : vibe === 'Fraco' ? 2 : null,
                vibe,
                musica,
                fila,
                preco,
                seguranca,
                pessoas,
                tempo_espera: tempoEspera,
                imagem: urlImagem,
                metodo_presenca: metodoPresenca,
            });
            Alert.alert('Status enviado!', 'Obrigado por compartilhar', [{
                text: 'OK', onPress: () => navigation.goBack()
            }]);
        }catch (erro){
            Alert.alert('Erro',erro.message || 'Nao foi possivel enviar');
        }
        setCarregando(false);
    };

    // TELA DO SCANNER QR
    if (mostrarCamera) {
        return (
            <SafeAreaView style={estilos.container}>
                <View style={estilos.cabecalhoCamera}>
                    <TouchableOpacity onPress={() => setMostrarCamera(false)}>
                        <Ionicons name="close" size={28} color={CORES.texto} />
                    </TouchableOpacity>
                    <Text style={estilos.tituloCamera}>Escanear QR Code</Text>
                    <View style={{ width: 28 }} />
                </View>
                <CameraView
                    style={estilos.camera}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={aoEscanearQR}
                >
                    <View style={estilos.overlayQR}>
                        <View style={estilos.quadradoQR} />
                        <Text style={estilos.textoQR}>
                            Aponte a câmera para o QR Code do estabelecimento
                        </Text>
                    </View>
                </CameraView>
            </SafeAreaView>
        );
    }

    // TELA PRINCIPAL
    return (
        <SafeAreaView style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.conteudo}>
                {/* Cabeçalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={CORES.texto} />
                    </TouchableOpacity>
                    <Text style={estilos.nomeLocal}>{local.nome}</Text>
                    <View style={estilos.badge}>
                        <Text style={estilos.textoBadge}>{local.aberto ? 'Aberto' : 'Fechado'}</Text>
                        <View style={[estilos.bolinha, { backgroundColor: local.aberto ? CORES.sucesso : CORES.perigo }]} />
                    </View>
                </View>

                <View style={estilos.separador} />

                {/*PRESENÇA*/}
                <Text style={estilos.pergunta}>Confirme sua presença</Text>

                {presencaConfirmada ? (
                    <View style={estilos.presencaConfirmada}>
                        <Ionicons name="checkmark-circle" size={24} color={CORES.sucesso} />
                        <Text style={estilos.textoPresencaOk}>
                            Presença confirmada {metodoPresenca === 'gps' ? 'por localização' : 'por QR Code'}
                        </Text>
                    </View>
                ) : (
                    <View style={estilos.opcoesPresenca}>
                        <TouchableOpacity
                            style={estilos.botaoPresenca}
                            onPress={verificarPorGPS}
                            disabled={verificandoGPS}
                        >
                            <Ionicons name="location" size={20} color={CORES.texto} />
                            <Text style={estilos.textoPresenca}>
                                {verificandoGPS ? 'Verificando...' : 'Verificar por GPS'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.botaoPresenca} onPress={verificarPorQR}>
                            <Ionicons name="qr-code" size={20} color={CORES.texto} />
                            <Text style={estilos.textoPresenca}>Escanear QR Code</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={estilos.separador} />

                {/*FORMULÁRIO*/}
                {/* Vibe */}
                <Text style={estilos.pergunta}>O que você está achando da vibe?</Text>
                <View style={estilos.opcoes}>
                    {['Excelente', 'Bom', 'Ok', 'Fraco'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={vibe === op} aoPresionar={() => setVibe(op)} />
                    ))}
                </View>

                {/* Música */}
                <Text style={estilos.pergunta}>Tipo de música do local?</Text>
                <View style={estilos.opcoes}>
                    {['Eletrônica', 'Funk', 'Pop', 'Rock'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={musica === op} aoPresionar={() => setMusica(op)} />
                    ))}
                </View>

                {/* Fila */}
                <Text style={estilos.pergunta}>Tem fila?</Text>
                <View style={estilos.opcoes}>
                    {['Sem fila', 'Rápida', 'Média', 'Longa'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={fila === op} aoPresionar={() => setFila(op)} />
                    ))}
                </View>

                {/* Preço */}
                <Text style={estilos.pergunta}>Preços?</Text>
                <View style={estilos.opcoes}>
                    {['$', '$$', '$$$'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={preco === op} aoPresionar={() => setPreco(op)} />
                    ))}
                </View>

                {/* Segurança */}
                <Text style={estilos.pergunta}>O local tem segurança?</Text>
                <View style={estilos.opcoes}>
                    {['Alta', 'Ok', 'Baixa'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={seguranca === op} aoPresionar={() => setSeguranca(op)} />
                    ))}
                </View>

                <View style={estilos.separador} />

                {/* Pessoas */}
                <Text style={estilos.pergunta}>Quantas pessoas você está vendo?</Text>
                <View style={estilos.contador}>
                    <TouchableOpacity style={estilos.botaoContador} onPress={() => setPessoas(Math.max(0, pessoas - 5))}>
                        <Text style={estilos.textoContador}>-</Text>
                    </TouchableOpacity>
                    <Text style={estilos.numeroPessoas}>{pessoas}</Text>
                    <TouchableOpacity style={estilos.botaoContador} onPress={() => setPessoas(pessoas + 5)}>
                        <Text style={estilos.textoContador}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Tempo de espera */}
                <Text style={estilos.pergunta}>Tempo de espera?</Text>
                <View style={estilos.opcoes}>
                    {['0-5m', '5-10m', '10-20m', '20+m'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={tempoEspera === op} aoPresionar={() => setTempoEspera(op)} />
                    ))}
                </View>

                <View style={estilos.separador} />

                {/* Comentários rápidos */}
                <Text style={estilos.pergunta}>Comentários rápidos</Text>
                <View style={estilos.opcoes}>
                    {['Lotado', 'Bom DJ', 'Promo 2×1', 'Outro'].map((op) => (
                        <TagRapida key={op} rotulo={op} selecionado={comentario === op} aoPresionar={() => setComentario(op)} />
                    ))}
                </View>

                {/* Upload foto/vídeo */}
                <Text style={estilos.pergunta}>Adicionar foto/vídeo (opcional)</Text>
                <TouchableOpacity style={estilos.botaoUpload} onPress={aoEscolherMedia}>
                    <Ionicons name="cloud-upload-outline" size={18} color={CORES.texto} />
                    <Text style={estilos.textoUpload}> Subir arquivo</Text>
                </TouchableOpacity>
                {imagemSelecionada && (
                    <View style={estilos.previewContainer}>
                        <Image source={{ uri: imagemSelecionada }} style={estilos.previewImagem} />
                        <TouchableOpacity style={estilos.botaoRemover} onPress={() => setImagemSelecionada(null)}>
                            <Ionicons name="close-circle" size={28} color={CORES.perigo} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Enviar */}
                <TouchableOpacity
                    style={[estilos.botaoEnviar, !presencaConfirmada && estilos.botaoDesabilitado, carregando && {opacity:0.6}]}
                    onPress={enviar}
                    disabled={!presencaConfirmada || carregando}
                >
                    {carregando ? (<ActivityIndicator color={CORES.fundo}/>):(
                        <Text style={estilos.textoEnviar}>Enviar agora</Text>
                    )}
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
    bolinha: { width: 12, height: 12, borderRadius: 6 },
    separador: { height: 1, backgroundColor: CORES.primaria, marginVertical: 16 },
    pergunta: { color: CORES.texto, fontSize: TAMANHOS.lg, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    opcoes: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },

    // Presença
    opcoesPresenca: {
        flexDirection: 'row',
        gap: 12,
    },
    botaoPresenca: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CORES.primaria,
        paddingVertical: 14,
        borderRadius: TAMANHOS.raio,
        gap: 8,
    },
    textoPresenca: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    presencaConfirmada: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CORES.superficie,
        padding: 14,
        borderRadius: TAMANHOS.raio,
        gap: 10,
    },
    textoPresencaOk: {
        color: CORES.sucesso,
        fontSize: TAMANHOS.md,
        fontWeight: '600',
    },

    // Camera QR
    cabecalhoCamera: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: TAMANHOS.espacamento,
        paddingVertical: 12,
    },
    tituloCamera: {
        color: CORES.texto,
        fontSize: TAMANHOS.xl,
        fontWeight: 'bold',
    },
    camera: { flex: 1 },
    overlayQR: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quadradoQR: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: CORES.primaria,
        borderRadius: 20,
    },
    textoQR: {
        color: CORES.texto,
        fontSize: TAMANHOS.md,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
    },

    // Contador
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

    // Upload
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
    textoUpload: { color: CORES.texto, fontSize: TAMANHOS.md, fontWeight: '600' },
    previewContainer: { position: 'relative', marginBottom: 16 },
    previewImagem: { width: '100%', height: 200, borderRadius: TAMANHOS.raio },
    botaoRemover: { position: 'absolute', top: 8, right: 8 },

    // Enviar
    botaoEnviar: {
        backgroundColor: CORES.secundaria,
        paddingVertical: 16,
        borderRadius: TAMANHOS.raio,
        alignItems: 'center',
        marginTop: 10,
    },
    botaoDesabilitado: {
        opacity: 0.4,
    },
    textoEnviar: { color: CORES.fundo, fontSize: TAMANHOS.lg, fontWeight: 'bold' },
});
