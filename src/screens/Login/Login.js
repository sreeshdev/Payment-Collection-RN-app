import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Content,
  Form,
  Header,
  Input,
  Item,
  Label,
  Spinner,
  Text,
  Title,
  InputGroup,
} from "native-base";

import { auth, database } from "../../config/firebase";
import {
  AsyncStorage,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default Login = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [logged, setLogged] = useState(true);
  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem("@userDetails", data);
    } catch (e) {
      console.log("ERR", e);
    }
  };

  const signIn = () => {
    setLoading(true);
    // let logged = false;
    database
      .ref("employees/")
      .orderByChild("email")
      .equalTo(Email.toLowerCase())
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot, index) => {
          if (
            childSnapshot.val().email === Email.toLowerCase() &&
            childSnapshot.val().phone === password
          ) {
            setLoading(false);
            setLogged(true);
            storeData(childSnapshot.key);
            navigation.navigate("HomeScreen");
          }
        });
        setLogged(false);
        setLoading(false);
      });

    // auth
    //   .signInWithEmailAndPassword(Email, password)
    //   .then((result) => {
    //     if (result) {
    //       setLoading(false);
    //       navigation.navigate("HomeScreen");
    //     }
    //   })
    //   .catch(({ message }) => {
    //     alert(message);
    //     setLoading(false);
    //   });

    // database
    //   .ref("users/")
    //   .once("value")
    //   .then((snapshot) => {
    //     snapshot.val() &&
    //       snapshot.forEach((childSnapshot) => {
    //         console.log(childSnapshot.val().phone);
    //         if (
    //           childSnapshot.val().phone === phone &&
    //           childSnapshot.val().password === password
    //         ) {
    //           auth = true;
    //           console.log(childSnapshot.val().phone);
    //           setLoading(false);
    //           navigation.navigate("HomeScreen");
    //         }
    //       });
    //     if (!auth) {
    //       setLoading(false);
    //       alert("USERNAME OR PASSWORD ERROR");
    //     }
    //   });
  };
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header />
      <Content style={{ padding: 20, paddingTop: 200 }}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={Email} onChangeText={setEmail} />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Item>
        </Form>
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={signIn}
          disabled={isLoading}
        >
          {!isLoading ? <Text>Login</Text> : <Spinner color="#eeeeee" />}
        </Button>
        {logged ? (
          <Title />
        ) : (
          <Title
            style={{
              marginTop: 10,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              color: "red",
            }}
          >
            Username or password Incorrect
          </Title>
        )}
        {/* <Button
          transparent
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("SignupScreen")}
          disabled={isLoading}
        >
          <Text>Signup</Text>
        </Button> */}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
