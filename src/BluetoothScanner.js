import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, PermissionsAndroid, ImageBackground, Alert, Platform, TouchableOpacity, Linking, StyleSheet,  container, SafeAreaView, Image, AppRegistry, ScrollView, TextInput, NativeModules, NativeEventEmitter,  } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const manager = new BleManager();


  
const requestPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: "Request for Location Permission",
      message: "Bluetooth Scanner requires access to Fine Location Permission",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    }
  );
  return (granted === PermissionsAndroid.RESULTS.GRANTED);
}




// BlueetoothScanner does:
// - access/enable bluetooth module
// - scan bluetooth devices in the area
// - list the scanned devices
const BluetoothScanner = () => {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedDevices, setScannedDevices] = useState({});
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    manager.onStateChange((state) => {
      const subscription = manager.onStateChange(async (state) => {
        console.log(state);
        const newLogData = logData;
        newLogData.push(state);
        await setLogCount(newLogData.length);
        await setLogData(newLogData);
        subscription.remove();
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  const pressHandler = (id) => {
  
    alert('Connected')
    console.log("Connected via Bluetooth to:", id);
  
  
  }
  return (
    <ScrollView style={{flex:1, padding:10}}>
<TouchableOpacity onPress={() => { Linking.openURL(`tel:4071111111`) }}
            onLongPress={() => { Linking.openURL(`tel:911`) }}
            >
            <Image 
            style={styles.emergencyLogo} 
            source={require('../assets/emergency.jpg')} 
            />
            </TouchableOpacity>
      <ScrollView style={{flex:1, padding:10}}>
        <Text style={{fontWeight: "bold"}}>Bluetooth Log ({logCount})</Text>
        <FlatList
          data={logData}
          renderItem={({item}) => {
            return (<Text>{item}</Text>)
          }}
        />
            
            <View style={styles.loginButton}></View>
            <View style={styles.registerButton}></View>

            <Text style={styles.Group45text}>ARGUS</Text>  

        <Text> Name:</Text>  
        <TextInput 
        style={styles.input}
        placeholder='e.g. John Doe'></TextInput>

<Text> Age:</Text>  
        <TextInput 
        keyboardType='numeric'
        style={styles.input}
        placeholder='e.g. 40'></TextInput>

<Text> Blood Type:</Text>  
        <TextInput 
        style={styles.input}
        placeholder='e.g. A+'></TextInput>

<Text> Medications:</Text>  
        <TextInput 
        multiline
        style={styles.input}
        placeholder='e.g. Tylenol'></TextInput>

<Text> Allergies:</Text>  
        <TextInput 
        multiline
        style={styles.input}
        placeholder='e.g. Peanuts'></TextInput>

<Text> Emergency contact #1 name:</Text>  
        <TextInput 
        multiline
        style={styles.input}
        placeholder='e.g. John Doe'></TextInput>

<Text> Emergency contact #1 phone number:</Text>  
        <TextInput 
        keyboardType='numeric'
        style={styles.input}
        placeholder='e.g. 4071111111'></TextInput>

<Text> Emergency contact #2 name:</Text>  
        <TextInput 
        multiline
        style={styles.input}
        placeholder='e.g. John Doe'></TextInput>

<Text> Emergency contact #2 phone number:</Text>  
        <TextInput 
        keyboardType='numeric'
        style={styles.input}
        placeholder='e.g. 4071111111'></TextInput>

<Text> Primary doctor's name:</Text>  
        <TextInput 
        multiline
        style={styles.input}
        placeholder='e.g. John Doe '></TextInput>

<Text> Primary doctor's phone number</Text>  
        <TextInput 
        keyboardType='numeric'
        style={styles.input}
        placeholder='e.g. 4071111111'></TextInput>


        
        
        <Button
          title="Turn On Bluetooth"
          onPress={async () => {
            const btState = await manager.state()
            // test is bluetooth is supported
            if (btState==="Unsupported") {
              alert("Bluetooth is not supported");
              return (false);
            }
            // enable if it is not powered on
            if (btState!=="PoweredOn") {
              await manager.enable();
            } else {
              await manager.disable();
            }
            return (true);
          }}
        />
        
      </ScrollView>
      <ScrollView style={{flex:2, padding:10}}>
        <Text style={{fontWeight: "bold"}}>Scanned Devices ({deviceCount})</Text>
        
        <FlatList
        keyExtractor={(item) => item.id}
          data={Object.values(scannedDevices)}
          renderItem={({item}) => (
    
            
            
            
            <TouchableOpacity onPress={() => pressHandler(item.id)}>
            <Text style={styles.inputB} >{`${item.name}`}
            <Image 
            style={styles.iconLeft} 
            source={require('../assets/Bluetooth_icon.jpg')} 
            />
            
            </Text>
            
            <Image 
            style={styles.iconRight} 
            source={require('../assets/Settings.jpg')} 
            />
            </TouchableOpacity>
          )}
        />
        
        <Button
          title="Scan Devices"
          onPress={async () => {
            const btState = await manager.state()
            // test if bluetooth is powered on
            if (btState!=="PoweredOn") {
              alert("Bluetooth is not powered on");
              return (false);
            }
            // explicitly ask for user's permission
            const permission = await requestPermission();
            if (permission) {
              manager.startDeviceScan(null, null, async (error, device) => {
                  // error handling
                  if (error) {
                    console.log(error);
                    return
                  }
                  // found a bluetooth device
                  if (device) {
                    console.log(`${device.name}`);
                    const newScannedDevices = scannedDevices;
                    newScannedDevices[device.id] = device;
                    
                    await setDeviceCount(Object.keys(newScannedDevices).length);
                    await setScannedDevices(scannedDevices);
                  }
                  setTimeout(() => manager.stopDeviceScan(), 1000);
              });
            }
            return (true);
          }}
        />
      </ScrollView>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
    
  background: {
      flex:1,
      top: 200,
      justifyContent: "center",
      width: 350,
      height: 1000,
     
  },

  container: {
      backgroundColor: "black",
      flex: 1,
  },
  iconLeft: {
    width:20,
    height:20,
    
},
iconRight: {
  width:40,
  height:40,
  left: 280,
  
},
  Group45text: {
      width: 400,
      height: 100,
      bottom: 90,
      fontSize: 30,
      left: 170,
      justifyContent: "center",
      color: "white",
  },
  emergencyLogo: {
      width: 350,
      height: 450,
      bottom: 30,
      flexDirection: "row",
      justifyContent: "center",
  },
  input: {
      borderWidth: 1,
      borderColor: '#777',
      fontSize: 18,
      padding: 8,
      margin: 18,
      width: 280,
},
inputB: {
  borderWidth: 1,
  borderColor: '#777',
  fontSize: 18,
  padding: 8,
  margin: 18,
  width: 220,
},
input2: {
  borderWidth: 1,
  borderColor: 'black',
  fontSize: 18,
  padding: 8,
  margin: 18,
  width:350,
},

  
});

export default BluetoothScanner;
