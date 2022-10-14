import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground} from 'react-native';
import {fetchExDoneDays, fetchExByDay, updateExById, deleteEx} from '../../database/db';
import ExModal from '../ExModal';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

//set local month- and day -names into Calendar -components configuration
LocaleConfig.locales['fi'] = {
    monthNames: [
      'Tammikuu',
      'Helmikuu',
      'Maaliskuu',
      'Huhtikuu',
      'Toukokuu',
      'Kesäkuu',
      'Heinäkuu',
      'Elokuu',
      'Syyskuu',
      'Lokakuu',
      'Marraskuu',
      'Joulukuu'
    ],
    monthNamesShort: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Tou', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
    dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
    dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
    today: "tänään"
  };
  LocaleConfig.defaultLocale = 'fi';

export const CalendarScreen=()=>{

    const [selectedDate, setSelectedDate] = useState('');
    const [textDate, setTextdDate] = useState('');
    const [visibility, setVisibility]=useState(false);
    const [exList, setExList]=useState([]);
    const [exToUpdate, setExToUpdate]=useState();
    const [updateId, setUpdateId]=useState(-1);
    
    const [days, setDays] = useState(new Object);
    const [oldDay, setOldDay] = useState("");

    const isFocused = useIsFocused();

    let exDaysObject = {}; 

    //these functions are executed every time screen is loaded or screen gets focused again 
    useEffect(() => {
        if (isFocused) {
            readAllExDone();
            setExList([]);
            setSelectedDate("");
        }
      }, [isFocused]);
    
    
    
    //this function defines the logic how dates are marked and selected in the calendar -component when a date is clicked
    const setMarkers=(day)=>{
        setSelectedDate(day.dateString);                 
        let dayInObject = false;                           

        //iterates through days-objects keys 
        Object.entries(days).forEach(([key]) =>{
            //if the the selected date already exists in days-object then set both values to true and also set boolean value to trua
            if(key === day.dateString){             
                days[key] = {
                selected: true,
                marked: true
                };
                dayInObject = true;
            }  
            //if selected date -key is not found, set selected value to false and marked value to true          
            else{
                days[key] = {
                selected: false,
                marked: true
                };
            }
            //if the key equals oldDay-value then the key-value -pair is deleted, because it is not needed anymore
            if(key === oldDay){       
                delete days[key];              
            }                           
        }
        );
        //if the selected date is not found as a key in the object, the selected date is added to the object with desired values 
        if(!dayInObject){          
            days[day.dateString] = { 
                selected: true,
                marked: false
            };
            setOldDay(day.dateString);                       
        }               
    }
  
    //function returns a item to be rendered into Flatlist in the RenderList -component
    const renderItem=({item, index})=>{
        return (
            <TouchableOpacity 
                onPress={()=>updateEx(index)} onLongPress={()=>confirmation(item.name, item.id, index)} >          
                <Text style={styles.listItemStyle} key={index}>{index+1}. {item.name} / toistot {item.reps} / setit {item.sets}</Text>
            </TouchableOpacity>
        );
      }   
      
      //function that implements an Alert -window if the selected date has no entries
      const alertEmpty = ()=>{
        Alert.alert(
          ""+selectedDate,//title - put at least this - the rest is up to you
          "Ei merkintöjä annetulla päivämäärällä.",//Extra message
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          [{text:'OK', style:'destructive'}
          ],
          {
            cancelable: true
          }
          );
      }

    //component which returns a view with a FlatList of items if the exList contains any values (length is not 0)
    //otherwise an empty View gets returned
    const RenderList=()=>{
        if(exList.length != 0 ){
            return(
                <LinearGradient 
                    start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                    colors={['#65FDF0','#1D6FA3','#91b6d4']} 
                    style={styles.listStyle}
                >   
                    <Text style={styles.listHeading}>{textDate}</Text>
                    <FlatList
                        data={exList}
                        renderItem={renderItem}       
                    /> 
                </LinearGradient>
            );            
        } 
        else{
            return(
                <View></View>
            );
        }            
    } 

    //function pops up an Alert-window to confirm the deletion of an exercise
    const confirmation = (name, id, index)=>{
        Alert.alert(
          "Harjoitus nro " +(index+1) +" (" +name+ ")" +" poistetaan!",//title - put at least this - the rest is up to you
          'Oletko varma?',//Extra message
          //There can be several buttons
          //Buttons: button text, style(cancel, default or destructive), and what happens when pressed
          [{text:'Kyllä', style:'destructive', onPress:()=>deleteExFromDb(id)},
          //The second button
          {text:'Peruuta', style:'default',}],
          {
            cancelable: true
          }
          );
      }
    
    //function which sets the Modal visibility attribute to "true" and the modal view is opened
    const openModal=()=>{
        setVisibility(true);
    }

     //function which sets the Modal visibility attribute to "false" and the modal view is closed
    const closeModal=()=>{
        setVisibility(false);
    }
    
    //function which gets it parameters from the modal view and calls updaExById -function if there is something to update
    const updateExToDb=async(id, reps, sets, date)=>{
        if(updateId!=-1){       
          await updateExById(id, reps, sets);
          setUpdateId(-1);
        }
        else{
            console.log("Nothing to update.");
        }    
        setVisibility(false); 
        await readAllExDoneByDay(date);
      }
      
      //function gets the index of the specific item as a parameter from the onPress-attribute of TouchableOpacity in renderItem -function
      //then it sets the desired index- and item -values to state Variables and opens the Modal View
      const updateEx=(index)=>{
        setUpdateId(index);
        setExToUpdate(exList[index]);
        openModal();
      }
      
     //a custom button component made by using a TouchableOpacity-component
    const AppButton = ({ onPress, title, backgroundColor, fontColor, iconName }) => (
        <TouchableOpacity 
            activeOpacity={0.6}
            onPress={onPress} 
            style={[
                styles.appButtonContainer,        
                backgroundColor && { backgroundColor }        
            ]}>           
        <Avatar.Icon 
            size={28} 
            icon={iconName}
            style={{backgroundColor:'transparent', fontWeight:'bold'}} 
        />
        <Text style={[styles.appButtonText, { color:fontColor }]}>
            {title}
        </Text>
        </TouchableOpacity>
        ) 
    
    return (       
        <ImageBackground source={require('../../assets/images/background.jpg')}
            style={styles.imageBackground} resizeMode='cover'>
            <ExModal 
                visibility={visibility} 
                updateEx={updateExToDb} 
                exToUpdate={exToUpdate} 
                closeModal={closeModal}
            />               
             <Calendar
                //set days-object as the markedDates -property      
                markedDates={ 
                    days
                }
                style={{    
                    marginVertical: 10,
                    marginHorizontal: 15,                   
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 10,
                }}
                theme={{                 
                    calendarBackground: '#e6eeff',
                    textSectionTitleColor: '#666699',
                    selectedDayBackgroundColor: '#0066ff',
                    selectedDayTextColor: 'ivory',
                    todayTextColor: 'red',
                    dayTextColor: 'black',
                    textDisabledColor: 'steelblue',
                    dotColor: '#29a329',
                    selectedDotColor: 'ivory',
                    arrowColor: 'blue',
                    monthTextColor: 'black',
                    indicatorColor: 'red',          
                    textDayFontWeight: '400',
                    textMonthFontWeight: '300',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }} 
                // Handler which gets executed on day press.
                onDayPress={day => {setMarkers(day)}}       
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}   
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}    
                // Show week numbers to the left. Default = false
                showWeekNumbers={true}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}    
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}                                
            />    
            <View style={styles.formStyle}>
                <AppButton 
                    title="hae" 
                    onPress={() => readAllExDoneByDay(selectedDate)} 
                    backgroundColor="#0066ff" 
                    fontColor="ivory"
                    iconName="database-arrow-right"
                />
                <AppButton 
                    title="harjoitukset tänään" 
                    onPress={() => readTodaysExDone()} 
                    backgroundColor="#29a329" 
                    fontColor="ivory"
                    iconName="calendar-today"
                />
            {/*     <AppButton 
                    title="takaisin" 
                    onPress={() => props.navigation.goBack()} 
                    backgroundColor="crimson" 
                    fontColor="ivory"
                    iconName="arrow-left-circle"
                />   */}        
            </View>
            <RenderList/> 
        </ImageBackground>         
    );
    
    //function gets all the dates of exercises ever done from the database and adds them to an array
    //after that it adds dates and selected+marked values as objects to an array of objects
    //finally the created object is set as days -state variable
    async function readAllExDone(){
        try{
            const dbResult = await fetchExDoneDays();            
            const exDays = [];   
            dbResult.forEach((item) => {
                exDays.push(item.date);
            });            
            exDays.forEach((day) => {
                exDaysObject[day] = {
                    selected: false,
                    marked: true
                };
            });
            setDays(exDaysObject);         
      }
      catch(err){
        console.log("Error: "+err);
      }
      finally{
      }
      }

    //this function calls the fetchExByDay -function from db.js and sets the return value to the ExList -state variable
    //it also sets the RenderList state variable to "true", so the list is rendered to the screen
    //if the list is empty it calls the alertEmpty -function => RenderList is set to "false" and the list is not rendered
    async function readAllExDoneByDay(date){
        try{
        const dbResult = await fetchExByDay(date);        
        if(dbResult.length===0){
            alertEmpty();
        }        
        setExList(dbResult);
        setTextdDate(date);        
        }
        catch(err){
            console.log("Error: "+err);
        }
        finally{
        }
    }  

    //this function reads the current date and converts it to a string in format (YYYY/MM/DD)
    //then it calls a function to read todays done exercises from the database (if any exist) 
    async function readTodaysExDone(){
        try{        
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth()+1; //getMonth() returns a month as a number between 0-11, thats why 1 is added
            let day = today.getDate();
            if (month < 10){
                month = '0' + month;
            }          
            if (day < 10) {
                day = '0' + day;
            }           
            let result = [year, month, day].join('-');
            readAllExDoneByDay(result);
        }
        catch(err){
            console.log("Error: "+err);
        }
        finally{
        }
    }
    
    //this function calls deleteEx -function from db.js which deletes the item with the specific id from the database
    async function deleteExFromDb(id){   
        try{
          await deleteEx(id);
        }
        catch(err){
          console.log(err);
        }
        finally{     
        }
        await readAllExDone(textDate);
      }
};



  const styles = StyleSheet.create({    
    listStyle:{
        flex: 1,
        width: '93%',
        alignSelf: 'center',        
        marginVertical: 10,
        backgroundColor: '#f0f0f5',
        padding: 10,        
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        elevation: 10,
    },
    listHeading:{
        alignSelf: 'center',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'ivory',
    },
    listItemStyle:{
        width:'95%',
        alignSelf: 'center',        
        padding:3,
        backgroundColor: "crimson",
        margin: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        color: 'ivory',
        fontWeight: 'bold',
    },
    formStyle:{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
    },    
    calendarStyle:{
        borderRadius: 8 ,
        borderColor: 'black',
        borderWidth: 1,
        margin: 10,
        elevation: 10,
    },
    imageBackground:{
        flex:1,
        width:'100%',
        justifyContent: "flex-start",
      },
      appButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: "#009688",
        borderRadius: 20,
        borderColor: 'ivory',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginRight: 10,      
    },
    appButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
  });
  
