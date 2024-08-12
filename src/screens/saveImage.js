// saveImage.js
import { CameraRoll } from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

export const saveImageToGallery = async (uri) => {
  try {
    // Download the image file
    const filePath = `${RNFS.DocumentDirectoryPath}/${new Date().getTime()}.jpg`;
    await RNFS.downloadFile({ fromUrl: uri, toFile: filePath }).promise;

    // Save the file to gallery
    await CameraRoll.save(filePath, { type: 'photo' });
    console.log('Image saved to gallery!');
  } catch (error) {
    console.error('Error saving image:', error);
  }
};
