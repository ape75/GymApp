import React, {useEffect} from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import {View, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {init, fetchAllExDone} from './database/db';
import {HomeScreen} from './components/screens/home';
import {CalendarScreen} from './components/screens/calendar';
import { NewExercise } from './components/screens/newExercise';
import Icon from 'react-native-vector-icons/Ionicons'

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
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={{            
            title: "Home",
            drawerIcon: ({focused, size}) => (
              <Icon
                 name="md-home"
                 size={size}
                 color={focused ? 'black' : '#b3b3b3'}
              />
            ),
          }}          
        />
        <Drawer.Screen 
          name="Kalenteri" 
          component={CalendarScreen}
          options={{            
            title: "Kalenteri",
            drawerIcon: ({focused, size}) => (
              <Icon
                 name="md-calendar"
                 size={size}
                 color={focused ? 'black' : '#b3b3b3'}
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="Lisää harjoitus" 
          component={NewExercise}
          options={{            
            title: "Lisää harjoitus",
            drawerIcon: ({focused, size}) => (
              <Icon
                 name="md-add-circle"
                 size={size}
                 color={focused ? 'black' : '#b3b3b3'}
              />
            ),
          }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;