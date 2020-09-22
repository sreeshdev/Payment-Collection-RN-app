import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon,
  Right,
  Button,
  Title,
} from "native-base";

import ScanModal from "./scanModal";
import { database, auth } from "../../config/firebase";
import { getProvidesAudioData } from "expo/build/AR";
import EmployeeFooter from "../../components/EmployeeFooter";

export default Login = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [barCode, setBarCode] = useState("");
  const [customer, setCustomer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      getData();
    })();
  }, []);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userDetails");
      if (value !== null) {
        database
          .ref("employees/" + value)
          .once("value")
          .then((snapshot) => {
            setCurrentUser(snapshot.val());
          });
      }
    } catch (e) {
      // error reading value
    }
  };
  const getBarCode = () => {
    database
      .ref("customers")
      .orderByChild("barCode")
      .equalTo(barCode)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          snapshot.forEach((child) => {
            setCustomer(child.val());
            setModalState(true);
            setScanned(true);
          });
        } else {
          alert("No data Found");
          setModalState(false);
          setScanned(true);
        }
      });
  };
  const getCustomerData = (data) => {
    database
      .ref("customers/" + data)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setCustomer(snapshot.val());
        } else {
          alert("No data Found");
          setModalState(false);
          setScanned(true);
        }
      });

    if (customer) {
      setModalState(true);
      setScanned(true);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setBarCode(data);
    getBarCode(data);
  };

  // const modalOpen = () => {
  //   setModalState(true);
  //   setScanned(true);
  //   //setCustomer("type");
  // };

  if (hasPermission === null) {
    return (
      <Text
        style={{
          marginTop: "50%",
          textAlign: "center",
        }}
      >
        Requesting for camera permission
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text
        style={{
          marginTop: "50%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22,
        }}
      >
        No access to camera
      </Text>
    );
  }

  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("HomeScreen")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Scanner</Title>
        </Body>
      </Header>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        <ScanModal
          modalState={modalState}
          customer={customer}
          barCode={barCode}
          changeModalState={setModalState}
          changeCustomer={setCustomer}
        />
        {!scanned ? (
          <Button
            style={{
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("TypeBoxPage")}
          >
            <Text>Type Box No.</Text>
          </Button>
        ) : (
          <Button
            style={{
              marginBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setScanned(false)}
          >
            <Text>Tap to Scan Again!</Text>
          </Button>
        )}
      </View>
      {currentUser && currentUser.isAdmin ? (
        <HomeFooter screen="Scan" navigation={navigation} />
      ) : (
        <EmployeeFooter screen="Scan" navigation={navigation} />
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
