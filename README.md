# `Gymapp - The gym excercise diary`
## &copy; 2022 Ari-Jussi Ahonen, Arsi Arola and Oskari Ahoniemi
**Gymapp** is a mobile application for keeping track of your gym excercises and done sets and repetitions.

This application is developed using the **React Native Framework**.<br/>
**SQLite** database is used to store the data in the local device memory. 

With this application the user can:
- **add, delete, and update** their excercises on a desired date picked from a calendar
- quickly add a current day's excercise and also add and delete excercise types
- alternatively rate your exercises

## Install React Native Libraries
First you have to install **React Native libraries** into your project space with the following commands:
```
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/drawer
npm install react-native-gesture-handler@2.1.1
npm install react-native-reanimated
npm install react-native-sqlite-storage 
npm install react-native-paper@5.0.0-rc.6
npm install --save react-native-vector-icons
npm install react-native-ionicons@^4.x
npm install react-native-linear-gradient --save
npm install --save react-native-calendars
npm install --save react-native-indicators
npm install react-native-element-dropdown --save
```


## **SCREENSHOTS**

### **Navigation menu**

![Screenshot1](https://user-images.githubusercontent.com/102353086/217549044-f2591820-3ff5-4a1e-8cdb-a2bc2ac39197.png)

### **Calendar view**
The calendar shows markers on the dates that have added excercises. <br /> 
Done excercises are show on a list with sets, repetitions and the optional rating.

![Screenshot2](https://user-images.githubusercontent.com/102353086/217549421-eebcaa35-ff54-4ca5-9597-5f303c622d4e.png)

### **Editing an excercise**
The **TOP5** exercises with the most repetitions are also visible.

![Screenshot3](https://user-images.githubusercontent.com/102353086/217552726-bed17825-47e1-4f33-88fd-2b39d232cbec.png)

### **Adding an excercise**
User can select an excercise from the dropdown list<br/>
with a number of sets and repetitions and an optional rating from 1 to 5.

![Screenshot4](https://user-images.githubusercontent.com/102353086/217604031-650bfa1d-d4a4-4082-a721-54420111f325.png)



