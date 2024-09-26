import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, Image, StatusBar, Animated, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
import { OnBoardingData } from "../utils/onboardingData";
import LinearGradient from "react-native-linear-gradient";
import { useModal } from "../utils/ModalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Animated from "react-native-reanimated";
export default function OnBoardingScreen({ navigation }) {
    const scrollx = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width, height } = Dimensions.get('screen')
    const [showBaseUrlSetup, setShowBaseUrlSetup] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const slideRef = useRef(null);
    const [baseUrl, setBaseUrl] = useState('');
    const [savedBaseUrl, setSavedBaseUrl] = useState(null);

  // Retrieve the saved base URL from AsyncStorage on component mount
//   useEffect(() => {
//     const fetchBaseUrl = async () => {
//       const url = await AsyncStorage.getItem('baseUrl');
     
//       if (url) {
//         setSavedBaseUrl(url); // Set savedBaseUrl so it won't ask again
//       }
//     };
//     fetchBaseUrl();
//   }, []);

  // Save the base URL to AsyncStorage
  const saveBaseUrl = async () => {
    if (baseUrl.trim()) {
      await AsyncStorage.setItem('baseUrl', baseUrl);
      setSavedBaseUrl(baseUrl); // Mark as saved
      setModalVisible(false)
    }
  };

    const openModal =()=>{
        setModalVisible(true)
    }

     const closeModal =()=>{
    //     saveBaseUrl()
         setModalVisible(false)
     }

    const onViewableItemsChanged = info => {
        console.log(info);
        setCurrentIndex(info.viewableItems[0].index);
    };
    const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }])
    const OnBoardingItem = ({ item }) => {
        return (
            <View style={{ width, height, justifyContent: 'center', padding: 20, paddingBottom: 200 }}>
                <StatusBar backgroundColor={'white'} />
                <Image source={item.image} style={{ width: '100%', flex: 0.5, resizeMode: 'contain', marginBottom: 20 }} />
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#08046c', marginBottom: 10 }}>{item.heading}</Text>
                <Text style={{ fontSize: 18, color: '#08046c' }}>{item.subHeading}</Text>
            </View>
        )
    }

    const Indicator = ({ scrollx }) => {
        return (
            <View style={{
                position: 'absolute',
                bottom: 140,
                flexDirection: 'row',
                alignSelf: 'center'
            }}>
                {
                    OnBoardingData.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const scale = scrollx.interpolate({
                            inputRange,
                            outputRange: [0.8, 1.4, 0.8],
                            extrapolate: 'clamp'
                        })
                        const opacity = scrollx.interpolate({
                            inputRange,
                            outputRange: [0.6, 0.9, 0.8],
                            extrapolate: 'clamp'
                        })
                        return (
                            <Animated.View
                                key={`indicator_${i}`}
                                style={{
                                    height: 10,
                                    width: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#08046c',
                                    margin: 10,
                                    transform: [{ scale }],
                                    opacity,
                                }}
                            />
                        )
                    })
                }
            </View>
        )
    };
    function scrollTo() {
        if (currentIndex < OnBoardingData.length - 1) {
            slideRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
        else {
            navigation.navigate('OptionSelectionScreen')
            console.log('LastPage')
        }
    }
    function skipTo() {
        if (currentIndex < OnBoardingData.length - 1) {
            slideRef.current.scrollToIndex({ index: OnBoardingData.length - 1 });
        }
        else {
            navigation.navigate('OptionSelectionScreen')
            console.log('LastPage')
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.topLayer}>
            <TouchableOpacity onPress={()=>setModalVisible(true)}>
                {/* <Image style={styles.logo} source={require('../image/logo.png')} /> */}
                <Text style={styles.title}>ObjectTweeker</Text>
            </TouchableOpacity>
            </View>
            <Animated.FlatList
                ref={slideRef}
                data={OnBoardingData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OnBoardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollx } } }],
                    { useNativeDriver: false }
                )}
                bounces={false}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />

            <Indicator scrollx={scrollx} />
            <View style={{
                position: 'absolute',
                bottom: 20,
                width: '90%',
                justifyContent: 'center',
                alignSelf: 'center'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: currentIndex == OnBoardingData.length - 1 ? 'center' : 'space-between',
                }}>
                    {currentIndex != OnBoardingData.length - 1 && (
                        <View style={styles.button}>
                            <LinearGradient colors={['#bfbfbf', "#8c8c8c"]} style={styles.gradient} >
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => skipTo()}>
                                    <Text style={styles.btnText}>
                                        {
                                            currentIndex == OnBoardingData.length - 1 ? "Next" : "Skip"
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}
                    <View style={[styles.button, { width: currentIndex == OnBoardingData.length - 1 ? 300 : 150 }]}>
                        <LinearGradient colors={['#4600a3', "#091188"]} style={styles.gradient} >
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => scrollTo()}>
                                <Text style={styles.btnText}>
                                    {
                                        currentIndex == OnBoardingData.length - 1 ? "Start Creating" : "Next"
                                    }
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
            {modalVisible && (
            <View style={styles.modalView}>
              <Modal
                animationType='none'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  //Alert.alert('Modal has been closed.');
                  setModalVisibility(!modalVisible);
                }
                }
              >
                <View style={styles.modalView}>
                  <View style={styles.innerViewModal}>
                  <TextInput
              style={styles.textInput}
              onChangeText={setBaseUrl}
              //value={}
              placeholder='Enter Base URL'
              placeholderTextColor={'gray'}
            />
                    <TouchableOpacity style={[styles.buttonNew, { flexDirection: 'row', alignSelf: 'center' }]} onPress={() => saveBaseUrl()}>
                      <Text style={{ marginLeft: 10, fontSize: 18, color: 'black', color: 'white', fontWeight: '500' }}>Save URL</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          )}
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    topLayer: {
        marginTop: 10,
        //flexDirection: 'row',
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
        marginBottom: 20
    },
    bottomLayer: {
        position: 'absolute',
        bottom: 60
    },
    button: {
        width: 150,
        alignSelf: 'center',
    },
    gradient: {
        borderRadius: 20,
    },
    btnText: {
        padding: 10,
        fontSize: 20,
        color: '#ffff',
        fontWeight: '800'
    },
    modalView: {
        flex: 1,
        //width:'100%',
        //backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignSelf: 'center'
      },
      innerViewModal: {
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        // height: 150,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
      },
      buttonNew: {
        width: "95%",
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        //padding: 10,
        marginTop: 10,
        backgroundColor: '#08046c',
        borderRadius: 10,
        borderColor: '#ededed',
        borderWidth: 1,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        
      },
      textInput: {
        width: '90%',
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
        color: 'black',
        backgroundColor: '#ededed',
        padding: 20
      },
})