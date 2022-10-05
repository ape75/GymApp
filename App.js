import React, {useState, useEffect} from 'react';
import { Button, View } from 'react-native';
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
        <Drawer.Screen name="Info" component={InfoScreen} />
        <Drawer.Screen name="Image" component={ImageScreen} />
        <Drawer.Screen name="Calendar" component={CalendarScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Back" />
      <Button onPress={() => navigation.navigate('Info')} title="Info screen" />
      <Button onPress={() => navigation.navigate('Image')} title="Image screen" />
      <Button onPress={() => navigation.navigate('Calendar')} title="Calendar screen" />
      <Button onPress={() => navigation.toggleDrawer()} title="Open/Close" />
    </View>
  );
}

function InfoScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Back" />
      <Button onPress={() => navigation.navigate('Home')} title="Home screen" />
      <Button onPress={() => navigation.navigate('Image')} title="Image screen" />
      <Button onPress={() => navigation.toggleDrawer()} title="Open/Close" />
    </View>
  );
}
function ImageScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Back" />
      <Button onPress={() => navigation.navigate('Home')} title="Home screen" />
      <Button onPress={() => navigation.navigate('Info')} title="Info screen" />
      <Button onPress={() => navigation.toggleDrawer()} title="Open/Close" />
    </View>
  );
}

export default App;