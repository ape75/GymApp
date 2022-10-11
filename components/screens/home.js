import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, Image} from 'react-native';

export const HomeScreen=(props)=>{

    const [workoutList, setWorkoutList]= useState([{workoutForm:""}]);

    const [workout, setWorkout]=useState('');
    const [reps, setReps]=useState('');
    const [sets, setSets]=useState('');
  
  
    const handleWorkoutAdd = () =>{
      setWorkoutList([...workoutList, {workoutForm:""}])
    }
    //jostain syystä tämä poistaa aina listan viimeisen formin (todo) korjaa
    const handleWorkoutRemove = (index) => {
      setWorkoutList(workoutList=>workoutList.filter((workoutForm, id)=>id!=index));    
    }
  
    const workoutInputHandler = (val) => {
      setWorkout(val);
    };
  
    const repsInputHandler = (val) => {
      setReps(val);
    };
  
    const setsInputHandler = (val) => {
      setSets(val);
    };  
  
    return (
      <View style={styles.container}>
        <Button onPress={handleWorkoutAdd} title="Tämän päivän harjoitus"/>
        <ScrollView contentContainerStyle={styles.scrollviewwidthstyle} style={styles.scrollviewstyle}>
          {workoutList.map((workoutForm,index) => (
            <View key={index} style={styles.todaysworkout}>
            <Text>Tämän päivän treeni</Text>
            <TextInput style={styles.textinput} value={workoutForm.workout} onChange={workoutInputHandler} placeholder="Harjoitus" />
            <TextInput style={styles.textinput} value={workoutForm.reps} onChange={repsInputHandler} placeholder="Toistot" />
            <TextInput style={styles.textinput} value={workoutForm.sets} onChange={setsInputHandler} placeholder="Setit" />
              <View style={styles.inputstyle}>
                <View style={styles.buttonstyle}>
                  <Button title={"Cancel"+index} onPress={()=> handleWorkoutRemove(index)}/>
                </View>
                <View style={styles.buttonstyle}>
                  <Button title="Lisää" />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    scrollviewwidthstyle:{
      alignItems:'center',
      backgroundColor:'blue',
    },
    scrollviewstyle:{
      width:'80%',
      backgroundColor:'yellow',
    }, 
    todaysworkout: {
      alignItems: 'center',
      backgroundColor: 'lightgreen',
      width: '90%',
      borderColor: 'red',
      borderWidth: 2,
      margin: 5,
    },
    textinput: {
      backgroundColor: 'lightblue',
      width: '70%',
      borderColor: 'black',
      borderWidth: 2,
      margin: 3,
    },
    inputstyle: {
      margin: 10,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttonstyle: {
      width: '40%',
    },
  });