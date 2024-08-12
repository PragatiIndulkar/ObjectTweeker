import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../components/ButtonComponent'
import LinearGradient from 'react-native-linear-gradient'
import OnBoardingScreen from './OnboardingScreen'
const MainScreen = ({navigation}) => {
    return (
        <View style={styles.mainContainer}>
             <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
      />
            {/* <View style={styles.topLayer}>
                <Image style={styles.logo} source={require('../image/logo.png')} />
                <Text style={styles.title}>ObjectTweeker</Text>
            </View> */}
            <OnBoardingScreen navigation={navigation}/>
            {/* <View style={styles.bottomLayer}>
                <Text style={[styles.title,{marginBottom:20}]}>Image Masking</Text>
                <Text style={styles.info}>Easily mask objects in your images, replace them with a few clicks & create stunning visual effects.</Text>
                <View style={styles.button}>
                    <LinearGradient colors={['#4600a3', "#091188"]} style={styles.gradient} >
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={()=> navigation.navigate('Home')}>
                            <Text style={styles.btnText}>Start Creating</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                </View>

            </View> */}
        </View>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'White'
    },
    topLayer: {
        marginTop:10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        marginLeft: 10,
        height: 30,
        width: 30
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#08046c',
        marginLeft: 10,
    },
    info: {
        fontSize: 18,
        color: '#2b577b',
        marginLeft: 10,
        marginBottom:20
    },
    bottomLayer: {
        position: 'absolute',
        bottom: 60
    },
    button:{
        width:'90%',
        alignSelf:'center',
    },
    gradient:{
        borderRadius:20,
    },
    btnText:{
        padding:10,
        fontSize:20,
        color:'#fff',
        fontWeight:'800'
    }
})