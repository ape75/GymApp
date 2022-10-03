import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const App=()=>{
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Info" component={InfoScreen} />
        <Drawer.Screen name="Image" component={ImageScreen} />
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