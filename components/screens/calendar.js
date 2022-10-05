import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatePicker from 'react-native-modern-datepicker';
import {fetchExByDay} from '../../database/db';


export const CalendarScreen=(props)=>{

    const [selectedDate, setSelectedDate] = useState('');
    const [renderList, setRenderList] = useState(false);
    const [exList, setExList]=useState([]);
  
    const renderItem=({item, index})=>{
        return (
            <TouchableOpacity>          
                <Text style={styles.listItemStyle} key={index}>{index+1}. {item.name} / reps {item.reps} / sets {item.sets}</Text>
            </TouchableOpacity>
        );
      }   
      
      const alertEmpty = ()=>{
        Alert.alert(
          ""+selectedDate,//title - put at least this - the rest is up to you
          "No entries found for this day!",//Extra message
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
                    <FlatList
                        data={exList}
                        renderItem={renderItem}       
                    /> 
                </View>
            );
        }             
      }
    
    return (
      <View style={styles.containerStyle}>        
        <DatePicker
            options={{
                backgroundColor: '#f0f0f5',
                textHeaderColor: 'black',
                textDefaultColor: 'black',
                selectedTextColor: '#fff',
                mainColor: '#99004d',
                textSecondaryColor: 'black',
                borderColor: 'rgba(0, 51, 102, 0.1)',
            }}
            onSelectedChange={date => setSelectedDate(date)}          
            mode="calendar"
            style={styles.calendarStyle}
            /> 
        <View style={styles.formStyle}>           
        <Button color="blue" onPress={() => readAllExDone()} title="Fetch" />
        <Button color="crimson" onPress={() => props.navigation.goBack()} title="Back" /> 
        </View>
        <RenderList/>   
    </View>      
    );

    async function readAllExDone(){
        try{
        const dbResult = await fetchExByDay(selectedDate);
        console.log(dbResult);
        if(dbResult.length===0){
            alertEmpty();
            setRenderList(false);
        }
        else{
            setRenderList(true);
        }
        setExList(dbResult);        
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
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e6e6ff',
        paddingBottom: 10,
    },
    listStyle:{
        display: 'flex', 
        flex: 1,  
        width: '90%',
        backgroundColor: '#f0f0f5',
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
    },
    listItemStyle:{
        width:'95%',
        alignSelf: 'center',
        borderWidth:1,
        borderColor:"black",
        borderWidth: 1,
        padding:5,
        backgroundColor: "#00cccc",
        margin: 3,
        borderRadius: 5,
        color: 'ivory',
        fontWeight: 'bold',
    },
    formStyle:{
        display: 'flex',
        width: 150,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'space-around',
    },    
    calendarStyle:{
        borderRadius: 10 ,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10, 
        width: '100%',
        fontSize: 12,
    }
  });
  
