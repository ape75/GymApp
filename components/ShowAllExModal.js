import React, { useEffect, useState } from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, ImageBackground, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import {updateExById, fetchExerciseTypes, removeExById } from '../database/db';

const ShowAllExModal = (props) => {

    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const alertUser = (name, id, index)=>{
        Alert.alert(
          "Seuraava harjoitus poistetaan tietokannasta: "+name ,//title - put at least this - the rest is up to you
          'Oletko varma?',//Extra message
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          // onPress:()=>removeExById(id)} ALEMPI TOIMII TÄLLÄ
          [{text:'Kyllä', style:'destructive', onPress:()=>removeEx(id)},
          //The second button
          {text:'Peruuta', style:'default',}],
          {
            cancelable: true
          }
          );
      }


      async function removeEx(id) {
        try{
            await removeExById(id);
            
            
        }
        catch (err) {
            console.log('Error: '+err);
        }
    }

    const renderItem=()=>{

    
    return (
        <View style={styles.container}>
                    <View style={styles.textStyle}>
                    <Text >Tallennetut Harjoitukset</Text>
                    </View>
                        <ScrollView>
                        <View>
                            
                        {props.exListAll.map((item, index)=>{
                                    return <TouchableOpacity onLongPress={()=>alertUser(item.name, item.id, index)} >
                                        <View style={styles.renderStyle} key={index}>  
                                            <Text style={styles.listStyle}>{index+1}. {item.name} / {item.id}</Text>
                                        </View>
                                        </TouchableOpacity>    
                                })}
                        </View>
                        </ScrollView>
                    
                    <Button style={styles.buttonStyle} title="Palaa Takaisin" onPress={props.closeModal} />
                </View>
    );}

    return(
        
        <Modal visible={props.visibility}>
            <ImageBackground source={require('../assets/images/ExListModal.jpg')} style={styles.imageBackground} resizeMode='cover'>
               
               {renderItem()}
               {/*} <View style={styles.container}>
                    <View style={styles.textStyle}>
                    <Text >Tallennetut Harjoitukset</Text>
                    </View>
                        <ScrollView>
                        <View>
                            
                        {props.exListAll.map((item, index)=>{
                                    return <TouchableOpacity onLongPress={()=>alertUser(item.name, item.id, index)} >
                                        <View style={styles.renderStyle} key={index}>  
                                            <Text style={styles.listStyle}>{index+1}. {item.name} / {item.id}</Text>
                                        </View>
                                        </TouchableOpacity>    
                                })}
                        </View>
                        </ScrollView>
                    
                    <Button style={styles.buttonStyle} title="Palaa Takaisin" onPress={props.closeModal} />
                            </View>*/}
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
        backgroundColor: '#b1a7a6',
        borderWidth: 1,
        borderColor: '#660708',
        borderRadius: 7,
        elevation: 10,
        marginBottom: 8,
        paddingVertical: 8,
        paddingLeft:5,
    }

});
export default ShowAllExModal;