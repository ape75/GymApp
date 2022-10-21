import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Text, ImageBackground, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ChooseExTypeModal from '../../components/ChooseExTypeModal';
import {addNewDoneEx} from '../../database/db';


export const HomeScreen=()=>{

  const [workout, setWorkout]=useState();
  const [workoutID, setWID]=useState();
  const [reps, setReps]=useState();
  const [sets, setSets]=useState();
  const [currentDate, setCurrentDate] = useState('');

  const [showAddingBox, setAddingVisible]=useState(false);
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

  /*called when adding new exercise, checks that all of the required values are given*/
  const inputCheck=()=>{
    if(workoutID && reps && sets){
      {saveDoneEx()};
    } else {
      {alertEmpty()};
    };
  };
  
  /*called if any values are empty*/
  const alertEmpty=()=>{
    Alert.alert(
      'Virhe',
      'Tarkasta että, olet lisännyt harjoituksen tiedot oikein.',
      [{text:'OK', style:'destructive'}],
      {cancelable: false},
    );
  }

  /*this saves the done exercise to the database*/
  async function saveDoneEx(){
    try{
      await addNewDoneEx(workoutID, reps, sets, currentDate);
    }catch(err){
      console.log(err);
      Alert.alert(
        'Virhe',
        'Virhe tietoja tallentaessa',
        [{text:'OK', style:'destructive'}],
        {cancelable: false},
      );
    }finally{
      setWorkout('');
      setWID(null);
      setReps('');
      setSets('');
      setAddingVisible(true);
      setTimeout(()=>{
        setAddingVisible(false);
      },3000);
    }
  };

  /*This is the popup box that will be rendered when a new exercise is added to the database*/
  const RenderAdding=()=>{
    return(
      <LinearGradient
        start={{x: 1, y: 1}} end={{x: 0, y: 0}}
        colors={['#65FDF0','#1D6FA3','#91b6d4']}
        style={styles.alertBoxStyle}> 
        <Text style={{color:'ivory', fontSize:20, alignSelf:'center',}}>Harjoitus lisätty.</Text>               
      </LinearGradient>
    );
  };

  /*TODO jostain syystä tämä poistaa aina listan viimeisen formin, korjaa*/
  const handleWorkoutRemove = () => {
    setWorkout('');
    setWID(null);
    setReps('');
    setSets('');   
  };

  /*used by ChooseExTypeModal to set workout info to variables*/
  const workoutInputHandler = (type,id) => {
    setWID(id);
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
        <ChooseExTypeModal visibility={modalVisible} workoutType={workoutInputHandler} closeModal={hideChooseExModal}/>
        <View style={styles.scrollviewstyle}>
            <View style={styles.todaysworkout}>
            <Text>Tämän päivän treeni</Text>
            <TextInput style={styles.textinput} value={workout} onFocus={chooseExModal} placeholder="Harjoitus" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={reps} onChangeText={repsInputHandler} placeholder="Toistot" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={sets} onChangeText={setsInputHandler} placeholder="Setit" />
              <View style={styles.inputstyle}>
                  <AppButton title="Peruuta" onPress={handleWorkoutRemove}/>
                  <AppButton title="Tallenna" onPress={inputCheck} backgroundColor="limegreen"/>
              </View>
            </View>
        </View>
      {showAddingBox ? <RenderAdding/> : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground:{
    flex: 1,
    padding: 3,
    alignItems: 'center',
  },
  scrollviewstyle:{
    alignItems:'center',
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
  alertBoxStyle:{
    position: 'absolute',
    top: 200,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'ivory',
    padding: 30,
},
});