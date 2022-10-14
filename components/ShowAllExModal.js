import React, { useEffect, useState } from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, ImageBackground, FlatList, TouchableOpacity, Modal } from 'react-native';
import {updateExById, fetchExerciseTypes } from '../../database/db';

const ShowAllExModal = (props) => {


    return(
        
        <Modal visible={props.visibility}>
            <ImageBackground source={require('../assets/images/ExListModal.jpg')} style={styles.imageBackground} resizeMode='cover'>
                <View style={styles.container}>
                    <View style={styles.textStyle}>
                    <Text >Tallennetut Harjoitukset</Text>
                    </View>
                        <View style={styles.listStyle}>
                                    <FlatList
                                        data={props.exListAll}
                                        renderItem={props.renderItem}       
                                            /> 
                        </View>
                    <Button style={styles.buttonStyle} title="Palaa Takaisin" onPress={props.closeModal} />
                </View>
            </ImageBackground> 
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
    flex:1,
      },
    textView: {
        
    },
    textStyle:{
        color: 'black',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#d3d3d3',
        borderColor: '#660708',
        borderWidth: 1,
        borderRadius: 7,
        elevation: 10,
        marginHorizontal:'5%',
        paddingVertical: 10,
        paddingHorizontal: 1,
        marginBottom:10,
    },
    imageBackground:{
        flex:1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: 'center',
      },
    inputStyle: {
        backgroundColor: '#d3d3d3',
        borderColor: '#660708',
        borderWidth: 3,
        borderRadius: 7,
        marginBottom:10,
    },
 
    buttonStyle: {
        marginBottom: 10,
        borderRadius: 7,
    },
    listStyle: {
      
    }

});
export default ShowAllExModal;