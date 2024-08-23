import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useModal } from '../utils/ModalContext';
import { useNavigation } from '@react-navigation/native';

const OptionModalComponent = () => {
    const navigation = useNavigation();
    const { isModalVisible, hideModal } = useModal();
    return (
        <Modal
            visible={isModalVisible}
            transparent
            animationType='fade'
            onRequestClose={hideModal}
        >
            <TouchableWithoutFeedback onPress={hideModal}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity style={styles.modalInner}
                            onPress={
                                () => {
                                    hideModal(),
                                        navigation.navigate('ProfileScreen')
                                }
                            }>
                                <Text style={styles.text}>Profile</Text>
                            </TouchableOpacity >
                            <TouchableOpacity style={styles.modalInner} onPress={
                                () => {
                                    hideModal(),
                                        navigation.navigate('DashboardScreen')
                                }
                            }>
                                <Text style={styles.text}>Dashboard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalInner} onPress={
                                () => {
                                    hideModal(),
                                        navigation.navigate('SettingsScreen')
                                }
                            }>
                                <Text style={styles.text}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 50,
        width: 130,
        height: 140,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        shadowColor: '#08046c',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    modalContent: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalInner: {
        width: '100%',
        height: 45,
        marginLeft: 20,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#08046c',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'left'
    }
});

export default OptionModalComponent;
