import React, { useState } from "react";
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

import { database, auth } from "../../config/firebase";
import {
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default AddEmployee = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
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
      .then(() => {
        alert("Employee has been created.");
        navigation.navigate("Employee");

        setLoading(false);
      })
      .catch(({ message }) => {
        alert(message);
        setLoading(false);
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
        <Form>
          <Item floatingLabel>
            <Label>Name</Label>
            <Input value={name} onChangeText={setName} />
          </Item>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />
          </Item>
          <Item floatingLabel>
            <Label>Phone</Label>
            <Input value={phone} onChangeText={setPhone} />
          </Item>
        </Form>
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={createEmployee}
          disabled={isLoading}
        >
          {!isLoading ? (
            <Text>Create Employee</Text>
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
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
