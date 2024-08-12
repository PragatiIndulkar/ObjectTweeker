import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ButtonComponent = ({name,OnPress}) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity style={styles.button} onPress={OnPress}>
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ButtonComponent

const styles = StyleSheet.create({
    main:{
      flex:1
    },
    button:{
        width:"90%",
        height:50,
        backgroundColor:'#4600a3',
        borderRadius:10,
        alignSelf:'center',
        marginTop:20,
    },
    text:{
        padding:10,
        textAlign:'center',
        fontSize:20,
        color:'white',
        fontWeight:'600'
    }
})