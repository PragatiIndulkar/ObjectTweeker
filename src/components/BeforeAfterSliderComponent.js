import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, PanResponder, Dimensions, Text, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
const { width } = Dimensions.get('window');
import ImageResizer from 'react-native-image-resizer';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [position, setPosition] = useState(width / 2);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [resizedBeforeImage, setResizedBeforeImage] = useState(null);
    useEffect(() => {
        if (beforeImage) {
            Image.getSize(
                beforeImage,
                (width, height) => {
                    const screenWidth = Dimensions.get('window').width / 2;
                    const scaleFactor = width / screenWidth;
                    const imageHeight = height / scaleFactor;
                    setImageSize({ width: screenWidth, height: imageHeight });
                },
                (error) => {
                    console.error(`Couldn't get the image size: ${error.message}`);
                }
            );
        }
    }, [beforeImage]);
    // useEffect(() => {
       
    //     const resizeBase64Image = async () => {
    //         try {
    //           // Convert base64 string to a temporary file
    //           //const imagePath = `${RNFS.TemporaryDirectoryPath}/temp_image.jpg`;
    //           //await RNFS.writeFile(imagePath, base64Image, 'base64');
      
    //           // Resize the image
    //           console.log("image is bas",beforeImage)
    //           const response = await ImageResizer.createResizedImage(beforeImage, 512, 512, 'JPEG', 100,
    //             0,
    //             undefined,
    //             false,
    //             { mode: 'contain', onlyScaleDown: true }).then(()=>console.log("resps is",response),
    //             setResizedBeforeImage(response.uri));
              
    //           const imagePath = `${RNFS.DownloadDirectoryPath}/${new Date().getTime()}.jpg`;
    //           console.log(imagePath)
    //           await RNFS.writeFile(imagePath, beforeImage, 'base64');
    //           // Clean up temporary file
    //          // await RNFS.unlink(imagePath);
    //         } catch (err) {
    //           console.log(err);
    //         }
    //       };
      
    //       resizeBase64Image();
    // }, [beforeImage]);
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(0, Math.min(width, gestureState.moveX));
                setPosition(newPosition);
            },
            onPanResponderTerminationRequest: () => false,
        })
    ).current;
    
    return (
        <View style={styles.main}>
            <View style={styles.container}>
                {/* Before Image on the left */}
                <View style={{ width: position - 5, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: beforeImage }}
                        style={[styles.image, { marginLeft: 0 }]}
                    />
                </View>

                {/* After Image on the right */}
                <View style={{ width: width - position, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: afterImage }}
                        style={[styles.image, { marginLeft: - position - 5}]}
                    />
                </View>

                {/* Slider Handle */}
                   
                <View
                    style={[styles.slider, { left: position - 15 }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.sliderHandle}>
                        <Text style={styles.Beforetext}>Before</Text>
                        <AntDesign style={styles.arrow} name={'caretleft'} size={15} />
                        <AntDesign style={styles.arrow} name={'caretright'} size={15} />
                       <Text style={styles.Aftertext}>After</Text>
                    </View>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    main: {

    },
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },
    image: {
        width: width - 50,
        height: '100%',
        position: 'absolute',
        top: 20,
    },
    slider: {
        position: 'absolute',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 10,
        backgroundColor: 'white',
        cursor: 'pointer'
    },
    sliderHandle: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    arrow: {
        color: 'black',
    },
    Beforetext:{
        position:'absolute',
        bottom:110,
        right:35,
        textAlign:'center',
        padding:5,
        fontSize:11,
        fontWeight:'600',
        color:'white',
        width:70,
        height:25,
        backgroundColor:'#ffba86',
        borderRadius:20,
    },
    Aftertext:{
        position:'absolute',
        bottom:110,
        left:35,
        textAlign:'center',
        padding:5,
        fontSize:11,
        fontWeight:'600',
        color:'white',
        width:70,
        height:25,
        backgroundColor:'#c33474',
        borderRadius:20,
    }
});

export default BeforeAfterSlider;
