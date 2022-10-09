import React, {useState, useEffect} from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {init, fetchAllExDone} from './database/db';
import {CalendarScreen} from './components/screens/calendar';
import { NewExercise } from './components/screens/newExercise';

const Drawer = createDrawerNavigator();

init()
.then(()=>{
    console.log('Database creation succeeded!');
}).catch((err)=>{
  console.log('Database IS NOT initialized! '+err);
});

const App=()=>{

  

  useEffect(()=>{
    readAllExDone();   
  }, [])

  async function readAllExDone(){
    try{
    const dbResult = await fetchAllExDone(); 
    console.log(dbResult); 
  }
  catch(err){
    console.log("Error: "+err);
  }
  finally{
  }
  }

  //this function returns a custom Drawer
  const CustomDrawer = props => {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          {/* this is the first item in the custom Drawer */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding :5,
              backgroundColor: '#f0f0f5',
              marginBottom: 10,
            }}>           
            <Image
              source={require('./assets/images/Gymapp_logo.png')}
              style={{ width: 120, height: 120, borderRadius: 60,}}
            />
          </View>
          {/* DrawerItemList adds rest of the items (Drawer.Screens) from the props as Drawer content. Screens are defined in Drawer.Navigator -component */}
          <DrawerItemList {...props} /> 
        </DrawerContentScrollView>        
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle:{
            backgroundColor:'#e6f2ff',
            elevation: 10,
            shadowColor: 'black',
          }
        }}         
        drawerContent={props => <CustomDrawer {...props} />} //here a custom Drawer is defined as Drawer content and all the properties are passed as arguments
      >
        <Drawer.Screen name="Home" component={HomeScreen}/>
        <Drawer.Screen name="Kalenteri" component={CalendarScreen} />
        <Drawer.Screen name="Lisää harjoitus" component={NewExercise} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
//tämän koko homman voisi siirtää omaan tiedostoonsa
function HomeScreen({ navigation }) {
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
      <Button onPress={() => navigation.navigate('Lisää harjoitus')} title="Uusi Harjoitus" />
      <Button onPress={() => navigation.navigate('Kalenteri')} title="Kalenteri" />
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
                <Button title="Cancel" onPress={()=> handleWorkoutRemove(index)}/>
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

//placeholder varsinaiselle components/harjoituksen lisäys sivulle
function UusiHarjoitus({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Back" />
      <Button onPress={() => navigation.navigate('Home')} title="Home screen" />
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

export default App;