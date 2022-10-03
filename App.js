import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const App = () => {
  return (
        <View style={styles.container}>
          <Text>Cleaned up app</Text>
          <Test/>
          {PushMsg()}
        </View>
  );
};

const Test=()=>{
  return <Text>Placeholder for</Text>;
}

const PushMsg=()=>{
  return <Text>testing pushing</Text>;
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#ddd'
  }
});

export default App;