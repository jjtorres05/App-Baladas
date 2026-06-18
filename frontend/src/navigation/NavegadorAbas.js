import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { CORES } from "../constants/tema";
import TelaHome from "../screens/TelaHome";
import TelaExplorar from "../screens/TelaExplorar";
import TelaMapa from "../screens/TelaMapa";
import TelaFavoritos from "../screens/TelaFavoritos";
import TelaPerfil from "../screens/TelaPerfil";

const Abas = createBottomTabNavigator();

export default function NavegadorAbas({aoSair}){
    return (
        <Abas.Navigator screenOptions={({route})=>({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: CORES.primaria,
                borderTopWidth: 0,
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarActiveTintColor: CORES.texto,
            tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
            tabBarShowLabel: false,
            tabBarIcon: ({color, size})=>{
                let nomeIcone;
                if (route.name==='Home') nomeIcone= 'home';
                else if (route.name==='Explorar')nomeIcone='compass';
                else if (route.name==='Mapa')nomeIcone='map';
                else if (route.name==='Favoritos')nomeIcone='bookmark';
                else if (route.name==='Perfil')nomeIcone='person';
                return <Ionicons name={nomeIcone} size={size} color={color}/>;
            },
        })}>
            <Abas.Screen name="Home" component={TelaHome}/>
            <Abas.Screen name="Explorar" component={TelaExplorar}/>
            <Abas.Screen name="Mapa" component={TelaMapa}/>
            <Abas.Screen name="Favoritos" component={TelaFavoritos}/>
            <Abas.Screen name="Perfil"> 
                {(props)=><TelaPerfil {...props}aoSair={aoSair}/>}
            </Abas.Screen>
        </Abas.Navigator>
    );
}