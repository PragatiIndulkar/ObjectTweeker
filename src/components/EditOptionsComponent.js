import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, ScrollView, PanResponder, Dimensions } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Svg, { Path } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { Buffer } from 'buffer'
import { useRoute } from '@react-navigation/native'
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const EditOptionsComponent = ({ navigation }) => {
  const route = useRoute();
  const [isModalVisible, setModalVisible] = useState(true);
  const viewShotRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData,setImageData] =useState(null)
  const [outputImageData,setOutputImageData] =useState(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [opacity, setOpacity] = useState(0.5);
  const [drawClick, setDrawClick] = useState(false)
  const [currentPath, setCurrentPath] = useState('');
  const [brushSize, setBrushSize] = useState(10);
  const [paths, setPaths] = useState([]);
  const { width, height } = Dimensions.get('window');
  const [saveImage,setSaveImage] = useState(false)
  const [undoStack, setUndoStack] = useState([]);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const panZoomResponder = 
    PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
            if (gestureState.numberActiveTouches === 2) {
                const distance = Math.sqrt(
                    Math.pow(gestureState.moveX - gestureState.x0, 2) + Math.pow(gestureState.moveY - gestureState.y0, 2)
                );
                const scaleValue = distance / 200; // Adjust the denominator for more/less sensitivity
                Animated.timing(scale, {
                    toValue: scaleValue,
                    duration: 0,
                    useNativeDriver: true,
                }).start();
            } else if (gestureState.numberActiveTouches === 1) {
                Animated.event([null, { dx: translate.x, dy: translate.y }], { useNativeDriver: false })(e, gestureState);
            }
        },
        onPanResponderRelease: () => {
            // Handle zoom release (if needed)
        },
    });

  const panResponder =
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const initialMove = `M${locationX} ${locationY}`;
        setCurrentPath(initialMove);
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        const nextLine = `L${locationX} ${locationY}`;
        setCurrentPath((prevPath) => `${prevPath} ${nextLine}`);
       // console.log('currentPath paths', currentPath)
      },
      onPanResponderRelease: () => {
        if (currentPath) {
          //console.log('prev paths', paths)
          setPaths((prevPaths) => [
            ...prevPaths,
            { d: currentPath, strokeWidth: brushSize }
          ]);
         // setPaths((prevPaths) => [...prevPaths, currentPath]); // Save the current path
          setUndoStack([]);
        }
        setCurrentPath(''); // Reset current path for new drawing
      },
    })
    ;
    const undoLastPath = () => {
      if (paths.length > 0) {
        const lastPath = paths[paths.length - 1];
        setUndoStack((prevUndoStack) => [...prevUndoStack, lastPath]);
        setPaths((prevPaths) => prevPaths.slice(0, -1)); // Remove the last path
      }
    };
  
    const redoLastPath = () => {
      if (undoStack.length > 0) {
        const lastUndo = undoStack[undoStack.length - 1];
        setPaths((prevPaths) => [...prevPaths, lastUndo]);
        setUndoStack((prevUndoStack) => prevUndoStack.slice(0, -1)); // Remove the last undo
      }
    };
  useEffect(() => {
    if (selectedImage) {
      Image.getSize(
        selectedImage,
        (width, height) => {
          const screenWidth = Dimensions.get('window').width / 2;
          const scaleFactor = width / screenWidth;
          const imageHeight = height / scaleFactor;
          console.log("image width height is in edit",screenWidth,imageHeight )
          setImageSize({ width: screenWidth, height: imageHeight });
        },
        (error) => {
          console.error(`Couldn't get the image size: ${error.message}`);
        }
      );
    }
  }, [selectedImage]);
  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera error: ', response.error);
      } else {
        setSelectedImage(response.assets[0].uri);
        setImageData(response);
        setModalVisible(false);
      }
    });
  };

  const openImageLibrary = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        setSelectedImage(response.assets[0].uri);
        setImageData(response);
        setModalVisible(false);
      }
    });
  };

  const saveDrawing = async () => {
    setSaveImage(true)
    try {
      const timestamp = new Date().getTime();
      const fileName = `mask_${timestamp}.jpg`;
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const uri = await viewShotRef.current.capture();
      await RNFS.moveFile(uri, path);
      // const base64string = await viewShotRef.current.capture();
      // const timestamp = new Date().getTime();
      // const fileName = `${timestamp}.jpg`;
      // const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      // //await RNFS.moveFile(uri, path);
      // //const base64string = Buffer.from(uri, 'binary').toString('base64')
      // const image = `data:image/jpeg;base64,${base64string}`
      // console.log(image)
      // await RNFS.writeFile(path, base64string, 'base64');
     //setOutputImageData(image)
     navigation.navigate('Masking_EditScreen', { outputImagePath: path, imageData: imageData })
      //console.log("uri is ", base64string)
      //console.log("selcted image",selectedImage)
      //console.log('Image saved to:', path);
      //alert('Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving the drawing:', error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.fullScreenContainer}>
          <View style={styles.topView}>
            <TouchableOpacity onPress={() => navigation.navigate('OptionSelectionScreen')}>
              <AntDesign name={'close'} size={30} color={'white'} style={{ marginTop: 10, marginLeft: 10 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>saveDrawing()}>
              <Feather name={'check'} size={30} color={'white'} style={{ marginTop: 10, marginRight: 10 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.middleView}  {...panResponder.panHandlers}>
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
              <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.overlayContainer}>
            <View style={styles.overlayContainer}>
              <Image source={{uri:selectedImage}} style={{ width: '100%', height: '100%' , tintColor:'black',opacity : saveImage? 1 : opacity }} resizeMode="contain" />
              <Svg height={height} width={width} style={styles.drawingSvg} >
                {paths.map((path, index) => (
                  <Path key={index} d={path.d} stroke="white" strokeWidth={path.strokeWidth} fill="none" strokeLinecap="round"
                  strokeLinejoin="round" />
                ))}
                {currentPath ? (
                  <Path d={currentPath} stroke="white" strokeWidth={brushSize} fill="none" strokeLinecap="round"
                  strokeLinejoin="round" />
                ) : null}
              </Svg>
            </View>
            </ViewShot>
          </View>
          <View style={styles.bottomView}>
            <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, color: "white", marginLeft: 20 }}>Opacity</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={opacity}
                onValueChange={setOpacity}
                minimumTrackTintColor="white"
                maximumTrackTintColor="white"
                thumbTintColor="white" />
            </View>
            {drawClick && (
              <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, color: "white", marginLeft: 20 }}>Brush Size</Text>
                <Slider
                  style={[styles.slider, { width: '80%' }]}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={brushSize}
                  onValueChange={setBrushSize}
                  minimumTrackTintColor="white"
                  maximumTrackTintColor="white"
                  thumbTintColor="white" />
              </View>
            )}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ marginLeft: 20 }} onPress={()=>undoLastPath()}>
                <MaterialCommunityIcons name={'undo'} size={30} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons name={'draw'} size={30} color={'white'} onPress={() => { drawClick ? setDrawClick(false) : setDrawClick(true) }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginRight: 20 }} onPress={()=>redoLastPath()}>
                <MaterialCommunityIcons name={'redo'} size={30} color={'white'} />
              </TouchableOpacity>
            </View>

          </View>
        </View>

      ) : (
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={styles.closeBtn} onPress={
              () => { setModalVisible(false), navigation.navigate("OptionSelectionScreen") }}>
              <AntDesign name={'closecircleo'} size={25} color={'#08046c'} />
            </TouchableOpacity>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.cameraOption} onPress={openCamera}>
                <Text style={styles.optionText}>Open Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageOption} onPress={openImageLibrary}>
                <Text style={styles.optionText}>Select Image from Gallery</Text>
              </TouchableOpacity>
              {/* Render recent images and albums below */}

            </View>
          </View>

        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topView: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between'
    
  },
  middleView: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawingSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomView: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  slider: {
    width: '90%',
    height: 40,
    marginTop: 5,
  },
  modalContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 150,
    width: '80%',
    shadowColor: '#08046c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  closeBtn: {
    position: 'relative',
    top: -10,
    left: 140

  },
  cameraOption: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 0.8,
    borderBottomColor: 'gray',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#08046c',
  },
  imageGallery: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageOption: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject, // This makes the overlay fill the entire screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparencyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with 50% transparency
  },
});

export default EditOptionsComponent;
