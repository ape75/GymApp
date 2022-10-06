import React, {useState, useEffect} from 'react';
import { Button, View, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
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
        drawerContent={props => <CustomDrawer {...props} />} //here a custom Drawer is defined as Drawer content and all the properties are passed as arguments
      >
        <Drawer.Screen name="Home" component={HomeScreen}/>
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