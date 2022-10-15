import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList,} from '@react-navigation/drawer';
import {View, Image, StyleSheet} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import {init} from './database/db';
import {HomeScreen} from './components/screens/home';
import {CalendarScreen} from './components/screens/calendar';
import { NewExercise } from './components/screens/newExercise';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const Drawer = createDrawerNavigator();

//here init -function from db.js is called and database is initialized when the program is executed for the first time
init()
.then(()=>{
    console.log('Database creation succeeded!');
}).catch((err)=>{
  console.log('Database IS NOT initialized! '+err);
});

const App=()=>{ 

  //this custom component returns a custom Drawer as content for the navigation drawer
  const CustomDrawer = props => {
    return (
      <View style={{ flex: 1, }}>
        <DrawerContentScrollView style={{backgroundColor: '#b6cee2'}}>
          {/* this is the first item in the custom Drawer */}
          <LinearGradient 
            start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
            colors={['#65FDF0','#1D6FA3','#91b6d4']} 
            style={styles.listStyle}
          >           
            <Image
              source={require('./assets/images/Gymapp_logo.png')}
              style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: 'gold'}}
            />
          </LinearGradient>     
          {/* DrawerItemList adds rest of the items (Drawer.Screens) from the props as Drawer content. Screens are defined in Drawer.Navigator -component */}
        <DrawerItemList {...props} />        
        </DrawerContentScrollView>        
      </View>
    );
  };

  //this custom component defines the header background
  const GradientHeader = () => (
    <View>
      <LinearGradient
         start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
         colors={['#65FDF0','#1D6FA3','#91b6d4']} 
         style={[StyleSheet.absoluteFill,styles.headerStyle]}
      />      
    </View>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={({navigation}) => ({
          headerStyle:{
            backgroundColor: 'steelblue',
            elevation: 4,
            shadowColor: 'black',    
          },
          drawerActiveTintColor: 'ivory',
          drawerActiveBackgroundColor: 'black',
          headerBackground: () => <GradientHeader/>, //here a custom component is defined as header background
          headerLeft: () => 
            <Icon
              name="md-list"
              size={32} 
              onPress={navigation.toggleDrawer}
              color= 'ivory'
              style={{
                marginLeft: 10,
              }} 
            />,
        })}        
        drawerContent={props => <CustomDrawer {...props} />} //here a custom Drawer is defined as Drawer content and all the properties are passed as arguments
      >
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={{            
            title: "Päivän harjoitukset",
            headerTitleStyle: {              
              color: 'ivory',
            },
            headerTintColor: '#FFFFFF',
            headerTitleAlign: 'center', 
            drawerIcon: ({focused, size}) => (  //this defines an icon for the screen in the drawer content
              <Icon
                 name="today-outline"
                 size={size}
                 color={focused ? 'gold' : '#f6f6f6'}
              />
            ),
            headerTitle: () => (    //this defines a custom header title for the navigation screen 
              <Icon.Button
                name="today"
                size={24}
                backgroundColor="transparent"
                color={'ivory'}
              > 
                Päivän harjoitukset
              </Icon.Button>
            ),            
            headerRight: () => (    //here a custom part is defined for the right part of the navigation screen header
              <Image
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5, borderWidth: 1, borderColor: 'gold', }}
                source={require("./assets/images/Gymapp_logo.png")}
              />
            ),      
          }}          
        />
        <Drawer.Screen 
          name="Kalenteri" 
          component={CalendarScreen}
          options={{           
            title: "Kalenteri",
            headerTitleStyle: {              
              color: 'ivory',
              
            },
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF',                      
            drawerIcon: ({focused, size}) => (
              <Icon
                 name="md-calendar-outline"
                 size={size}
                 color={focused ? 'gold' : '#f6f6f6'}
              />
            ),
            headerTitle: () => (
              <Icon.Button
                name="md-calendar-outline"
                size={24}
                backgroundColor="transparent"
                color={'ivory'}
              > 
                Kalenteri
              </Icon.Button>
            ),            
            headerRight: () => (
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5, borderWidth: 1, borderColor: 'gold', }}
                    source={require("./assets/images/Gymapp_logo.png")}
                  />
                ),                      
          }}
        />
        <Drawer.Screen 
          name="Lisää harjoitus" 
          component={NewExercise}
          options={{            
            title: "Lisää harjoitus",
            headerTitleStyle: {              
              color: 'ivory',
            },
            headerTintColor: '#FFFFFF',
            headerTitleAlign: 'center', 
            drawerIcon: ({focused, size}) => (
              <Icon
                 name="md-add-circle-outline"
                 size={size}
                 color={focused ? 'gold' : '#f6f6f6'}
              />
            ),
            headerTitle: () => (
              <Icon.Button
                name="md-add-circle"
                size={24}
                backgroundColor="transparent"
                color={'ivory'}
              > 
                Lisää harjoitus
              </Icon.Button>
            ),            
            headerRight: () => (
              <Image
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5, borderWidth: 1, borderColor: 'gold', }}
                source={require("./assets/images/Gymapp_logo.png")}
              />
            ),  
          }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({    
  listStyle:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      alignSelf: 'center',        
      marginBottom: 5,      
      padding: 5,            
  },
  headerStyle:{    
    height: 56,
},
});

export default App;




          