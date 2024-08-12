import { Dimensions, Image, Modal, ScrollView, StatusBar, StyleSheet, PermissionsAndroid, Alert, Linking, Platform, Text, TextInput, TouchableOpacity, View, NativeModules } from 'react-native'
import React, { useEffect, useState, Component } from 'react'
import { useRoute } from '@react-navigation/native'
import ButtonComponent from '../components/ButtonComponent'
import { MASKING_EDITING_URL, MASKING_STEP, axiosClient } from '../utils/String'
import { Buffer } from 'buffer'
import mime from 'mime'
import { runAxiosAsync } from '../utils/helper'
import LoaderComponent from '../components/LoaderComponent'
import Slider from '@react-native-community/slider'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions'
import RNFS from 'react-native-fs'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import RNFetchBlob from 'rn-fetch-blob'
import BeforeAfterSlider from '../components/BeforeAfterSliderComponent'
import Share from 'react-native-share'

const Masking_EditScreen = ({ navigation }) => {
    const route = useRoute();
    const { outputImagePath, imageData } = route.params;
    const [objectDataToChangeWith, setObjectDataToChangeWith] = useState('')
    const [outputImage, setOutputImage] = useState(null)
    const [loading, setLoading] = useState(false);
    const [apiCalled, setApiCalled] = useState(false)
    const [modalVisibility, setModalVisibility] = useState(false)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [wrongInputData, setWrongInputData] = useState('');
    const [outputBase64, setOutputBase64] = useState('');
    const [opacity, setOpacity] = useState(0.5);

    const shareImage = async()=>{
        const shareOptions ={
            message: "Image after processing",
           // url: outputImage,//to share single file image
            urls:[outputImage]// to share multiple image files
        }
        try{
            const shareResponse =await Share.open(shareOptions)
        }catch(error){
            console.log("sharing error", error)
        }

    }
    const getFileTypeAndName = (uri) => {
        const fileExtension = uri.split('.').pop().toLowerCase();
        let fileType = 'image/jpeg'; // Default to JPEG
        let fileName = `image.${fileExtension}`;

        if (fileExtension === 'png') {
            fileType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            fileType = 'image/jpeg';
        }
        return { fileType, fileName };
    };
    useEffect(() => {
        if (imageData?.assets[0]?.uri) {
            Image.getSize(
                imageData.assets[0].uri,
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
    }, [imageData]);
    closeModal = () => {
        setModalVisibility(false)
    }
    const callMaskEditAPI = async () => {
        setLoading(true)
        setApiCalled(true)
        if (!imageData) {
            setError('No image selected');
            return;
        }
        const { fileType, fileNameInput } = getFileTypeAndName(imageData.assets[0].uri);
        console.log(imageData.assets[0].uri)
        console.log(outputImagePath)
        const { fileTypeoutput, fileNameOutput } = getFileTypeAndName(outputImagePath);
        console.log(fileNameInput)
        console.log(fileNameOutput)
        console.log(mime.getType(imageData.assets[0].uri))
        console.log(mime.getType(outputImagePath))
        const formData = new FormData();
        formData.append('image',
            {
                uri: imageData.assets[0].uri,
                type: mime.getType(imageData.assets[0].uri),
                name: 'image.jpg'
            }
        );
        formData.append('image2',
            {
                uri: `file://${outputImagePath}`,
                type: mime.getType(outputImagePath),
                name: 'image.jpg'
            }
        );
        formData.append('image_prompt', objectDataToChangeWith); // Assuming this is a string value
        console.log(formData)
        const response = await runAxiosAsync(axiosClient.post(MASKING_EDITING_URL, formData, {
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'arraybuffer'
        }))
        console.log("response is",response)
        const base64string = Buffer.from(response, 'binary').toString('base64')
        console.log("base64string is",base64string)
       
        setOutputBase64(base64string)
        const image = `data:image/jpeg;base64,${base64string}`
        // const imagePath = `${RNFS.DownloadDirectoryPath}/${new Date().getTime()}.jpg`;
        // await RNFS.writeFile(imagePath, base64string, 'base64');
        // Alert.alert('image saved')
        //  dispatch(setImageUri(imagePath));

        // // const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
        // const filePath = `${RNFS.DocumentDirectoryPath}/${new Date().getTime()}.jpg`;
        // await RNFS.downloadFile({ fromUrl: imagePath, toFile: filePath }).promise;
        // // Save the file to gallery
        // await CameraRoll.save(filePath, { type: 'photo' });
        //  console.log('Image saved to:', { outputImagePath:imagePath},{inputImagePath:imageData.assets[0].uri});

        setOutputImage(image)
        setLoading(false)
        setModalVisibility(true)
        //navigation.navigate('Masking_EditScreen',{outputImagePath:imagePath, imageData:imageData})
        // .then(response => {
        //   const blob = new Blob([response.data], { type: fileType });
        //   const imgURL = URL.createObjectURL(blob);
        //   setImageURL(imgURL);
        // })
        //   .catch(err => {
        //     setError(err.message);
        //     console.error('Fetch Error:', err);
        //   });

    };

    // const requestStoragePermission = async () => {
    //     console.log(Platform.OS)
    //     if (Platform.OS === 'android') {
    //         try {
    //             const status = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    //             console.log("status is", status)
    //             if (status === RESULTS.GRANTED) {
    //                 return true;
    //             } else if (status === RESULTS.DENIED) {
    //                 const granted = await PermissionsAndroid.request(
    //                     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                     {
    //                         title: 'Storage Permission Required',
    //                         message: 'This app needs access to your storage to download Photos',
    //                     }
    //                 );
    //                 return granted === PermissionsAndroid.RESULTS.GRANTED;
    //             } else if (status === RESULTS.NEVER_ASK_AGAIN) {
    //                 Alert.alert(
    //                     'Permission Required',
    //                     'You have previously denied storage permission. Please enable it from the app settings.',
    //                     [
    //                         {
    //                             text: 'Cancel',
    //                             style: 'cancel',
    //                         },
    //                         {
    //                             text: 'Open Settings',
    //                             onPress: () => Linking.openSettings(),
    //                         },
    //                     ]
    //                 );
    //                 return false;
    //             }
    //         } catch (err) {
    //             console.warn(err);
    //             return false;
    //         }
    //     } else {
    //         const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    //         return result === 'granted';
    //     }
    // };
    // const saveImageToStorage = async (imageUrl) => {

    //     const hasPermission = await requestStoragePermission();
    //     if (!hasPermission) return;

    //     const fileName = imageUrl.split('/').pop();
    //     const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;


    //     try {
    //         await RNFS.downloadFile({
    //             fromUrl: imageUrl,
    //             toFile: destPath,
    //         }).promise;

    //         await CameraRoll.save(destPath, { type: 'photo' });
    //         console.log('Image saved to gallery!');
    //     } catch (error) {
    //         console.error('Failed to save image', error);
    //     }
    // };
    const downloadImage = async () => {
        const imagePath = `${RNFS.DownloadDirectoryPath}/${new Date().getTime()}.jpg`;
        console.log(imagePath)
        await RNFS.writeFile(imagePath, outputBase64, 'base64');
        // CameraRoll.save(imagePath, { type: 'photo' })
        // .then(() => {
        //     Alert.alert('Image Saved to:', imagePath);
        // })
        // .catch((error) => {
        //     console.error('Error saving image to gallery', error);
        //     Alert.alert('Error', 'Failed to save image to gallery');
        // });
        RNFetchBlob.fs.scanFile([{ path: imagePath, mime: 'image/jpeg' }])
            .then(() => {
                Alert.alert('Image Saved to:', imagePath);
            })
            .catch((error) => {
                console.error('Error triggering media scanner', error);
                Alert.alert('Error', 'Failed to trigger media scanner');
            });
    }

    // const getExtention = filename => {
    //     return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined
    // }

    // const checkPermissionS = async () => {
    //     console.log(outputImage)
    //     if (Platform.OS === 'ios') {
    //         downloadImage()
    //     }
    //     else {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                 {
    //                     title: 'Storage Permission Required',
    //                     message: 'App needs access to your storage to download Photos'
    //                 }
    //             )
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 console.log('Storage Permission Granted.')
    //                 downloadImage()
    //             }
    //             else {
    //                 // const granted = await PermissionsAndroid.request(
    //                 //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                 //     {
    //                 //         title: 'Storage Permission Required',
    //                 //         message: 'App needs access to your storage to download Photos'
    //                 //     }
    //                 // )
    //                 alert('Storage Permission Not Granted')
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }

    const validate = () => {
        let isValid = false;
        if (objectDataToChangeWith == '') {
            setWrongInputData("Please Enter object to change")
            isValid = false
        }
        else {
            setWrongInputData('')
            isValid = true
        }
        return isValid;
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.main}>
                <StatusBar
                    barStyle='dark-content'
                    backgroundColor="transparent"
                />
                {/* <TouchableOpacity onPress={() => { navigation.navigate('Home') }}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity> */}
                <View style={[styles.imageView, { width: imageSize.width, height: imageSize.height }]}>
                    <Image
                        source={{ uri: imageData.assets[0].uri }}
                        style={styles.backgroundimage}
                    />
                    <Image
                        source={{ uri: `file://${outputImagePath}` }}
                        style={[styles.overlayimage, { opacity }]}
                    />
                </View>
                <View>
                    <Text style={styles.imageText}>Image Object to replace with</Text>
                    <TextInput style={styles.textInput}
                        placeholderTextColor={'gray'}
                        onChangeText={txt => setObjectDataToChangeWith(txt)}
                        placeholder='Enter image object to change'
                        isValid={wrongInputData == '' ? true : false} />
                </View>
                <View>
                    <Text style={styles.imageText}>Overlay Opacity</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={opacity}
                        onValueChange={setOpacity}
                        minimumTrackTintColor="#4600a3"
                        maximumTrackTintColor="#0f0f0f"
                        thumbTintColor="gray"
                    />
                </View>
                {wrongInputData != "" && <Text style={styles.errorText}>{wrongInputData}</Text>}
                <ButtonComponent name='Apply Replacement' OnPress={() => {
                    if (validate()) {
                        callMaskEditAPI()
                    }
                }} />
                {
                    apiCalled && loading != true &&
                    (
                        <View style={styles.modalView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisibility}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalVisibility(!modalVisibility);
                                }
                                }>
                                <View style={styles.modalView}>
                                    <View style={styles.mainView}>
                                        {
                                            outputImage &&
                                            (
                                                <View style={styles.selectedImageView}>
                                                    <BeforeAfterSlider
                                                        beforeImage={imageData.assets[0].uri}
                                                        afterImage={outputImage}
                                                    />
                                                    {/* <Image style={styles.selectedImage} source={{ uri: outputImage }} /> */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
                                                        <TouchableOpacity style={[styles.btn, { marginRight: 10 }]} onPress={() => downloadImage()}>
                                                            <MaterialIcons name="save-alt" size={30} color={'white'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.btn, { marginLeft: 5, marginRight: 5 }]} onPress={()=>shareImage()}>
                                                            <AntDesign name="sharealt" size={30} color={'white'} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.btn, { marginLeft: 10, marginRight: 5 }]}>
                                                            <MaterialCommunityIcons name="image-edit-outline" size={30} color={'white'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity style={styles.CloseBtn} onPress={() => closeModal()}>
                                                        <Text style={styles.CloseTxt}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )}
                <LoaderComponent visible={loading} />
            </View>
        </ScrollView >
    )
}

export default Masking_EditScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white'
    },
    backText: {
        fontSize: 18,
        fontWeight: "500",
        color: 'black'
    },
    imageView: {
        marginTop: 20,
        alignSelf: 'center',
        position: 'relative',
        backgroundColor: 'blue'
    },
    backgroundimage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'contain'
    },
    overlayimage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        //transform: [{ translateX: -50 }, { translateY: -50 }],
        opacity: 0.5,
        resizeMode: 'contain'
    },
    errorText: {
        fontSize: 14,
        color: "red",
        marginLeft: 15,
        marginTop: 5
    },
    selectedImageView: {
        marginTop: 10,
        width: '90%',
        height: 300,
        // borderRadius: 10,
        // alignSelf: 'center',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        //borderRadius: 10,
        marginTop: 20,
        resizeMode: 'contain'
    },
    imageContainer: {
        padding: 10,
        width: 200,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    imageText: {
        fontSize: 20,
        color: '#08046c',
        fontWeight: '700',
        marginLeft: 10,
        marginTop: 20
    },
    text: {
        alignContent: 'center'
    },
    textInput: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
        color: 'black'
    },
    modalView: {
        flex: 1,
        //backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainView: {
        // margin: 20,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '95%',
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        //padding: 50,
        alignItems: 'center',
        shadowColor: '#08046c',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    title: {
        fontSize: 16,
        color: '#000',
        alignSelf: 'center',
        marginTop: 20
    },
    slider: {
        width: '90%',
        height: 40,
        //transform: [{ scaleY: 1 }],
        marginTop: 10,
        marginLeft: 10
    },
    btn: {
        width: 70,
        height: 70,
        backgroundColor: '#08046c',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'gray',
        //padding: 50,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    CloseBtn: {
        position: 'absolute',
        top: -10,
        right: -5
    },
    CloseTxt: {
        fontSize: 16,
        color: '#08046c',
        fontWeight: '500'
    }
})