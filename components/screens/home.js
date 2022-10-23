import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Text, ImageBackground, Alert, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RadioButton} from 'react-native-paper';
import ChooseExTypeModal from '../../components/ChooseExTypeModal';
import {addNewDoneEx, fetchExByDay} from '../../database/db';


export const HomeScreen=()=>{

  const [workout, setWorkout]=useState();
  const [workoutID, setWID]=useState();
  const [reps, setReps]=useState();
  const [sets, setSets]=useState();
  const [currentDate, setCurrentDate] = useState('');
  const [exList, setExList]=useState([]);
  const [rating, setRating] = React.useState('');

  const [showAddingBox, setAddingVisible]=useState(false);
  const [modalVisible, setModalVisible]=useState(false);
  const isFocused = useIsFocused();

  /*when page comes to focus, call function to get todays date and todays exercises*/
  useEffect(() => {
    if (isFocused){
      {getToday()};
      {getTodaysEx(currentDate)};
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
      await addNewDoneEx(workoutID, reps, sets, currentDate, rating);
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
      setRating('');
      setAddingVisible(true);
      {getTodaysEx(currentDate)};
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

  /*Start copied from calendar.js 
  Made by Ari with some minor changes by Arsi*/
  async function getTodaysEx(currentDate){
    try{
      const dbResult = await fetchExByDay(currentDate);               
      setExList(dbResult);
    }catch(err){
      console.log(err);
      Alert.alert(
        'Virhe',
        'Päivää hakiessa tapahtui virhe',
        [{text:'OK', style:'destructive'}],
        {cancelable: false},
      );
    };
  };

  const renderItem=({item, index})=>{
    return (                
      <TouchableOpacity style={styles.exListItemRowStyle}>
        <Text style={styles.exListItemStyle} key={index}>{index+1}. {item.name} Toistot:{item.reps} / Setit:{item.sets} / Arviointi:{item.rating}</Text>
      </TouchableOpacity>
    );
  };

  const RenderList=()=>{      
    return(
      <LinearGradient 
          start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
          colors={['#65FDF0','#1D6FA3','#91b6d4']} 
          style={styles.exListStyle}>
        <Text style={styles.exListHeading}>Harjoitukset Tänään</Text>
        <FlatList
          data={exList}
          renderItem={renderItem}
        />
      </LinearGradient>
    );
  };
  /*End copied from calendar.js*/

  /*This clears all form inputs*/
  const clearForm = () => {
    setWorkout('');
    setWID(null);
    setReps('');
    setSets('');
    setRating('');
  };

  /*used by ChooseExTypeModal to set workout info to variables*/
  const workoutInputHandler = (type,id) => {
    setWID(id);
    setWorkout(type);
    setModalVisible(false);
  };

  /*This clears non number characters from reps input*/
  const repsInputHandler = (val) => {
    let numeric = val.replace(/[^0-9]/g, '');
    setReps(numeric);
  };

  /*This clears non number characters from sets input*/
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
        <View style={styles.formStyle}>
          <View style={styles.todaysworkout}>
            <Text>Tämän päivän treeni</Text>
            <TextInput style={styles.textinput} value={workout} onFocus={chooseExModal} placeholder="Harjoitus" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={reps} onChangeText={repsInputHandler} placeholder="Toistot" />
            <TextInput keyboardType='numeric' style={styles.textinput} value={sets} onChangeText={setsInputHandler} placeholder="Setit" />
              
            <View style={styles.radioButtons}>
              <Text style={styles.radioButtons}>Arvioni treenistä:</Text>
            </View>
            <View style={styles.radioButtons}>
              <View>
                <RadioButton
                  value='1'
                  status={rating === 1 ? 'checked' : 'unchecked'}
                  onPress={() => {setRating(1)}}
                  color='gold'
                  uncheckedColor='black'/>
                <Text style={styles.radioButtons}>1</Text>
              </View>
              <View>
                <RadioButton
                  value='2'
                  status={rating === 2 ? 'checked' : 'unchecked'}
                  onPress={() => {setRating(2)}}
                  color='gold'
                  uncheckedColor='black'/>
                <Text style={styles.radioButtons}>2</Text>
              </View>
              <View>
                <RadioButton
                  value='3'
                  status={rating === 3 ? 'checked' : 'unchecked'}
                  onPress={() => {setRating(3)}}
                  color='gold'
                  uncheckedColor='black'/>
                <Text style={styles.radioButtons}>3</Text>
              </View>
              <View>
                <RadioButton
                  value='4'
                  status={rating === 4 ? 'checked' : 'unchecked'}
                  onPress={() => {setRating(4)}}
                  color='gold'
                  uncheckedColor='black'/>
                <Text style={styles.radioButtons}>4</Text>
              </View>
              <View>
                <RadioButton
                  value='5'
                  status={rating === 5 ? 'checked' : 'unchecked'}
                  onPress={() => {setRating(5)}}
                  color='gold'
                  uncheckedColor='black'/>
                <Text style={styles.radioButtons}>5</Text>
              </View>
            </View>
            <View style={styles.radioButtons}>
              <RadioButton
                value='null'
                status={rating === 'null' ? 'checked' : 'unchecked'}
                onPress={() => {setRating('null')}}
                color='gold'
                uncheckedColor='black'/>
              <Text style={styles.radioButtons}>Ei arviota</Text>
            </View>

              <View style={styles.inputstyle}>
                <AppButton title="Peruuta" onPress={clearForm}/>
                <AppButton title="Tallenna" onPress={inputCheck} backgroundColor="limegreen"/>
              </View>
          </View>
        </View>
        <RenderList/>
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
  formStyle:{
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
  radioButtons:{
    flexDirection:'row',
    alignSelf: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 18,
  },
  /*list formatting copied from calendar.js*/
  exListStyle:{
    flex: 1,
    width: '98%',
    alignSelf: 'center',        
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 1,        
    borderRadius: 8,
    borderColor: 'ivory',
    borderWidth: 2,
    elevation: 10,
  },
  exListHeading:{
    alignSelf: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'ivory',
  },
  exListItemRowStyle:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "navy",
    marginVertical: 2,
    marginHorizontal: 3,
    padding: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'ivory',
    alignItems: 'center',
  },
  exListItemStyle:{      
    fontWeight: 'bold',
    fontSize: 14,
    color: 'ivory',
  },
});