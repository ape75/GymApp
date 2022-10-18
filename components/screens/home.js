import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, Image} from 'react-native';
import ChooseExTypeModal from '../../components/ChooseExTypeModal';
import {addNewDoneEx} from '../../database/db';

export const HomeScreen=()=>{

    const [workoutList, setWorkoutList]= useState([{workoutForm:""}]);
    const [workout, setWorkout]=useState('');
    const [workoutID, setWID]=useState('');
    const [reps, setReps]=useState('');
    const [sets, setSets]=useState('');
    const [currentDate, setCurrentDate] = useState('');

    const [modalVisible, setModalVisible]=useState(false);
    const isFocused = useIsFocused();

    /*when page comes to focus, call function to get todays date*/
    useEffect(() => {
      if (isFocused){
        {getToday()};
      }
    }, [isFocused]);
    
    /*gets todays date to be used in adding done exercise*/
    function getToday(){
      let date = new Date();
      let year = new Date().getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0');
      let day = String(date.getDate()).padStart(2, '0');
      date = year + '-' + month + '-' + day;
      setCurrentDate(date);
      console.log(currentDate);
    };

    /*this saves the done exercise to the database*/
    async function saveDoneEx(){
      try{
        await addNewDoneEx(workoutID, reps, sets, currentDate);
      }catch(err){
        console.log(err);
      }
    };
  
    /*this creates a new workout form to the workout list, 
    until I can figure out how to get unique workoutForm.workout value to each form this is useless*/
    const handleWorkoutAdd = () =>{
      setWorkoutList([...workoutList, {workoutForm:""}]);
    };

    /*TODO jostain syystä tämä poistaa aina listan viimeisen formin, korjaa*/
    const handleWorkoutRemove = (index) => {
      setWorkoutList(workoutList=>workoutList.filter((workoutForm, id)=>id!=index));    
    };
  
    /*used by ChooseExTypeModal to set workout info to variables*/
    const workoutInputHandler = (type,index) => {
      setWID(index)
      setWorkout(type);
      setModalVisible(false);
    };
  
    /*TODO letter removal doesn't work*/
    const repsInputHandler = (val) => {
      let numeric = val.replace(/[^0-9]/g, '');
      setReps(numeric);
    };
  
    //TODO letter removal doesn't work
    const setsInputHandler = (val) => {
      let numeric = val.replace(/[^0-9]/g, '');
      setSets(numeric);
    };

    const chooseExModal=()=>{
      setModalVisible(true);
    };

    const hideChooseExModal=()=>{
      setModalVisible(false);
    };

  return (
    <View style={styles.container}>
      <ChooseExTypeModal visibility={modalVisible} workoutType={workoutInputHandler} closeModal={hideChooseExModal}/>

      <Button onPress={handleWorkoutAdd} title="Tämän päivän harjoitus"/>
      <ScrollView contentContainerStyle={styles.scrollviewwidthstyle} style={styles.scrollviewstyle}>
        {workoutList.map((workoutForm,index) => (
          <View key={index} style={styles.todaysworkout}>
          <Text>Tämän päivän treeni</Text>
          <TextInput style={styles.textinput} value={workout} onFocus={chooseExModal} placeholder="Harjoitus" />
          <TextInput keyboardType='numeric' style={styles.textinput} value={workoutForm.reps} onChangeText={repsInputHandler} placeholder="Toistot" />
          <TextInput keyboardType='numeric' style={styles.textinput} value={workoutForm.sets} onChangeText={setsInputHandler} placeholder="Setit" />
            <View style={styles.inputstyle}>
              <View style={styles.buttonstyle}>
                <Button title={"Cancel "+index} onPress={()=> handleWorkoutRemove(index)}/>
              </View>
              <View style={styles.buttonstyle}>
                <Button title="Lisää" onPress={()=>saveDoneEx()}/>
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