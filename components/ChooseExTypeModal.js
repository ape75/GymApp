import React, {useEffect, useState} from 'react';
import {Text, Modal, View, TextInput, Button, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {fetchExerciseTypes} from '../database/db';
import { useIsFocused } from '@react-navigation/native';


const ChooseExTypeModal = (props) => {
    const [type, setType]=useState('');
    const [exerciseTypes, setExList]=useState([]);
    const isFocused = useIsFocused();

    useEffect(()=>{
      if (isFocused){
        readAllEx()
      }
    },[isFocused])

    const clearSelection=()=>{
        setType('');
        props.closeModal();
    }

    async function readAllEx() {
        try{
            const result = await fetchExerciseTypes();
            setExList(result);
        }
        catch (err) {
            console.log('Error: '+err);
        }
    }

    const renderItem=({item, index})=>{
        return (
            <TouchableOpacity onPress={()=>props.workoutType(item.name,index)}>
            <Text key={index}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

  return(
    <Modal visible={props.visibility}>
        <View style={styles.listStyle}>
            <FlatList data={exerciseTypes} renderItem={renderItem} />
            <Button title ="Peruuta" onPress={clearSelection}/>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    listStyle: {
      flex: 1,
      alignItems: 'center',
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

export default ChooseExTypeModal;