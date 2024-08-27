import Constants from 'expo-constants'
import { useState } from 'react';

import { dataBase } from '../Database/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

import { useNavigation } from '@react-navigation/native';
import { 
    View, 
    Text, 
    Image, 
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TextInput,
    Pressable,
    Alert
    } from "react-native";

export function Login(){
    const [user, setUser] = useState(null);
    const [pass, setPass] = useState(null);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    const handleLogin = async () => { 
        try {
          const usersRef = collection(dataBase, 'Customers');
          const q = query(usersRef, where('UserName', '==', user));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            setError(null);
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
            const passSalt = pass + userData.Salt;
            const passHash = CryptoJS.SHA256(passSalt).toString(CryptoJS.enc.Hex);
            console.log(passHash)
            console.log(userData.Password);
            if(passHash === userData.Password){
                navigation.navigate('tabs', userData)
            }else{
              setError('Contraseña incorrecta');
            }
          } else {
            setError('Contraseña o usuario incorrecto');
          }
        } catch (error) {
          setError('An error occurred, please try again later');
          console.error('Login failed:', error);
        }
    }

    const handleMoveToNewCustomer = () => {Alert.alert('Visita a la nutriologa NUTRIOLOGA');}

    return(
        <SafeAreaView>
            <View style={styles.TopLogin}>
                <Text style={{textAlign: 'center', fontSize: 36}}>Inicio de sesion</Text>
            </View>
            <View style={styles.ImgLoginView}>
                <Image 
                source={require('../../assets/MealMentorLogo.png')}
                style={styles.ImageLogin}
                alt='Logo-MealMentor'
                />
            </View>
            <View style={styles.ViewInputsLogin}>
                <TextInput
                style={styles.inputLogin}
                placeholder='Usuario' 
                inputMode='text'
                placeholderTextColor={'#01273C80'}
                onChangeText={(text)=>{setUser(text)}}
                />
                <TextInput
                style={styles.inputLogin}
                placeholder='Contraseña' 
                inputMode='text'
                placeholderTextColor={'#01273C80'}
                secureTextEntry
                onChangeText={(text)=>{setPass(text)}}
                />
                {error && <Text style={{color: 'red'}}>{error}</Text>}
                <Pressable  onPress={handleLogin} style={({pressed}) => [
                    {
                    backgroundColor: pressed ? "#01273C80" : "#01273C",
                    },
                    styles.ViewButtonLogin,
                    ]}>
                        <Text style={{color: '#FFFFFF', fontSize:24, textAlign:'center'}}>Entrar</Text>
                </Pressable >

                <Text 
                style={{color: '#00C2FF', marginTop: 35, fontSize:18, textDecorationLine: 'underline'}} 
                onPress={handleMoveToNewCustomer}>
                    ¿No tienes una cuenta?
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    TopLogin: {
    marginTop: Constants.statusBarHeight, 
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10
    },

    ImgLoginView: {
        alignSelf: 'center',
        borderWidth: 2,
        height: Dimensions.get('window').height * 0.35,
        width: Dimensions.get('window').height * 0.35,
        borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
        borderColor: '#D3A357',
        marginTop: 30,
    },

    ImageLogin: {
        height: Dimensions.get('window').height * 0.35,
        width: Dimensions.get('window').height * 0.35,
        alignSelf: 'center'
    },

    ViewInputsLogin: {
        alignItems: 'center',
        marginTop: 30
    },

    inputLogin:{
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#01273C',
        height: 50,
        width: 185,
        fontSize: 24,
        margin: 20
    },

    ViewButtonLogin:{
        height: 50,
        width: 133,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D3A357',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    }
})