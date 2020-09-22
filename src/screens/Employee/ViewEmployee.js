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
  Left,
  Icon,
  Body,
  Title,
  Right,
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { database, auth } from "../../config/firebase";
import {
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default AddEmployee = ({ navigation }) => {
  const { id, type } = navigation.state.params;
  const [edit, setEdit] = useState(type === "edit" ? false : true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  useEffect(() => {
    setDataLoading(true);
    database
      .ref("employees/" + id)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const createEmployee = () => {
    setLoading(true);
    const Email = email.toLowerCase();
    database
      .ref("employees")
      .push({
        email: Email,
        phone,
        name,
        isAdmin: false,
      })
      .then((snapshot) => {
        auth
          .createUserWithEmailAndPassword(email, phone)
          .then((result) => {
            if (result) {
              alert("Employee has been created.");
              navigation.goBack();
            }

            setLoading(false);
          })
          .catch(({ message }) => {
            alert(message);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteEmployee = () => {
    setLoading(true);
    database
      .ref("employees/" + id)
      .remove()
      .then(() => {
        setLoading(false);
        navigation.navigate("Employee");
      });
  };
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Employee")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Add Employee</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ padding: 20 }}>
        <KeyboardAwareScrollView>
          <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input value={name} onChangeText={setName} disabled={edit} />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input value={email} onChangeText={setEmail} disabled={edit} />
            </Item>
            <Item floatingLabel>
              <Label>Phone</Label>
              <Input value={phone} onChangeText={setPhone} disabled={edit} />
            </Item>
          </Form>
          <Button
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
            }}
            onPress={() =>
              Alert.alert(
                "Delete Employee",
                `Are you sure to delete employee ${name}?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Confirm",
                    onPress: () => deleteEmployee(),
                  },
                ],
                { cancelable: false }
              )
            }
            disabled={isLoading}
          >
            {!isLoading ? (
              <Text>Delete Employee</Text>
            ) : (
              <Spinner color="#eeeeee" />
            )}
          </Button>
          {/* <Button
          transparent
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text>Back to Login</Text>
        </Button> */}
        </KeyboardAwareScrollView>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
