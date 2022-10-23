import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import {fetchExDoneDays, fetchExByDay, updateExById, deleteEx} from '../../database/db';
import UpdateExModal from '../UpdateExModal';
import AddExModal from '../AddExModal';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {SkypeIndicator} from 'react-native-indicators';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/* set local (Finnish in this case) month- and day -names into Calendar -components configuration */
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
    monthNamesShort: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
    dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
    dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
    today: "tänään"
  };
LocaleConfig.defaultLocale = 'fi';

export const CalendarScreen=()=>{

    const [selectedDate, setSelectedDate] = useState('');
    const [textDate, setTextdDate] = useState('');
    const [visibility, setVisibility]=useState(false);
    const [visibility2, setVisibility2]=useState(false);
    const [exList, setExList]=useState([]);
    const [exToUpdate, setExToUpdate]=useState();
    const [updateId, setUpdateId]=useState(-1);   
    
    const [days, setDays] = useState(new Object);   

    const [isFetching, setIsFetching] = useState(false);      
    const [renderEmpty, setRenderEmpty] = useState(false);

    const isFocused = useIsFocused();
    const today = (getToday());        

    let exDaysObject = {};    

    /* these are executed every time screen is loaded or screen gets focused again  */
    useEffect(() => {
        if (isFocused) {         
            setExList([]);           
            setRenderEmpty(false);
            setSelectedDate(today);
            setMarkers(today); 
            readAllExDoneByDay(today, false);   
        }
      }, [isFocused]);
      
    /* function sets the selected/marked values to the calendar data-object. First it reads the marked dates from the database
    and after that it sets the correct values to the selected date given as an input parameter
    finally it sets the day and exercise days -object as a value to state variables  */
    const setMarkers=async(date) =>{
        try{            
            setExList([]);
            setRenderEmpty(false);
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
            if(date in exDaysObject){               
                exDaysObject[date] = {
                    selected: true,
                    marked: true
                }
            } 
            else{
                exDaysObject[date] = {
                    selected: true,
                    marked: false
                }
            }
            setSelectedDate(date);           
            setDays(exDaysObject);                    
      }
      catch(err){
        console.log("Error: "+err);
      }
      finally{
      }
      
      }    
        /* function returns a item to be rendered into Flatlist in the RenderList -component */
        const renderItem=({item, index})=>{
            return (                
                <TouchableOpacity 
                    onPress={()=>updateEx(index)} 
                    onLongPress={()=>confirmation(item.name, item.id, index)} 
                    style={styles.itemRow} 
                >          
                        <Text style={styles.listItemStyle} key={index}>{index+1}. {item.name} S:{item.sets} / T:{item.reps}</Text>
                        <RatingStars count={item.rating} size={24}/>
                </TouchableOpacity>               
            );
        }      
    
       /*  component which returns a view with a FlatList of items if the exList contains any values (length is not 0)
        if the exList is empty and a the value or renderEmpty parameter equals true , function returns a notification of no markings  */
        const RenderList=()=>{
            if(exList.length != 0){        
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
            else if(exList.length===0 && renderEmpty) {
                return(
                    <LinearGradient 
                        start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                        colors={['#65FDF0','#1D6FA3','#91b6d4']} 
                        style={styles.empty}
                    >
                        <Text style={styles.listHeading}>{textDate}</Text>
                        <Text style={styles.listHeading}>Ei merkintöjä.</Text>
                    </LinearGradient>   
                );
            }      
    } 
    
    /* this component returns text element and a spinning indicator to the screen */
    const RenderFetching=()=>{
        return(                        
            <LinearGradient 
                    start={{x: 1, y: 1}} end={{x: 0, y: 0}} 
                    colors={['#65FDF0','#1D6FA3','#91b6d4']} 
                    style={styles.spinner}
            > 
                <Text style={{color:'ivory', fontSize:24, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 10, }}>haetaan</Text>                
                <SkypeIndicator color='ivory' size={40} count ={5} />                
            </LinearGradient>                      
        );
    }

    /* this function implements an Alert-window to confirm the deletion of an exercise */
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
    
    /* function which sets the EditModal visibility attribute to "true" and the modal view is opened */
    const openEditModal=()=>{
        setVisibility(true);
    }

    /* function which sets the EditModal visibility attribute to "false" and the modal view is closed */
    const closeEditModal=()=>{
        setVisibility(false);
    }

     /* function which sets the AddModal visibility attribute to "true" and the modal view is opened */
     const openAddModal=()=>{
        setVisibility2(true);
    }

     /* function which sets the AddModal visibility attribute to "false" and the modal view is closed */
    const closeAddModal=()=>{
        setVisibility2(false);
    }  
    
    /* function which gets it parameters from the UpdateExModal -view and calls updaExById -function if there is something to update */
    const updateExToDb=async(id, reps, sets, date, rating)=>{
        if(updateId!=-1){       
          await updateExById(id, reps, sets, rating);
          setUpdateId(-1);
        }
        else{
            console.log("Nothing to update.");
        }    
        setVisibility(false); 
        await readAllExDoneByDay(date, false);
      }
      
      /* function gets the index of the specific item as a parameter from the onPress-attribute of TouchableOpacity in renderItem -function
      then it sets the desired index- and item -values to state Variables and opens the editing Modal View */
      const updateEx=(index)=>{
        setUpdateId(index);
        setExToUpdate(exList[index]);
        openEditModal();
      }
      
    /*  a custom button component made with using a TouchableOpacity-component */
    const AppButton = ({ onPress, title, backgroundColor, fontColor, iconName }) => (
        <TouchableOpacity 
            activeOpacity={0.6}
            onPress={onPress} 
            style={[
                styles.appButtonContainer,        
                backgroundColor && { backgroundColor }        
            ]}
        >           
            <Avatar.Icon 
                size={32} 
                icon={iconName}
                style={{backgroundColor:'transparent', fontWeight:'bold'}} 
            />
            <Text style={[styles.appButtonText, { color:fontColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
        )
      
    /* function returns as many star-icons as is defined in the count-variable */
    const RatingStars = ({count, size})=>{
        if(!count){
            return(
                <Text></Text>
            );
        }
        else if(count===1){
            return(
                <View style={styles.starRow}>
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star}/>
                </View>
            );
        }
        else if(count===2){
            return(                    
                <View style={styles.starRow}>
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                </View>                    
            );
        }
        else if(count===3){
            return(                    
                <View style={styles.starRow}>
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                </View>                    
            );
        }
        else if(count===4){
            return(                    
                <View style={styles.starRow}>
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                </View>                    
            );
        }
        else if(count===5){
            return(                    
                <View style={styles.starRow}>
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                <Avatar.Icon size={size} icon="star" color="gold" style={styles.star} />
                </View>
            );
        }        
    }

    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    CALENDAR.JS RETURN-STATEMENT STARTS HERE
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    return (       
        <ImageBackground source={require('../../assets/images/background.jpg')}
            style={styles.imageBackground} resizeMode='cover'>
            <UpdateExModal 
                visibility={visibility} 
                updateEx={updateExToDb} 
                exToUpdate={exToUpdate} 
                closeModal={closeEditModal}
                renderStars={RatingStars}
            />
            <AddExModal 
                visibility={visibility2} 
                date={selectedDate} 
                closeModal={closeAddModal}
                readExOfDay={readAllExDoneByDay}
                setMarkers = {setMarkers}
            />               
             <Calendar
               /*  set days-object as the markedDates -property    */   
                markedDates={ 
                    days
                }
                style={{    
                    marginTop: 10,
                    marginBottom: 10,
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
                onDayPress={day => {setMarkers(day.dateString)}}       
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
                    onPress={() => readAllExDoneByDay(selectedDate, true)} 
                    backgroundColor="#0066ff" 
                    fontColor="ivory"
                    iconName="database-search"
                /> 
                <AppButton 
                    title="lisää" 
                    onPress={() => openAddModal()} 
                    backgroundColor="crimson" 
                    fontColor="ivory"
                    iconName="pencil-plus"
                />                                   
            </View>
            {/* Here is some conditional rendering. Wwhen isFetching is true RenderFetching - component gets rendered and 
            when it is set to false RendeList -component gets rendered*/}           
            {isFetching ? <RenderFetching/> : <RenderList/>}                    
        </ImageBackground>         
    );        

    /* function calls the fetchExByDay -function from db.js and sets the return value to the ExList -state variable
    it also sets the isFetching state variable to "true" or "false" depending on the fetching -parameter given
    if it is set to true, then while the data is fetched from the database and an indicator is rendered to the screen
    when isFetching is set to false, only results are rendered afterwards*/
    async function readAllExDoneByDay(date, fetching){
        try{                           
            setIsFetching(fetching);                             
            const dbResult = await fetchExByDay(date);               
            setExList(dbResult);
            if(dbResult.length===0){
                setRenderEmpty(true);
            }
            else{
                setRenderEmpty(false);
            }      
            setTextdDate(date);
            setIsFetching(false);        
        }
        catch(err){
            console.log("Error: "+err);           
        }
        finally{
        }
    }  

   /*  this function reads the current date and returns it as a string in format (YYYY-MM-DD) */
    function getToday(){                
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
        return result;    
    }
    
   /* function calls deleteEx -function from db.js which deletes the item with the specific id from the database
   after the deleting is done exercise are read again to refresh the list in the view bu calling the readAllExDoneByDay -funtion
   if there are no exercises left, markers are refreshed for the selected day */
    async function deleteExFromDb(id){   
        try{          
            await deleteEx(id);
        }
        catch(err){
          console.log(err);
        }
        finally{     
        }
        await readAllExDoneByDay(textDate, false);
        const dbResult = await fetchExByDay(textDate);
        if(dbResult.length === 0){
            await setMarkers(textDate);
        }
      }
};


  const styles = StyleSheet.create({    
    spinner:{
        position: "absolute",
        top: (windowHeight/2)-100,
        left: (windowWidth/2)-110,
        width: 220,       
        justifyContent: "center",
        alignItems: "center",     
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'ivory',
        paddingVertical: 40,
        paddingHorizontal: 30,       
    },    
    listStyle:{
        flex: 1,
        width: '98%',
        alignSelf: 'center',        
        marginVertical: 10,
        paddingVertical: 5,
        paddingHorizontal: 1,        
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth: 2,
        elevation: 10,
    },
    empty:{
        display: 'flex',
        justifyContent: "center",
        alignSelf: 'center',
        alignItems: 'center',         
        marginTop: 30,
        paddingHorizontal: 30,
        paddingVertical: 20,        
        borderRadius: 8,
        borderColor: 'ivory',
        borderWidth: 2,
    },
    listHeading:{
        alignSelf: 'center',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'ivory',
    },
    itemRow:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "navy",
        marginVertical: 2,
        marginHorizontal: 3,
        padding: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'ivory',
        alignItems: 'center',
    },
    listItemStyle:{      
        fontWeight: 'bold',
        fontSize: 14,
        color: 'ivory',
    },
    starRow:{
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-end',         
    },
    star:{
        backgroundColor: 'transparent', 
        margin: -5,     
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
        borderWidth: 2,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginHorizontal: 10,      
    },
    appButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
  });
  
