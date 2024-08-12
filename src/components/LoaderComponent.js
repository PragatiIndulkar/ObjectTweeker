import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const LoaderComponent = ({ visible }) => {
    return (
        // <View style={[StyleSheet.absoluteFillObject, styles.mainView]}>
        //     <LottieView style={styles.lottieV} source={require('../image/loading.json')} autoPlay loop resizeMode='cover'/>
        // </View>
        <Modal transparent visible={visible}>
            <View style={styles.mainView}>
                <Text style={styles.text}>Fetching Response...</Text>
                <ActivityIndicator size='large' style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} color={"#4600a3"} />
                {/* <View style={styles.loaderView}>
                </View> */}
            </View>
        </Modal>
    )
}

export default LoaderComponent

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        //  zIndex: 1
    },
    lottieV: {
        flex: 1,
        width: 200,
        height: 200
    },
    loaderView: {
        width: 80,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#4600a3',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20
    }
})