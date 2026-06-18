import React from "react";
import { View,StyleSheet,TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CORES } from "../constants/tema";

export default function TelaInicial({navigation}){
    return(
        <TouchableOpacity
            style={{flex:1}}
            activeOpacity={1}
            onPress={()=>navigation.navigate('Login')}
        >
            <LinearGradient
            colors={['#9B59B6', '#6C63FF']}
            style={estilos.container}
            >
                <View style={estilos.logoContainer}>
                    <Ionicons name="location" size={80} color={CORES.primaria}/>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});