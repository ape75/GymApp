import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import {fetchExByDay} from '../../database/db';


export const CalendarScreen=(props)=>{

    const [selectedDate, setSelectedDate] = useState('');
    const [textDate, setTextdDate] = useState('');
    const [renderList, setRenderList] = useState(false);
    const [exList, setExList]=useState([]);
  
    const renderItem=({item, index})=>{
        return (
            <TouchableOpacity>          
                <Text style={styles.listItemStyle} key={index}>{index+1}. {item.name} / toistot {item.reps} / setit {item.sets}</Text>
            </TouchableOpacity>
        );
      }   
      
      const alertEmpty = ()=>{
        Alert.alert(
          ""+selectedDate,//title - put at least this - the rest is up to you
          "Ei merkintöjä annetulla päivämäärällä.",//Extra message
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          [{text:'OK', style:'destructive'}
          ],
          {
            cancelable: true
          }
          );
      }

    const RenderList=()=>{
    if(renderList){
        return(
            <View style={styles.listStyle}>
                <Text style={styles.listHeading}>{textDate}</Text>
                <FlatList
                    data={exList}
                    renderItem={renderItem}       
                /> 
            </View>
        );
    }             
    }    
      
      //a custom button component made by using a TouchableOpacity-component
    const AppButton = ({ onPress, title, backgroundColor, fontColor }) => (
        <TouchableOpacity 
        activeOpacity={0.6}
        onPress={onPress} 
        style={[
            styles.appButtonContainer,        
            backgroundColor && { backgroundColor }        
        ]}>
        <Text style={[styles.appButtonText, { color:fontColor }]}>
            {title}
        </Text>
        </TouchableOpacity>
    ) 
    
    return (
      <View style={styles.containerStyle}> 
        <ImageBackground source={require('../../assets/images/background.jpg')}
            style={styles.imageBackground} resizeMode='cover'>       
            <DatePicker
                options={{
                    backgroundColor: '#f0f0f5',
                    textHeaderColor: 'black',
                    textDefaultColor: 'black',
                    selectedTextColor: '#fff',
                    mainColor: '#001a66',
                    textSecondaryColor: 'black',
                    borderColor: 'rgba(0, 51, 102, 0.2)',
                    textFontSize: 16,
                    textHeaderFontSize: 18,
                }}
                onSelectedChange={date => setSelectedDate(date)}          
                mode="calendar"
                selected={new Date().toISOString().slice(0,10)}// set current date as initial selected date in string format (YYYY-MM-DD)
                style={styles.calendarStyle}
                /> 
            <View style={styles.formStyle}>
                <AppButton title="hae" onPress={() => readAllExDone(selectedDate)} backgroundColor="#001a66" fontColor="ivory"/>
                <AppButton title="tänään" onPress={() => readTodaysExDone()} backgroundColor="darkgreen" fontColor="ivory"/>
                <AppButton title="takaisin" onPress={() => props.navigation.goBack()} backgroundColor="crimson" fontColor="ivory"/>          
            </View>
            <RenderList/> 
        </ImageBackground>   
    </View>      
    );

    async function readAllExDone(date){
        try{
        const dbResult = await fetchExByDay(date);
        console.log(dbResult);
        if(dbResult.length===0){
            alertEmpty();
            setRenderList(false);
        }
        else{
            setRenderList(true);
        }
        setExList(dbResult);
        setTextdDate(date);        
        }
        catch(err){
            console.log("Error: "+err);
        }
        finally{
        }
    }  

    //this function reads the current date and converts it to a string in format (YYYY/MM/DD)
    //then it calls a function to read todays done exercises from the database (if any exist) 
    async function readTodaysExDone(){
        try{        
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth()+1; //getMonth() returns a month as a number between 0-11, thats why 1 is added
            let day = today.getDate();
            if (month < 10){
                month = '0' + month;
            }          
            if (day < 10) {
                day = '0' + day;
            }           
            let result = [year, month, day].join('/');
            console.log(result);
            readAllExDone(result);
        }
        catch(err){
            console.log("Error: "+err);
        }
        finally{
        }
    }   
};

  const styles = StyleSheet.create({
    containerStyle:{       
        flex: 1,       
    },
    listStyle:{
        display: 'flex', 
        flex: 1,  
        width: '95%',
        backgroundColor: '#f0f0f5',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        elevation: 10,
    },
    listHeading:{
        alignSelf: 'center',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
    },
    listItemStyle:{
        width:'95%',
        alignSelf: 'center',        
        padding:5,
        backgroundColor: "#001a66",
        margin: 3,
        borderRadius: 5,
        color: 'ivory',
        fontWeight: 'bold',
    },
    formStyle:{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
    },    
    calendarStyle:{
        borderRadius: 8 ,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10,
        elevation: 10,
    },
    imageBackground:{
        flex:1,
        width:'100%',
        justifyContent: "flex-start",
        alignItems: 'center',
      },
      appButtonContainer: {
        elevation: 2,
        backgroundColor: "#009688",
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth: 1,
        paddingVertical: 8,
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
  });
  
