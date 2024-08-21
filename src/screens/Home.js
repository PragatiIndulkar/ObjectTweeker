import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Image, TextInputComponent, TextInput, StatusBar, Dimensions, ScrollView, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ButtonComponent from '../components/ButtonComponent'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { BASE_URL, ENHANCE_PRMOPT_URL, MASKING_STEP, axiosClient, axiosClientEnhancePrompt } from '../utils/String'
import { Buffer } from 'buffer'
import mime from 'mime'
import { runAxiosAsync } from '../utils/helper'
import LoaderComponent from '../components/LoaderComponent'
import RNFS, { uploadFiles } from 'react-native-fs'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import EditOptionsComponent from '../components/EditOptionsComponent'
import Entypo from 'react-native-vector-icons/Entypo'
import ImageResizer from 'react-native-image-resizer';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const route = useRoute();
  const { isDrawTrue } = route.params
  const [imageData, setImageData] = useState();
  const [error, setError] = useState(null);
  const [outputImage, setOutputImage] = useState();
  const [imageObjectData, setImageObjectData] = useState('');
  const [loading, setLoading] = useState(false)
  const [loaderText,setLoaderText] = useState('Fetching Response...')
  const imageUri = useSelector(state => state.image.imageUri)
  const [wrongInput, setWrongInput] = useState('');
  const [wrongImageSelection, setWrongImageSelection] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Update the TextInput field when currentIndex changes
  //   if (responses.length > 0) {
  //     setImageObjectData(responses[currentIndex]);
  //   }
  // }, [currentIndex]);

  const openModal = () => {
    setModalVisibility(true)
  }
  const closeModal = () => {
    setModalVisibility(false);
  }
  const openCamera = async () => {
    const res = await launchCamera({ mediaType: 'photo' });
    if (!res.didCancel) {
        const rotatedImage = await ImageResizer.createResizedImage(
            res.assets[0].uri,
            res.assets[0].width,
            res.assets[0].height,
            'JPEG',
            100,
            0 // Rotate image by 0 degrees, which automatically corrects orientation
        );
        setImageData({ assets: [{ ...res.assets[0], uri: rotatedImage.uri }] });
    }
    setModalVisibility(false);
}
  const openGallery = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo' })
    if (!res.didCancel) {
      setImageData(res);
      console.log("imageData", res)
    }
    setModalVisibility(false)
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

  const callAPI = async () => {
    setLoading(true)
    setLoaderText("Applying Mask...")
    if (!imageData) {
      setError('No image selected');
      return;
    }
    const { fileType, fileName } = getFileTypeAndName(imageData.assets[0].uri);
    const formData = new FormData();
    // const myHeaders = new Headers()
    // myHeaders.append("Content-type", "multipart/form-data")
    console.log('filename is', fileName)
    formData.append('image',
      {
        uri: imageData.assets[0].uri,
        type: mime.getType(imageData.assets[0].uri),
        name: fileName
      }
    );
    formData.append('image_object', imageObjectData); // Assuming this is a string value
    console.log(formData)
    const res = await runAxiosAsync(axiosClient.post(MASKING_STEP, formData, {
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer'
    }))
    console.log("response is", res)
    if (res != 400) {
      const base64string = Buffer.from(res, 'binary').toString('base64')
      const image = `data:image/jpeg;base64,${base64string}`
      const imagePath = `${RNFS.DocumentDirectoryPath}/${new Date().getTime()}.jpg`;
      await RNFS.writeFile(imagePath, base64string, 'base64');
      setOutputImage(image)
      setLoading(false)
      navigation.navigate('Masking_EditScreen', { outputImagePath: imagePath, imageData: imageData })
    }
    else {
      setLoading(false)
      Alert.alert("The AI is unable to detect the object you want to mask.")
    }
    //  dispatch(setImageUri(imagePath));

    // // const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
    // const filePath = `${RNFS.DocumentDirectoryPath}/${new Date().getTime()}.jpg`;
    // await RNFS.downloadFile({ fromUrl: imagePath, toFile: filePath }).promise;
    // // Save the file to gallery
    // await CameraRoll.save(filePath, { type: 'photo' });
    //  console.log('Image saved to:', { outputImagePath:imagePath},{inputImagePath:imageData.assets[0].uri});

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
  const validateInput = () => {
    let isValid = false;
    if (imageData == null) {
      setWrongImageSelection('* Please Select Image')
      isValid = false
    }
    else {
      setWrongImageSelection('')
      isValid = true
    }
    if (imageObjectData == '') {
      setWrongInput('* Please Enter object name')
      isValid = false
    }
    else {
      setWrongInput('')
      isValid = true
    }
    return isValid
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.main}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor="transparent"
        />
        <Text style={[styles.imageText, { marginBottom: 10 }]}>Select Image</Text>
        <View style={styles.uploadImage}>
          {imageData == null &&
            (
              <View style={styles.UploadImageView}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 200, height: 50 }} onPress={() => openModal()}>
                  <Image style={{ width: 30, height: 30, tintColor: 'gray' }} source={require('../image/upload.png')} />
                  <Text style={{ fontSize: 20, marginLeft: 10, color: 'gray', }}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            )
          }
          {imageData != null &&
            (
              <TouchableWithoutFeedback onPress={() => openModal()}>

                <Image style={styles.selectedImage} source={{ uri: imageData.assets[0].uri }} />
              </TouchableWithoutFeedback>
            )
          }
        </View>
        {/* <View style={styles.innerView}>
        <TouchableOpacity style={styles.button} onPress={() => openCamera()}>
          <Image style={styles.icon} source={require("../image/camera.png")} />
          <Text>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openGallery()}>
          <Image style={styles.icon} source={require("../image/image.png")} />
          <Text>Open Gallery</Text>
        </TouchableOpacity>
      </View> */}
        {wrongImageSelection != "" && <Text style={styles.errorText}>{wrongImageSelection}</Text>}
        {!isDrawTrue && <View>
          <Text style={[styles.imageText, { marginTop: 20 }]}>Specify Object</Text>
          <TextInput
          style={styles.textInput}
            onChangeText={txt =>setImageObjectData(txt)}
            value={imageObjectData}
            placeholder='Enter image name'
            placeholderTextColor={'gray'}
            isValid={wrongInput == '' ? true : false} 
        />
           
          {wrongInput != "" && <Text style={styles.errorText}>{wrongInput}</Text>}
        </View>}
        {isDrawTrue && imageData != null &&
          <EditOptionsComponent />
        }
        <ButtonComponent name='Apply Mask' OnPress={() => {
          if (validateInput()) {
            callAPI()
          }
        }}
        />
        {/* {outputImage &&
        (
          <View style={styles.selectedImageView}>
            <Image style={styles.selectedImage} source={{ uri:outputImage }} />
          </View>)
      } */}
        {modalVisibility && (
          <View style={styles.modalView}>
            <Modal
              animationType='none'
              transparent={true}
              visible={modalVisibility}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisibility(!modalVisibility);
              }
              }
            >
              <View style={styles.modalView}>
                <View style={styles.innerViewModal}>
                  <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignSelf: 'center' }]} onPress={() => openCamera()}>
                    <Image style={styles.icon} source={require("../image/camera.png")} />
                    <Text style={{ marginLeft: 10, color: 'black', color: '#08046c', fontWeight: '500' }}>Open Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignSelf: 'center' }]} onPress={() => openGallery()}>
                    <Image style={styles.icon} source={require("../image/image.png")} />
                    <Text style={{ marginLeft: 10, color: 'black', color: '#08046c', fontWeight: '500' }}>Open Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { flexDirection: 'row', alignSelf: 'center' }]} onPress={() => closeModal()}>
                    <Text style={{ marginLeft: 10, fontSize: 18, color: 'black', color: '#08046c', fontWeight: '500' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </Modal>

          </View>
        )}
        <LoaderComponent visible={loading} loaderText={loaderText}/>
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white'
  },
  imageText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    marginLeft: 20,
    color: '#08046c',
    marginTop: 10
  },
  text: {
    alignContent: 'center'
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginLeft: 15,
    marginTop: 5
  },
  uploadImage: {
    width: '90%',
    height: screenHeight * 0.4,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ededed'
  },
  UploadImageView:
  {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40%'
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20
  },
  icon: {
    height: 30,
    width: 30,
    marginLeft: 10,
    tintColor: '#08046c',
  },
  button: {
    width: "95%",
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    //padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
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
  selectedImageView: {
    width: '90%',
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center',

  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  textInput: {
    width: '90%',
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    color: 'black',
    backgroundColor: '#ededed'
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
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  buttonStyle: {
    width: 170,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10
  },
  scrollView: {
    width: '100%',
    alignSelf: 'center',
  },
})
