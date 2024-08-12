import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const PopUpWindowComponent = ({modalVisible}) => {
    const [modalVisibility, setModalVisibility] = useState(false)
    useEffect(()=>{
        setModalVisibility(modalVisible)
        // const openModal=()=>{
        //    }
    })
    
       const closeModal=()=>{
    setModalVisibility(false)
   }
  return (
    <View style={styles.container}>
      <Text>PopUpWindowComponent</Text>
     
    </View>
  )
}

export default PopUpWindowComponent

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }

})