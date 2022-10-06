import React, {useState, useEffect} from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {StyleSheet, TextInput, Button, ScrollView, View, Text, Image } from 'react-native';
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