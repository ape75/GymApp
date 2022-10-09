import React, { useEffect,useState } from 'react';
import {StyleSheet, Text, View, Modal, ImageBackground, TouchableOpacity} from 'react-native';
import { TextInput, Avatar, Surface} from 'react-native-paper';  


const ExModal = (props) => {
    const [exName, setExName]=useState();
    const [exId, setExId]=useState();
    const [exDate, setExDate]=useState();
    const [exReps, setExReps]=useState();
    const [exSets, setExSets]=useState();    

    useEffect(()=>{
        setExId(props.exToUpdate==undefined ? "" : props.exToUpdate.id);
        setExDate(props.exToUpdate==undefined ? "" : props.exToUpdate.date);
        setExName(props.exToUpdate==undefined ? "" : props.exToUpdate.name);
        setExReps(props.exToUpdate==undefined ? "" : props.exToUpdate.reps.toString());
        setExSets(props.exToUpdate==undefined ? "" : props.exToUpdate.sets.toString()); 
      }, [props.exToUpdate])     

    const setsInputHandler=(enteredText)=>{
        setExSets(enteredText);    
    }

    const repsInputHandler=(enteredText)=>{
        setExReps(enteredText);    
    }

    const updateEx=()=>{
        props.updateEx(exId, exReps, exSets, exDate);    
    }
    
    const clearInput=()=>{       
        props.closeModal();
    }    

    //a custom button component made by using a TouchableOpacity-component
    const AppButton = ({ onPress, title, backgroundColor, fontColor, iconName }) => (
    <TouchableOpacity 
        activeOpacity={0.6}
        onPress={onPress} 
        style={[
            styles.appButtonContainer,        
            backgroundColor && { backgroundColor }        
        ]}>           
    <Avatar.Icon 
        size={26} 
        icon={iconName}
        style={{marginRight:2, backgroundColor:'transparent', fontWeight:'bold'}} 
    />
    <Text style={[styles.appButtonText, { color:fontColor }]}>
        {title}
    </Text>
    </TouchableOpacity>
    ) 

    return(
        <Modal visible={props.visibility} animationType="slide"> 
            <ImageBackground source={require('../assets/images/background.jpg')}
                style={styles.imageBackground} resizeMode='cover'>
                <View style={styles.container}>
                    <Surface style={styles.surface} elevation={5}>
                        <Text style={styles.heading}>{exDate}</Text>
                        <Text style={styles.heading}>{exName}</Text>
                    </Surface>                      
                    <View style={styles.formstyle}>
                        <TextInput
                            left={<TextInput.Icon icon="repeat" />}
                            mode="outlined" 
                            label="Toistot" 
                            value={exReps} 
                            style={styles.textinput} 
                            onChangeText={repsInputHandler}
                            activeOutlineColor="#24478f"
                        />    
                        <TextInput
                            left={<TextInput.Icon icon="weight-lifter" />}
                            mode="outlined"   
                            label="Setit" 
                            value={exSets} 
                            style={styles.textinput} 
                            onChangeText={setsInputHandler}
                            activeOutlineColor="#24478f"
                        />                        
                    </View>
                    <View style={styles.buttons}>                      
                        <AppButton title="päivitä" onPress={updateEx} backgroundColor="green" fontColor="ivory" iconName="refresh-circle"/>
                        <AppButton title="peruuta" onPress={clearInput} backgroundColor="crimson" fontColor="ivory" iconName="close-box-multiple"/>                     
                    </View>                                       
                </View>  
            </ImageBackground>           
        </Modal>
    );
};

const styles = StyleSheet.create({
    
    imageBackground:{
        flex:1,
        width:'100%',
        justifyContent: "center",
        alignItems: 'center',
    },
    container:{
        display: 'flex',
        margin:10,
        backgroundColor: '#f0f0f5',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingTop: 20,
        paddingBottom: 20,
    },
    heading:{
        alignSelf: 'center',
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textinput:{
      backgroundColor: '#f6f6f6',
      width: '45%',
      color: 'ivory',
      fontSize: 20,
      fontWeight: 'bold',
    },
    formstyle:{
      width:'95%',
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-around',
      marginBottom: 20,
      marginTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    buttons:{    
        width: '70%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
    }, 
    appButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: "#009688",
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10,      
    },
      appButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      surface: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0eb',
        borderRadius: 8,
        borderColor: 'gray',
        borderWidth:1
      }, 
  });

export default ExModal;
