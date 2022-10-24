import React, { useEffect,useState } from 'react';
import {StyleSheet, Text, View, Modal, ImageBackground, TouchableOpacity, Alert, FlatList} from 'react-native';
import { TextInput, Avatar, Surface, RadioButton} from 'react-native-paper';  
import {fetchAllExById} from '../database/db';
import LinearGradient from 'react-native-linear-gradient';


const UpdateExModal = (props) => {
    const [exName, setExName]=useState();
    const [exId, setExId]=useState();
    const [exDate, setExDate]=useState();
    const [exReps, setExReps]=useState();
    const [exSets, setExSets]=useState();
    const [exStars, setExStars]=useState();
    const [exList, setExList]=useState([]);
    const [checked, setChecked] = React.useState("");    
 
    useEffect(()=>{
        setExId(props.exToUpdate==undefined ? "" : props.exToUpdate.id);
        setExDate(props.exToUpdate==undefined ? "" : props.exToUpdate.date);
        setExName(props.exToUpdate==undefined ? "" : props.exToUpdate.name);
        setExReps(props.exToUpdate==undefined ? "" : props.exToUpdate.reps.toString());
        setExSets(props.exToUpdate==undefined ? "" : props.exToUpdate.sets.toString());
        setExStars(props.exToUpdate==null ? "" : props.exToUpdate.rating);
        readEx(props.exToUpdate==undefined ? "" : props.exToUpdate.typeid);
      }, [props.exToUpdate]) 
      
      useEffect(()=>{           
        setRadioValue(exStars);
      }, [exStars])

    /* function handles the change in sets -input and removes every character that is not a number */
    const setsInputHandler=(enteredText)=>{
        let numeric = enteredText.replace(/[^0-9]/g, '');
        setExSets(numeric);    
    }

    const repsInputHandler=(enteredText)=>{
        let numeric = enteredText.replace(/[^0-9]/g, '');
        setExReps(numeric);    
    }

   /* function calls an update -function from the calendar.js which is defined in the modal properties */
    const updateEx=()=>{        
            props.updateEx(exId, exReps, exSets, exDate, exStars);             
    }
    
    /* if the update is canceled, reps, sets and rating are set to their initial values and the modal view is closed */
    const cancelUpdate=()=>{ 
        setExReps(props.exToUpdate.reps.toString());
        setExSets(props.exToUpdate.sets.toString());
        setExStars(props.exToUpdate.rating);
        props.closeModal();
    } 

    /* function gets a list of top5 done exercises (reps*sets) in descending order and sets it as a state variable */
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
    
    /* function checks if the input values are empty or zero */
    const checkInput=()=>{
        if(exReps && exSets && exReps != 0 && exSets != 0){
            confirmation();
        }
        else{
            alertEmpty();
        }
    }
    
    /* function opens an Alert -window which asks a confirmation of updating the exercise from the user */
    const confirmation = ()=>{
        Alert.alert(
          "Päivitetään harjoituksen tiedot.",
          'Oletko varma?',
          [{text:'Kyllä', style:'destructive', onPress:()=>updateEx()},
          {text:'Peruuta', style:'default',}],
          {
            cancelable: true
          }
          );
      }

    /* function opens an Alert -window which alerts the user that the given values can not be zero or empty */
    const alertEmpty = ()=>{
        Alert.alert(
          "Annettu arvo ei voi olla 0 tai tyhjä!",
          'Anna uusi arvo',
          [{text:'Ok', style:'destructive'}],
          {
            cancelable: true
          }
          );
    }
    
    /* function sets that radiobutton active what is defined in value-variable  */
    const setRadioValue =(value) =>{       
        if(value===1){
            setChecked('first');
        }
        else if(value===2){
            setChecked('second');
        }
        else if(value===3){
            setChecked('third');
        }
        else if(value===4){
            setChecked('fourth');
        }
        else if(value===5){
            setChecked('fifth');
        }
        else{
            setChecked("null");
        }

    }    

    /* a custom button component made by using a TouchableOpacity-component */
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

    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        MAIN RETURN -STATEMENT STARTS HERE
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */
    return(
        <Modal visible={props.visibility} animationType="slide"> 
            <ImageBackground source={require('../assets/images/background.jpg')}
                style={styles.imageBackground} resizeMode='cover'>
                <LinearGradient 
                   start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                   colors={['#65FDF0','#1D6FA3','#91b6d4']}
                    style={styles.container}
                >
                    <Surface style={styles.surface} elevation={5}>
                    <Text style={styles.heading}>Treenin päivitys</Text>
                        <Text style={styles.heading2}>{exDate}</Text>
                        <Text style={styles.heading2}>{exName}</Text>
                    </Surface>                      
                    <View style={styles.formstyle}>
                        <View style={styles.textinputBackground}>
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
                        </View>
                        <View style={styles.textinputBackground}>   
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
                    </View>
                    <View style={styles.radioButtonBackground}>
                        <View style={styles.radioButtonsHeader}>
                            <Text style={{color: 'ivory', fontSize: 18, fontWeight: 'bold',}}>Arvioni treenistä:</Text>
                        </View>
                        <View style={styles.radioButtons}>                           
                                <RadioButton
                                    value="first"
                                    status={ checked === 'first' ? 'checked' : 'unchecked' }
                                    onPress={() => {
                                            setChecked('first');
                                            setExStars(1);
                                        }
                                    }
                                    color="gold"
                                    uncheckedColor='#f6f6f6'
                                />
                                <RadioButton
                                    value="second"
                                    status={ checked === 'second' ? 'checked' : 'unchecked' }
                                    onPress={() => {
                                            setChecked('second');
                                            setExStars(2);
                                        }
                                    }
                                    color="gold"
                                    uncheckedColor='#f6f6f6'
                                />
                                <RadioButton
                                    value="third"
                                    status={ checked === 'third' ? 'checked' : 'unchecked' }
                                    onPress={() => {
                                            setChecked('third');
                                            setExStars(3);
                                        }
                                    }   
                                    color="gold"
                                    uncheckedColor='#f6f6f6'
                                />
                                <RadioButton
                                    value="fourth"
                                    status={ checked === 'fourth' ? 'checked' : 'unchecked' }
                                    onPress={() => {
                                            setChecked('fourth');
                                            setExStars(4);
                                            }
                                    }
                                    color="gold"
                                    uncheckedColor='#f6f6f6'
                                />
                                <RadioButton
                                    value="fifth"
                                    status={ checked === 'fifth' ? 'checked' : 'unchecked' }
                                    onPress={() => {
                                            setChecked('fifth');
                                            setExStars(5);
                                        }
                                    }
                                    color="gold"
                                    uncheckedColor='#f6f6f6'
                                />
                                <Avatar.Icon size={46} icon="star" color="gold" 
                                style={{backgroundColor: 'transparent', marginLeft: -10,}}/>
                        </View>
                        <Text style={styles.radioButtonNumbers}>1      2      3      4      5</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <RadioButton
                                value="null"
                                status={ checked === 'null' ? 'checked' : 'unchecked' }
                                onPress={() => {
                                        setChecked('null');
                                        setExStars("");
                                    }
                                }
                                color="gold"
                                uncheckedColor='#f6f6f6'
                            />
                            <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold',}}>Ei arviota</Text>
                        </View>
                    </View>
                    <View style={styles.buttons}>                      
                        <AppButton 
                            title="päivitä" 
                            onPress={checkInput} 
                            backgroundColor="#0066ff" 
                            fontColor="ivory" 
                            iconName="update"
                        />
                        <AppButton 
                            title="peruuta" 
                            onPress={cancelUpdate}
                            backgroundColor="crimson" 
                            fontColor="ivory" 
                            iconName="cancel"
                        />             
                    </View>                                                                                  
                </LinearGradient> 
                <LinearGradient 
                    start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                    colors={['#65FDF0','#1D6FA3','#91b6d4']}
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
        marginHorizontal: 10,
        marginVertical: 10,
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
        textTransform: 'uppercase',
        marginBottom: 5,
        backgroundColor: '#edf3f8',
        padding: 5,
        borderRadius: 8,
    },
    heading2:{
        alignSelf: 'center',
        color: 'ivory',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    textinput:{
        backgroundColor: '#f6f6f6',
        width: '100%',
        color: 'ivory',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textinputBackground:{
        paddingTop: 1,
        paddingBottom: 6,
        paddingHorizontal: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        width: '45%',
        backgroundColor: '#edf3f8',
    },
    radioButtonBackground:{
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'steelblue',
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth: 2,
        marginBottom: 20,        
    },
    radioButtonsHeader:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -5,
        marginRight: -10,

    },
    radioButtons:{
        flexDirection:'row',
        alignSelf: 'center',
        alignItems: 'center',
    },
    radioButtonNumbers: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 33,
        marginTop: -10,
    },
    formstyle:{
        width:'95%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    buttons:{    
        width: '70%',
        flexDirection: 'row',
        alignSelf: 'center',
    }, 
    appButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: "#009688",
        borderRadius: 20,
        borderColor: 'ivory',
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginLeft: 20,
     
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
        backgroundColor: 'steelblue',
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth: 2,        
    },      
    linearGradient: {       
        flex: 1, 
        marginBottom: 10,
        marginTop: 5,   
        alignItems: 'center',      
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: 'black',
        borderWidth:1,
        paddingTop: 10,
    },
    listHeading:{
        color: 'ivory',
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
        marginBottom: 5,
        backgroundColor: 'navy',
        borderWidth: 1,
        borderColor: 'ivory',
        borderRadius: 5,
    },     
  });

export default UpdateExModal;
