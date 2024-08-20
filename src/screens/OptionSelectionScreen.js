import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const OptionSelectionScreen = ({navigation}) => {
    return (
        <View style={styles.main}>
            <StatusBar
                barStyle='dark-content'
                backgroundColor="transparent"
            />
            <View style={styles.ButtonsView}>
                <TouchableOpacity style={[styles.Btn,{marginBottom:10}]} onPress={()=>navigation.navigate('EditOptionsComponent',{isDrawTrue:true})}>
                    <MaterialCommunityIcons name={'draw'} size={110} color={'white'} style={styles.icon} />
                </TouchableOpacity>
                <Text style={{marginBottom:100,fontSize:18}}>Draw Mask</Text>
                <TouchableOpacity style={[styles.Btn, { marginTop: 20,marginBottom:10 }]} onPress={()=>navigation.navigate('Home',{isDrawTrue:false})}>
                    <Text style={styles.text}>AI</Text>
                </TouchableOpacity>
                <Text style={{fontSize:18}}>AI Image Masking</Text>
            </View>

        </View>
    )
}

export default OptionSelectionScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white'
    },
    ButtonsView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
       // flexDirection: 'column',

    },
    Btn: {
        backgroundColor: '#08046c',
        width: '40%',
        height: 150,
        borderRadius: 20
    },
    icon: {
        alignSelf: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 100,
        color: 'white',
        alignSelf: 'center'
    }
})