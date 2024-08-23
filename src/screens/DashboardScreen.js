import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pinchable from 'react-native-pinchable'
const DashboardScreen = () => {
  const [imagePaths, setImagePaths] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
      // Retrieve saved image paths from local storage
      const loadImagePaths = async () => {
          try {
              const paths = await AsyncStorage.getItem('downloadedImages');
              if (paths !== null) {
                  setImagePaths(JSON.parse(paths));
              }
          } catch (error) {
              console.error('Error loading image paths', error);
          }
      };
      loadImagePaths();
  }, []);

  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalVisible(true);
};

const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
};

const renderImage = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => openImageModal(item)}>
        <Image source={{ uri: `file://${item}` }} style={styles.image} />
    </TouchableOpacity>
);

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push(null);
        numberOfElementsLastRow++;
    }

    return data;
};

return (
    <View style={styles.container}>
        <SafeAreaView>
        <FlatList
            data={formatData(imagePaths, 2)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
                if (!item) {
                    return <View style={[styles.imageContainer, styles.invisibleItem]} />;
                }
                return renderImage({ item });
            }}
            numColumns={2}
            ListEmptyComponent={<Text>No images found</Text>}
        />

        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeImageModal}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.modalBackground} onPress={closeImageModal}>
                    {selectedImage && (
                      <Pinchable>
                        <Image
                            source={{ uri: `file://${selectedImage}` }}
                            style={styles.modalImage}
                        />
                        </Pinchable>
                    )}
                </TouchableOpacity>
            </View>
        </Modal>
    </SafeAreaView>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
},
imageContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1, // Square images
},
image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
},
invisibleItem: {
    backgroundColor: 'transparent',
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
},
modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
modalImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    resizeMode: 'contain',
},
});

export default DashboardScreen