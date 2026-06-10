import React,{useState, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CORES } from "../constants/tema";
import PilhaAutenticacao from "./PilhaAutenticacao";
import NavegadorAbas from "./NavegadorAbas";
import TelaListaCategoria from "../screens/TelaListaCategoria";
import TelaDetalheLocal from "../screens/TelaDetalheLocal";
import TelaFormAvaliacao from "../screens/TelaFormAvaliacao";
import TelaProprietarioPainel from "../screens/TelaProprietarioPainel";
import TelaCadastroEstabelecimento from "../screens/TelaCadastroEstabelecimento";
import TelaPostarEvento from "../screens/TelaPostarEvento";
import TelaMeusEstabelecimentos from "../screens/TelaMeusEstabelecimentos";
import TelaGerenciarCardapio from "../screens/TelaGerenciarCardapio";
import { getUsuarioLogado } from "../services/api";


const Pilha = createNativeStackNavigator();

export default function NavegadorPrincipal(){
    const [estaLogado, setEstaLogado]= useState(false);
    const [verificando, setVerificando]= useState(true);
    //Ao abrir a app, verifica se tem um token salvo para accessar diretamente
    useEffect(()=>{
        const verificar = async () => {
            const usuario = await getUsuarioLogado();
            if(usuario) setEstaLogado(true);
            setVerificando(false);
        };
        verificar();
    },[]);

    //tela em branco enquanto verifica
    if(verificando) return null;

    if(!estaLogado){
        return (
            <NavigationContainer>
                <PilhaAutenticacao aoEntrar={()=>
                    setEstaLogado(true)
                }/>
            </NavigationContainer>
        );
    }
    return(
        <NavigationContainer>
            <Pilha.Navigator screenOptions={{
                headerShown: false,
                contentStyle: {backgroundColor: CORES.fundo},
            }}>
                <Pilha.Screen name="Abas">
                    {(props)=><NavegadorAbas {...props} aoSair={()=>setEstaLogado(false)}/>} 
                </Pilha.Screen>
                <Pilha.Screen name="ListaCategoria" component={TelaListaCategoria}/>
                <Pilha.Screen name="DetalheLocal" component={TelaDetalheLocal}/>
                <Pilha.Screen name="FormAvaliacao" component={TelaFormAvaliacao}/>
                <Pilha.Screen name="ProprietarioPainel" component={TelaProprietarioPainel} />
                <Pilha.Screen name="CadastrarEstabelecimento" component={TelaCadastroEstabelecimento} />
                <Pilha.Screen name="PostarEvento" component={TelaPostarEvento} />
                <Pilha.Screen name="MeusEstabelecimentos" component={TelaMeusEstabelecimentos} />
                <Pilha.Screen name="GerenciarCardapio" component={TelaGerenciarCardapio} />
            </Pilha.Navigator>
        </NavigationContainer>
    );
}