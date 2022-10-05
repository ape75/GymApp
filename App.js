import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, Button, ScrollView, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {init, fetchAllExDone} from './database/db';
import {CalendarScreen} from './components/screens/calendar';

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

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Calendar" component={CalendarScreen} />
        <Drawer.Screen name="Lisää harjoitus" component={UusiHarjoitus} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) { //tässä textinput harjoituksesta alasvetovalikko plus tarvitsevat value={} 
  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate('Lisää harjoitus')} title="Uusi Harjoitus" />
      <Button onPress={() => navigation.navigate('Calendar')} title="Calendar screen" />
      <ScrollView contentContainerStyle={styles.scrollviewwidthstyle} style={styles.scrollviewstyle}>
        <View style={styles.todaysworkout}>
          <Text>Tämän päivän treeni</Text>
          <TextInput style={styles.textinput}  placeholder="Harjoitus" />
          <TextInput style={styles.textinput}  placeholder="Toistot" />
          <TextInput style={styles.textinput}  placeholder="Setit" />
            <View style={styles.inputstyle}>
              <View style={styles.buttonstyle}>
                <Button title="Cancel" />
              </View>
              <View style={styles.buttonstyle}>
                <Button title="Lisää" />
              </View>
            </View>
          </View>
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