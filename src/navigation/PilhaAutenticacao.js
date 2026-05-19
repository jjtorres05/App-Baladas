import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaInicial from "../screens/TelaInicial";
import TelaLogin from "../screens/TelaLogin";
import TelaCadastro from "../screens/TelaCadastro";

const Pilha = createNativeStackNavigator();

export default function PilhaAutenticacao({aoEntrar}){
    return(
        <Pilha.Navigator screenOptions={{headerShown: false}}>
            <Pilha.Screen name="Inicial" component={TelaInicial}/>
            <Pilha.Screen name="Login">
                {(props)=> <TelaLogin{...props}aoEntrar={aoEntrar}/>}
            </Pilha.Screen>
            <Pilha.Screen name="Cadastro">
                {(props)=> <TelaCadastro {...props} aoEntrar={aoEntrar}/>}
            </Pilha.Screen>
        </Pilha.Navigator>
    );
}