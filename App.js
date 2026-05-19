import React from 'react';
import { StatusBar } from 'expo-status-bar';
import NavegadorPrincipal from './src/navigation/NavegadorPrincipal';

export default function App(){
  return(
    <>
      <StatusBar style='light'/>
      <NavegadorPrincipal/>
    </>
  );
}
