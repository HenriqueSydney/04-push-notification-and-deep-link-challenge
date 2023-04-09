import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@hooks/useAuth';

import { api } from '@services/api';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

import { AppError } from '@utils/AppError';


type FormDataProps = {
    name: string;
    email: string;
    old_password: string;
    new_password: string;
    new_password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    old_password: yup.string(),
    new_password: yup.string()
        .min(6, 'A senha deve ter, pelo menos, 6 dígitos.')
        .nullable()
        .transform((value) => !!value ? value : null),
    new_password_confirm: yup.string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('new_password'), null], 'A confirmação da nova senha não confere.')
        .when('new_password', {
            is: (Field: any) => Field,
            then: yup.string()
                .nullable()               
                .required('Informe a confirmação da nova senha.')
                .transform((value) => !!value ? value : null)
        }),
});

const PHOTO_SIZE = 33;

export function Profile(){
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();

    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema),
        defaultValues:{
            name: user.name,
            email: user.email
        }
    });

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if(photoSelected.canceled){
                return;
            } 

            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                
                if(photoInfo.size && (photoInfo.size/1024/1024) > 5){
                    return toast.show({
                        title: "Essa imagem é muito grande, escolha uma de até 5MB.",
                        placement:"top",
                        bgColor: 'red.500'
                    });                    
                }

                const fileExtension = photoSelected.assets[0].uri.split('.').pop();
                
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase().replace(' ', '_'),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    title: 'Foto atualizada!',
                    placement: 'top',
                    bgColor: 'green.500'
                })
            }
           

        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível atualizar sua foto. Tente novamente mais tarde.';

            toast.show({
                title,
                placement: "top",
                bgColor: "red.500"
            })
        } finally {
            setPhotoIsLoading(false);
        }
    }

    async function handleProfileUpdate({ name, old_password, new_password}: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = name;

            await api.put('/users', {name, old_password, password: new_password});

            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })
            

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
                        
        } finally{
            setIsUpdating(false);
        }
    }    
    
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
                <Center mt={6} px={10}>

                   { photoIsLoading ? 
                        <Skeleton  
                                w={PHOTO_SIZE} 
                                h={PHOTO_SIZE} 
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.200"
                            />
                    :
                        <UserPhoto 
                            source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg }
                            alt="Foto do usuário"
                            size={PHOTO_SIZE}
                        />
                    }

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Controller
                        control={control}
                        name="name"                       
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />
                   
                    <Controller
                        control={control}
                        name="email"                        
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />                
               
                    <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Alterar Senha
                    </Heading>

                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { onChange } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="new_password"
                        render={({ field: { onChange } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.new_password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="new_password_confirm"
                        render={({ field: { onChange } }) => (                           
                            <Input 
                                bg="gray.600"
                                placeholder="Confirme a nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                onSubmitEditing={handleSubmit(handleProfileUpdate)}
                                returnKeyType="send"
                                errorMessage={errors.new_password_confirm?.message}
                            />
                        )}
                    />  
              
                    <Button 
                        title="Atualizar"
                        mt={4}
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                    />

                </Center>
            </ScrollView>
        </VStack>
    );
}

//