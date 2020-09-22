import React, { useEffect } from "react";
import { Container, Spinner, Text, View } from "native-base";
import { AsyncStorage } from "react-native";

import { auth } from "../../config/firebase";

export default Authentication = ({ navigation }) => {
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userDetails");
      if (value !== null) {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("LoginScreen");
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    // auth.onAuthStateChanged((currentUser) => {
    //   if (currentUser) {
    //     navigation.navigate("HomeScreen");
    //   } else {
    //     navigation.navigate("LoginScreen");
    //   }
    // });
    getData();
  }, []);
  return (
    <Container>
      <View
        style={{
          padding: 20,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Authenticating</Text>
        <Spinner color="#333333" />
      </View>
    </Container>
  );
};
