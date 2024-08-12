import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';

const saveImageToStorage = async (imageUrl) => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) return;

  const fileName = imageUrl.split('/').pop();
  const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

  RNFS.downloadFile({
    fromUrl: imageUrl,
    toFile: destPath,
  })
    .promise.then(res => {
      CameraRoll.save(destPath, { type: 'photo' })
        .then(() => {
          console.log('Image saved to gallery!');
        })
        .catch(err => {
          console.error('Failed to save image to gallery', err);
        });
    })
    .catch(err => {
      console.error('Failed to download image', err);
    });
};
