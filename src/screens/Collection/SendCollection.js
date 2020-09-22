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

import { database, auth } from "../../config/firebase";
import {
  Alert,
  Linking,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default SendCollection = ({ navigation }) => {
  // const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [barCodes, setBarCodes] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    var temp = [];
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();
    var firstDay = new Date(y, m, 1).getTime();
    var lastDay = new Date(y, m + 1, 0).getTime();
    database
      .ref("paymentCollections/")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((child) => {
            if (
              child.val().collectedOn >= firstDay &&
              child.val().collectedOn <= lastDay
            ) {
              temp.push(child.val().barCode);
            }
          });

        setBarCodes(temp);
      });
  }, []);
  const sendMail = () => {
    var codes = barCodes.toString().split(",").join("\n");
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    Linking.openURL(
      `mailto:${email.toLowerCase()}?subject=Collection List for month:${month},${year}&body=${codes}`
    );
  };
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Collection")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Mail Collections</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ padding: 20 }}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />
          </Item>
        </Form>
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={sendMail}
          disabled={isLoading}
        >
          {!isLoading ? <Text>Mail</Text> : <Spinner color="#eeeeee" />}
        </Button>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
