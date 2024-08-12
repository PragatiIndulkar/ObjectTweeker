import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native'
import React, { useEffect } from 'react'

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainScreen');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={style.main}>
       <StatusBar
        barStyle='dark-content'
        backgroundColor="transparent"
      />
      <View style={style.loaderView}>
        <ActivityIndicator size='large' style={{ transform: [{ scaleX: 1.5}, { scaleY: 1.5 }] }}color={"#4600a3"}/>
      </View>
    </View>
  )
}

export default Splash
const style = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  textH: {
    fontSize: 20,
    color: 'black'
  },
  loaderView: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})