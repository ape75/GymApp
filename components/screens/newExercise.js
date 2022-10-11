import { useState } from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, ImageBackground } from 'react-native';
import {fetchExByDay, updateExById, addNewEx} from '../../database/db';

export const NewExercise=()=>{

    const [newEx, setNewEx]= useState();
    const [newExGroup, setNewExGroup]= useState();

    const newExHandler=(enteredText)=>{
        setNewEx(enteredText);
        console.log(newEx);
      }

    const newExGroupHandler=(enteredText)=>{
        setNewExGroup(enteredText);
        console.log(newExGroup);
      }

    const workoutInputHandler=({newEx, newExGroup})=>{
        console.log(newEx);
        console.log(newExGroup);
        addNewEx(newEx, newExGroup);
    }


    return (
        

    <ImageBackground source={require('../../assets/images/salikuva.jpg')} style={styles.imageBackground} resizeMode='cover'>
    <View style={styles.container}>
        <View style={styles.upper}>

        </View>
        <View style={styles.newWindow}>
            <View style>
                <Text>Lisää uusi harjoitus</Text>   
            </View>
            <TextInput style={styles.inputStyle} placeholder="Anna harjoituksen nimi..." 
                onChangeText={newExHandler}/>
                  <TextInput style={styles.inputStyle} placeholder="Anna lihasryhmä..." 
                onChangeText={newExGroupHandler}/>
            <Button style={styles.buttonStyle} color='#a4161a' title='Lisää!' onPress={()=>addNewEx(newEx, newExGroup)} 
               />
            
        </View>
        {/*<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Test</Text>
        <Button onPress={() => navigation.goBack()} title="Back" />
        <Button onPress={() => navigation.navigate('Home')} title="Home screen" />
    </View>*/}
        <View>
            
        </View>
    </View>
    </ImageBackground>  
    
    );
}

const styles = StyleSheet.create({
    container: {
    
      },
    textView: {
        
    },
    newWindow: {
        flex:1,
        flexDirection: 'column',
        backgroundColor: '#b1a7a6',
        borderWidth: 3,
        borderColor: '#660708',
        justifyContent:'center',
        paddingHorizontal:30,
        marginTop:'50%',
        maxHeight:'50%',
        borderRadius: 7,
        elevation: 10,
    },
    inputStyle: {
        backgroundColor: '#d3d3d3',
        borderColor: '#660708',
        borderWidth: 3,
        borderRadius: 7,
        marginBottom:10,
    },
    imageBackground:{
        flex:1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: 'center',
      },
    buttonStyle: {
        
    }
});