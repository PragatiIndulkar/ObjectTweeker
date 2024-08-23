import { View, Text } from 'react-native'
import React from 'react'
import MainNavigator from './src/navigator/MainNavigator'
import { Provider } from 'react-redux'
import Mystore from './src/redux/store'
const App = () => {
  return (
     <Provider store={Mystore} >
      <MainNavigator />
     </Provider>

  )
}

export default App