import React,{useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CORES } from "../constants/tema";
import PilhaAutenticacao from "./PilhaAutenticacao";
import NavegadorAbas from "./NavegadorAbas";
import TelaListaCategoria from "../screens/TelaListaCategoria";
import TelaDetalheLocal from "../screens/TelaDetalheLocal";
import TelaFormAvaliacao from "../screens/TelaFormAvaliacao";

const Pilha = createNativeStackNavigator();

export default function NavegadorPrincipal(){
    const [estaLogado, setEstaLogado]= useState(false);

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
                <Pilha.Screen name="Abas" component={NavegadorAbas}/>
                <Pilha.Screen name="ListaCategoria" component={TelaListaCategoria}/>
                <Pilha.Screen name="DetalheLocal" component={TelaDetalheLocal}/>
                <Pilha.Screen name="FormAvaliacao" component={TelaFormAvaliacao}/>
            </Pilha.Navigator>
        </NavigationContainer>
    );
}