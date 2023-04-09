import {  Platform, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { AuthContextProvider } from '@contexts/AuthContext';
 
import { THEME } from './src/theme';

import { Loading } from '@components/Loading';
import { Routes } from './src/routes';
import OneSignal from 'react-native-onesignal';

const oneSignalAppId = Platform.OS === 'ios' ? 'appleID' : '68a94c6a-3781-40d9-9259-b24a8cbf499b'
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
