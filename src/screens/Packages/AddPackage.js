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

export default AddPackage = ({ navigation }) => {
  // const [phone, setPhone] = useState("");
  const [Amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const createPackage = () => {
    setLoading(true);

    database
      .ref("package")
      .push({
        name,
        Amount,
      })
      .then((snapshot) => {
        setLoading(false);
        alert("Package has been created.");
        navigation.navigate("Package");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Package")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Add Package</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ padding: 20 }}>
        <Form>
          <Item floatingLabel>
            <Label>Package Name</Label>
            <Input value={name} onChangeText={setName} />
          </Item>
          <Item floatingLabel>
            <Label>Amount</Label>
            <Input value={Amount} onChangeText={setAmount} />
          </Item>
          {/* <Item floatingLabel>
            <Label>Phone</Label>
            <Input value={phone} onChangeText={setPhone} />
          </Item> */}
        </Form>
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={createPackage}
          disabled={isLoading}
        >
          {!isLoading ? (
            <Text>Create Package</Text>
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
