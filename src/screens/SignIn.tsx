import { useNavigation } from "@react-navigation/native";
import { VStack, Center, Image, Text, Heading, ScrollView, useToast } from "native-base";
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { useAuth } from "@hooks/useAuth";

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg'

import { AppError } from "@utils/AppError";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";

type FormDataProps = {
    email: string;
    password: string;
    
}

const signUpSchema = yup.object({   
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.')   
});


export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    async function handleSignIn({ email, password }: FormDataProps){
        try {
            setIsLoading(true);
            await signIn(email, password);

            
        } catch (error) {
            const isAppError = error instanceof AppError;
            
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

            setIsLoading(false);   

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

                     
        }
        
    }

    function handleNewAccount(){
        navigation.navigate('signUp')
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10}>
                <Image 
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode="contain"
                    position="absolute"
                />

                <Center my={24}>

                    <LogoSvg />

                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo
                    </Text>

                </Center>

                <Center>

                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Acesse sua conta
                    </Heading>

                    <Controller
                        control={control}
                        name="email"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                                onSubmitEditing={handleSubmit(handleSignIn)}
                                returnKeyType="send"
                            />
                        )}
                    />

                    <Button 
                        title="Acessar"
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />

                </Center>

                <Center mt={24}>
                    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                        Ainda não tem acesso?
                    </Text>

                    <Button 
                        title="Criar conta"
                        variant="outline"
                        onPress={handleNewAccount}
                    />
                </Center>

            </VStack>
        </ScrollView>
    );
}