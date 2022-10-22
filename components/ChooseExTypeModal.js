import React, {useEffect, useState} from 'react';
import {Text, Modal, View, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {fetchExerciseTypes} from '../database/db';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const ChooseExTypeModal = (props) => {
  const [type]=useState('');
  const [exerciseTypes, setExList]=useState([]);
  const isFocused = useIsFocused();

  useEffect(()=>{
    if (isFocused){
      readAllEx();
    }
  },[isFocused]);

  /**This closes modal and clears homescreen form exercise selection*/
  const clearSelection=()=>{
      props.workoutType(type,null);
      props.closeModal();
  };

  /**This reads all exercises from the database*/
  async function readAllEx() {
      try{
          const result = await fetchExerciseTypes();
          setExList(result);
      }
      catch (err) {
          console.log('Error: '+err);
      }
  };

  const AppButton = ({onPress, title, backgroundColor}) => (
    <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.appButtonContainer, backgroundColor && {backgroundColor}]}>           
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  /**This maps exercises into list items*/
  const renderItem=({item, id})=>{
      return (
          <TouchableOpacity onPress={()=>props.workoutType(item.name,item.id)} style={styles.itemStyle} activeOpacity={0.8}>
          <Text key={item.id} style={styles.exStyle}>{item.name}</Text>
          </TouchableOpacity>
      );
  };

  return(
    <Modal visible={props.visibility} animationType="slide">
      <LinearGradient 
        start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
        colors={['#65FDF0','#1D6FA3','#91b6d4']}
        style={styles.pageStyle}>
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>Valitse harjoitus</Text>
            <FlatList data={exerciseTypes} renderItem={renderItem} style={styles.listStyle}/>
            <AppButton title ="Peruuta" onPress={clearSelection}/>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pageStyle: {
    flex: 1,
    alignItems: 'center',
    padding: 3,
  },
  containerStyle:{
    alignItems: 'center',
  },
  listStyle: {
    flex: 1,
  },
  itemStyle: {
    backgroundColor: '#f6f6f6',
    borderColor: 'ivory',
    borderWidth: 1,
    borderRadius: 5,
    margin: 3,
    padding: 2,
  },
  exStyle: {
    color: 'dimgrey',
    fontSize: 20,
    alignSelf:'center',
  },
  textStyle: {
    fontSize: 20,
    color: 'ivory',
  },
  appButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
    padding: 5,
  },
  appButtonText: {
    fontSize: 20,
    color: 'ivory',
    alignSelf: 'center',
  },
});

export default ChooseExTypeModal;