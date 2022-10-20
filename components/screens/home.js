import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, ScrollView, View, Text, ImageBackground} from 'react-native';
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
    setWID(index);
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

  const AppButton = ({onPress, title, backgroundColor}) => (
    <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.appButtonContainer, backgroundColor && {backgroundColor}]}>           
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.imageBackground} resizeMode='cover'>
      <View style={styles.container}>
        <ChooseExTypeModal visibility={modalVisible} workoutType={workoutInputHandler} closeModal={hideChooseExModal}/>
        <AppButton onPress={handleWorkoutAdd} title="Lisää harjoitus" backgroundColor="limegreen"/>
        <ScrollView contentContainerStyle={styles.scrollviewwidthstyle} style={styles.scrollviewstyle}>
          {workoutList.map((workoutForm,index) => (
            <View key={index} style={styles.todaysworkout}>
            <Text>Tämän päivän treeni</Text>
            <TextInput style={styles.textinput} value={workout} onFocus={chooseExModal} placeholder="Harjoitus" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={workoutForm.reps} onChangeText={repsInputHandler} placeholder="Toistot" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={workoutForm.sets} onChangeText={setsInputHandler} placeholder="Setit" />
              <View style={styles.inputstyle}>
                  <AppButton title={"Peruuta "+index} onPress={()=> handleWorkoutRemove(index)}/>
                  <AppButton title="Tallenna" onPress={()=>saveDoneEx()} backgroundColor="limegreen"/>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );

}

const styles = StyleSheet.create({
  imageBackground:{
    flex: 1,
    padding: 3,
  },
  container: {
    alignItems: 'center',
  },
  scrollviewwidthstyle:{
    alignItems:'center',
  },
  scrollviewstyle:{
    width:'90%',
  }, 
  todaysworkout: {
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    width: '90%',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
  },
  textinput: {
    backgroundColor: 'lightblue',
    width: '70%',
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    margin: 3,
  },
  inputstyle: {
    margin: 10,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  appButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 5,
    borderColor: 'ivory',
    borderWidth: 1,
    padding: 5,     
  },
  appButtonText: {
    fontSize: 20,
    color: 'ivory',
    alignSelf: 'center',
  },
});