import React, { useEffect,useState } from 'react';
import {StyleSheet, Text, View, Modal, ImageBackground, TouchableOpacity, Alert, FlatList} from 'react-native';
import { TextInput, Avatar, Surface} from 'react-native-paper';  
import {fetchAllExById} from '../database/db';
import LinearGradient from 'react-native-linear-gradient';


const ExModal = (props) => {
    const [exName, setExName]=useState();
    const [exId, setExId]=useState();
    const [exDate, setExDate]=useState();
    const [exReps, setExReps]=useState();
    const [exSets, setExSets]=useState();
    const [exList, setExList]=useState([]);    
 
    useEffect(()=>{
        setExId(props.exToUpdate==undefined ? "" : props.exToUpdate.id);
        setExDate(props.exToUpdate==undefined ? "" : props.exToUpdate.date);
        setExName(props.exToUpdate==undefined ? "" : props.exToUpdate.name);
        setExReps(props.exToUpdate==undefined ? "" : props.exToUpdate.reps.toString());
        setExSets(props.exToUpdate==undefined ? "" : props.exToUpdate.sets.toString());
        readEx(props.exToUpdate==undefined ? "" : props.exToUpdate.typeid);
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

    async function readEx(id){
        try{
        const dbResult = await fetchAllExById(id);            
        setExList(dbResult);
        }
        catch(err){
            console.log("Error: "+err);
        }
        finally{
        }
    }  
    
    //function opens an Alert -window which asks a confirmation from the user
    const confirmation = ()=>{
        Alert.alert(
          "Päivitetään harjoituksen tiedot.",//title - put at least this - the rest is up to you
          'Oletko varma?',//Extra message
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          [{text:'Kyllä', style:'destructive', onPress:()=>updateEx()},
          //The second button
          {text:'Peruuta', style:'default',}],
          {
            cancelable: true
          }
          );
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
        size={28} 
        icon={iconName}
        style={{backgroundColor:'transparent', fontWeight:'bold'}} 
    />
    <Text style={[styles.appButtonText, { color:fontColor }]}>
        {title}
    </Text>
    </TouchableOpacity>
    ) 

    const renderItem=({index,item})=>{
        return (          
            <View>
              <Text style={styles.listItem}>
                    {index+1}. {item.date} toistot:{item.reps} setit:{item.sets}
                <Text style={{color: 'gold', fontWeight: '800'}}> = {item.reps*item.sets}</Text>
            </Text>              
            </View>        
        );
      }

    return(
        <Modal visible={props.visibility} animationType="slide"> 
            <ImageBackground source={require('../assets/images/background.jpg')}
                style={styles.imageBackground} resizeMode='cover'>
                <LinearGradient 
                    start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                    colors={['#D3CCE3','#E9E4F0','ivory']}
                    style={styles.container}
                >
                    <Surface style={styles.surface} elevation={5}>
                        <Text style={styles.heading}>{exDate}</Text>
                        <Text style={styles.heading}>{exName}</Text>
                    </Surface>                      
                    <View style={styles.formstyle}>
                        <TextInput
                            left={<TextInput.Icon icon="repeat" />}
                            keyboardType='numeric'
                            mode="outlined" 
                            label="Toistot" 
                            value={exReps} 
                            style={styles.textinput} 
                            onChangeText={repsInputHandler}
                            activeOutlineColor="black"
                            outlineColor='black'
                            selectionColor='black'
                        />    
                        <TextInput
                            left={<TextInput.Icon icon="weight-lifter" />}
                            keyboardType='numeric'
                            mode="outlined"   
                            label="Setit" 
                            value={exSets} 
                            style={styles.textinput} 
                            onChangeText={setsInputHandler}
                            activeOutlineColor="black"
                            outlineColor='black'
                        />                        
                    </View>
                    <View style={styles.buttons}>                      
                        <AppButton 
                            title="päivitä" 
                            onPress={confirmation} 
                            backgroundColor="green" 
                            fontColor="ivory" 
                            iconName="update"
                        />
                        <AppButton 
                            title="peruuta" 
                            onPress={clearInput}
                            backgroundColor="crimson" 
                            fontColor="ivory" 
                            iconName="arrow-left-circle"
                        />
                                       
                    </View>                                                                                  
                </LinearGradient> 
                <LinearGradient 
                    start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                    colors={['#D3CCE3','#E9E4F0','ivory']}
                    style={styles.linearGradient}
                    >                  
                        <Text style={styles.listHeading}>TOP 5</Text>
                        <FlatList         
                            data={exList}
                            renderItem={renderItem}
                        />
                </LinearGradient>          
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
        backgroundColor: "#009688",
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 3,
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
        backgroundColor: '#f6f6f6',
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
    },      
    linearGradient: {       
        flex: 1, 
        marginVertical: 10,   
        alignItems: 'center',      
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: 'black',
        borderWidth:1,
        paddingTop: 10,
    },
    listHeading:{
        color: 'crimson',
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 10,
    },
    listItem:{
        fontSize: 18,
        fontWeight:'bold',
        color: 'ivory',
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginBottom: 3,
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },     
  });

export default ExModal;
