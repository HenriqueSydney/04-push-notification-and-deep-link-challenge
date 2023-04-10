import {  Platform, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ONESIGNAL_KEY } from '@env'

import { AuthContextProvider } from '@contexts/AuthContext';
 
import { THEME } from './src/theme';

import { Loading } from '@components/Loading';
import { Routes } from './src/routes';
import OneSignal from 'react-native-onesignal';

const oneSignalAppId = Platform.OS === 'ios' ? 'appleID' : ONESIGNAL_KEY
OneSignal.setAppId(oneSignalAppId);

OneSignal.promptForPushNotificationsWithUserResponse()


export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular,Roboto_700Bold })

  return (

    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}   
      </AuthContextProvider> 
      
    </NativeBaseProvider>
  );
}
