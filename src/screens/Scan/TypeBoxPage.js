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
import ScanModal from "./scanModal";

import { database, auth } from "../../config/firebase";
import {
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default TypeBoxPage = ({ navigation }) => {
  // const [phone, setPhone] = useState("");
  const [scanned, setScanned] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [barCode, setBarCode] = useState("");
  const [customer, setCustomer] = useState(null);
  const [isLoading, setLoading] = useState(false);
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
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Scan")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Collection Entry</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ padding: 20 }}>
        <Form>
          <Item floatingLabel>
            <Label>Box No</Label>
            <Input value={barCode} onChangeText={setBarCode} />
          </Item>
        </Form>
        <ScanModal
          modalState={modalState}
          customer={customer}
          barCode={barCode}
          changeModalState={setModalState}
          changeCustomer={setCustomer}
        />
        <Button
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={getBarCode}
          disabled={isLoading}
        >
          {!isLoading ? (
            <Text>Search Customer</Text>
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
