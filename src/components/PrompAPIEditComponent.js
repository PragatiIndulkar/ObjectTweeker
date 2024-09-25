import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PrompAPIEditComponent = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [savedBaseUrl, setSavedBaseUrl] = useState(null);

  // Retrieve the saved base URL from AsyncStorage on component mount
  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = await AsyncStorage.getItem('baseUrl');
      if (url) {
        setSavedBaseUrl(url); // Set savedBaseUrl so it won't ask again
      }
    };
    fetchBaseUrl();
  }, []);

  // Save the base URL to AsyncStorage
  const saveBaseUrl = async () => {
    if (baseUrl.trim()) {
      await AsyncStorage.setItem('baseUrl', baseUrl);
      setSavedBaseUrl(baseUrl); // Mark as saved
    }
  };

  // Function to call API using the saved base URL
  const callApi = async () => {
    const url = `${savedBaseUrl}/api/your-endpoint`;
    try {
      const response = await axios.get(url);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <View style={style.main}>
      {!savedBaseUrl ? (
        <View style={style.container}>
          <TextInput
            placeholder="Enter Base URL"
            value={baseUrl}
            onChangeText={setBaseUrl}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Save URL" onPress={saveBaseUrl} />
        </View>
      ) : (
        <View>
          <Text>Base URL: {savedBaseUrl}</Text>
          <Button title="Call API" onPress={callApi} />
        </View>
      )}
    </View>
  );
};

export default PrompAPIEditComponent;
const style=StyleSheet.create({
    main:{
        flex:1,
    //    backgroundColor:"gray",
    },
    container:{
        justifyContent:'center',
        alignItems:'center',
    },
})
