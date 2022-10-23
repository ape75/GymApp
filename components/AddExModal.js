import React, { useEffect,useState } from 'react';
import {StyleSheet, Text, View, Modal, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import { TextInput, Avatar, RadioButton} from 'react-native-paper';  
import {addNewDoneExInDay ,fetchExerciseTypes} from '../database/db';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';


const AddExModal = (props) => {
    
    const [exDate, setExDate]=useState();
    const [exReps, setExReps]=useState();
    const [exSets, setExSets]=useState();
    const [exTypeId, setExTypeId]=useState();
    const [exStars, setExStars]=useState();
    const [exTypeName, setExTypeName]=useState();
    const [data, setData]=useState([]);
    const [checked, setChecked] = React.useState("");
    
    const [value, setValue] = useState(null);

    useEffect(()=>{        
        setExDate(props.date==undefined ? "" : props.date);
        setExReps("");
        setExSets("");
        setExStars("");
        setChecked("null");
        setExTypeName("");        
        readAllExTypes();       
      }, [props]) 




/* this function handles the change in sets -input and removes every character that is not a number */
const setsInputHandler=(enteredText)=>{
    let numeric = enteredText.replace(/[^0-9]/g, '');
    setExSets(numeric);    
}

const repsInputHandler=(enteredText)=>{
    let numeric = enteredText.replace(/[^0-9]/g, '');
    setExReps(numeric);    
}

const cancelAdd=()=>{ 
    setExDate("");
    setExTypeId("");
    setExReps("");
    setExSets("");
    setExTypeName("");
    setChecked("null");
    props.closeModal();
} 

/* function checks if the input values are empty or zero */
const checkInput=()=>{
    if(exReps && exSets && exTypeName && exReps != 0 && exSets != 0){
        confirmation();
    }
    else{
        alertEmpty();
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

    /* function opens an Alert -window which asks a confirmation of adding an exercise from the user */
    const confirmation = ()=>{
        Alert.alert(
          "Lisätäänkö harjoitus tietokantaan?", "(" +exTypeName +")",         
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          [{text:'Kyllä', style:'destructive', onPress:()=>addExToDb(exTypeId, exReps, exSets, exDate, exStars)},
          //The second button
          {text:'Peruuta', style:'default',}],
          {
            cancelable: true
          }
          );
      }

    /* function opens an Alert -window which alerts the user that the given values can not be zero or empty */
    const alertEmpty = ()=>{
        Alert.alert(
          "Annettu arvo ei voi olla tyhjä tai 0!",
          'Anna uusi arvo',    
          [{text:'Ok', style:'destructive'}],
          {
            cancelable: true
          }
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
                style={styles.headerBackground}
            >
                <Text style={styles.heading}>LISÄÄ HARJOITUS</Text>
                <AntDesign color="ivory" name="checkcircle" size={24} />                   
            </LinearGradient> 
            <LinearGradient 
                start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                colors={['#65FDF0','#1D6FA3','#91b6d4']}
                style={styles.container}
            >                                      
                <View style={styles.formstyle}>
                <View style={styles.type}>
                    <Text style={styles.typeheading}>{exDate}</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemContainerStyle = {styles.itemContainerStyle}
                        iconStyle={styles.iconStyle}
                        itemTextStyle = {styles.itemTextStyle}
                        activeColor = "navy"
                        iconColor = "ivory"
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Valitse harjoitus"
                        searchPlaceholder="Etsi..."
                        value={value}
                        onChange={item => {
                            setExTypeId(item.value);
                            setExTypeName(item.label);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign style={styles.icon} color="ivory" name="Trophy" size={24} />
                        )}
                    />                   
                </View>                
                    <View style={styles.repsandsets}> 
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
                                outlineColor='darkgray'
                                
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
                                outlineColor='darkgray'
                            />
                        </View> 
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
                                <Avatar.Icon size={46} icon="star" color="gold" style={{backgroundColor: 'transparent', marginLeft: -10, }}/>
                        </View>
                        <Text style={styles.radioButtonNumbers}>1     2      3      4      5</Text>
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
                        title="lisää" 
                        onPress={()=>checkInput()} 
                        backgroundColor="#0066ff" 
                        fontColor="ivory" 
                        iconName="database-plus"
                    />
                    <AppButton 
                        title="peruuta" 
                        onPress={cancelAdd}
                        backgroundColor="crimson" 
                        fontColor="ivory" 
                        iconName="cancel"
                    />
                                   
                </View>                                                                                  
            </LinearGradient>                    
        </ImageBackground>           
    </Modal>
);

 /* function calls addDoneExInDay -function from db.js which adds the new exercise with the specific values to the database. 
  After adding is done it calls functions defined in the properties to read days exercises again to refresh the list in the view
  it also refreshes the markers to the calendar */
 async function addExToDb(typeid, exReps, exSets, exDate, exRating){
    console.log(typeid); 
    try{          
        await addNewDoneExInDay(typeid, exReps, exSets, exDate ,exRating);
    }
    catch(err){
      console.log(err);
    }
    finally{     
    }
    props.readExOfDay(exDate, false);
    props.setMarkers(exDate);
    cancelAdd();
  }

  /* function reads all the exercise types from the database and adds the names and id's of returned items to an array 
   This array is used in the drop-down list -component */
  async function readAllExTypes(){
    let exTypesArray = [];
    try{                                     
        const dbResult = await fetchExerciseTypes();
        dbResult.forEach((item) => {
            exTypesArray.push({label: item.name, value: item.id});
        });                           
    }
    catch(err){
        console.log("Error: "+err);           
    }
    finally{
    }
    setData(exTypesArray);   
}  

};
const styles = StyleSheet.create({
    
    imageBackground:{
        paddingTop: 20,
        flex:1,
        width:'100%',
        alignItems: 'center',
    },
    container:{      
        margin:10,       
        borderColor: 'ivory',
        borderWidth: 2,
        borderRadius: 8,
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerBackground: { 
        display: 'flex',    
        marginVertical: 10,   
        alignItems: 'center',      
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth:2,
        paddingTop: 10,
        marginBottom: 30,
    },
    heading:{
        color: 'ivory',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
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
    textinput:{        
        backgroundColor: '#f6f6f6',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    textinputBackground:{
        paddingTop: 1,
        paddingBottom: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        width: '45%',
        backgroundColor: '#edf3f8',
        marginHorizontal: 5,
    },
    formstyle:{       
        alignSelf: 'center',
        marginBottom: 20,       
        paddingLeft: 10,
        paddingRight: 10,
    },
    type:{
        alignItems: 'center',
        marginBottom: 10,
    },
    typeheading:{
        color: 'ivory',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },    
    repsandsets:{
        flexDirection: 'row',
        alignSelf: 'center',
    },
    buttons:{   
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

    dropdown: {
        margin: 16,
        height: 50,
        width: 320,
        borderWidth: 2,
        borderColor: 'ivory',
        borderRadius: 5,
        backgroundColor: 'navy',
      },
      icon: {
        marginRight: 10,
        marginLeft: 5,
        
      },
      placeholderStyle: {
        fontSize: 16,
        color: 'ivory',
        fontWeight: '500',
      },
      selectedTextStyle: {
        fontSize: 18,
        color: 'ivory',
        fontWeight: '500',
      },
      iconStyle: {
        width: 30,
        height: 30,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        backgroundColor: '#c8daea',
        color: 'black',
        margin: 3,
      },
      itemContainerStyle:{
        backgroundColor: 'steelblue',
        marginHorizontal: 2,
        padding: 0,
      },
      itemTextStyle:{
        fontWeight: '400',
        color: 'ivory',
      },
  });

export default AddExModal;