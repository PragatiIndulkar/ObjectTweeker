import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import Masking_EditScreen from '../screens/Masking_EditScreen';
import MainScreen from '../screens/MainScreen';
import Entypo from 'react-native-vector-icons/Entypo'
import { ModalProvider, useModal } from '../utils/ModalContext';
import OptionModalComponent from '../components/OptionModalComponent';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OptionSelectionScreen from '../screens/OptionSelectionScreen';
import EditOptionsComponent from '../components/EditOptionsComponent';
const stack = createStackNavigator();

const HeaderRight = () => {
  const { isModalVisible, showModal, hideModal } = useModal();

  const toggleModal = () => {
    isModalVisible ? hideModal() : showModal();
  };

  return (
    <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleModal}>
      <Entypo name="dots-three-vertical" size={20} style={{ color: '#08046c' }} />
    </TouchableOpacity>
  );
};

const MainNavigator = () => {
  return (
    <ModalProvider>
      <NavigationContainer >
        <stack.Navigator>
          <stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
          <stack.Screen name="OptionSelectionScreen" component={OptionSelectionScreen} options={{
              title: 'ObjectTweeker',
              headerTintColor: "#08046c",
              headerRight: () => <HeaderRight />
            }}/>
            <stack.Screen name="EditOptionsComponent" component={EditOptionsComponent} options={{ headerShown: false }}/>
          <stack.Screen name="Home" component={Home}
            options={{
              title: '',
              headerTintColor: "#08046c",
              headerRight: () => <HeaderRight />
            }} />
          <stack.Screen name="Masking_EditScreen" component={Masking_EditScreen}
            options={{
              title: '',
              headerTintColor: "#08046c",
              headerRight: () => <HeaderRight />
            }} />
             <stack.Screen name="ProfileScreen" component={ProfileScreen} options={{title:'',headerTintColor: "#08046c",  headerRight: () => <HeaderRight /> }} />
             <stack.Screen name="SettingsScreen" component={SettingsScreen} options={{title:'',headerTintColor: "#08046c",  headerRight: () => <HeaderRight /> }} />
             <stack.Screen name="DashboardScreen" component={DashboardScreen} options={{title:'',headerTintColor: "#08046c",  headerRight: () => <HeaderRight /> }} />
        </stack.Navigator>
      <OptionModalComponent/>
      </NavigationContainer>
    </ModalProvider>
  )
}

export default MainNavigator


