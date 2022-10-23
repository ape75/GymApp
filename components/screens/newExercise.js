import { useState } from 'react';
import {StyleSheet, TextInput, Button,View, Text, ImageBackground,TouchableOpacity,} from 'react-native';
import {addNewEx, fetchExerciseTypes} from '../../database/db';
import ShowAllExModal from '../ShowAllExModal';



export const NewExercise=()=>{

    const [newEx, setNewEx]= useState();
    const [newExGroup, setNewExGroup]= useState();
    const [visibility, setVisibility]= useState(false);
    const [exListAll, setExListAll]=useState([]);

    const newExHandler=(enteredText)=>{
        setNewEx(enteredText);
        console.log(newEx);
      }

    const newExGroupHandler=(enteredText)=>{
        setNewExGroup(enteredText);
        console.log(newExGroup);
      }


    async function readAllEx() {
        try{
            const dbResult = await fetchExerciseTypes();
            console.log('dbResult sisältö');
            console.log(dbResult);
            setExListAll(dbResult);
            openModal();
        }
        catch (err) {
            console.log('Error: '+err);
        }
    }


     //function which sets the Modal visibility attribute to "true" and the modal view is opened
     const openModal=()=>{
        setVisibility(true);
    }

     //function which sets the Modal visibility attribute to "false" and the modal view is closed
    const closeModal=()=>{
        setVisibility(false);
    }


    //fetchExerciseTypes
    const renderItem=({item, index})=>{

    return (
        <View style={styles.renderStyle}>
            <TouchableOpacity>      
            <Text style={styles.listStyle} key={index}>{index+1}. {item.name} </Text>
            </TouchableOpacity>
         </View>
    );
}


return (

    <ImageBackground source={require('../../assets/images/salikuva.jpg')} style={styles.imageBackground} resizeMode='cover'>
        <View style={styles.container}>
        
                <View style={styles.newWindow}>
                  
                    <TextInput style={styles.inputStyle} placeholder="Anna harjoituksen nimi..." 
                        onChangeText={newExHandler}/>
                        <TextInput style={styles.inputStyle} placeholder="Anna lihasryhmä..." 
                        onChangeText={newExGroupHandler}/>
                    <View style={{marginBottom: 10}}>
                        <Button  color='#a4161a' title='Lisää' onPress={()=>addNewEx(newEx, newExGroup)} 
                        />
                    </View>
                    <View>
                        <Button p='2' color='#a4161a' title="Näytä kaikki" onPress={()=>readAllEx()} />
                    </View>
                    <ShowAllExModal visibility={visibility} renderItem={renderItem} closeModal={closeModal} exListAll={exListAll} readAllEx={readAllEx}/>
                </View>
        </View>
    </ImageBackground>  
    
    );
}

const styles = StyleSheet.create({
    container: {
    
      },
      textHeader: {
        alignItems: 'center',
        marginBottom:10,
    },
    textStyle:{
        color: 'black',
    },
    renderStyle: {
        justifyContent:'center',
        
        borderColor: '#660708',
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
        borderWidth: 2,
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