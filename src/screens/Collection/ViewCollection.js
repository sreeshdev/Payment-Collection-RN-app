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
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default ViewCollection = ({ navigation }) => {
  const { id, type } = navigation.state.params;
  const [edit, setEdit] = useState(type === "edit" ? false : true);
  const [amount, setAmount] = useState("");
  const [barCode, setBarcode] = useState("");
  const [collectedOn, setCollectedOn] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  useEffect(() => {
    setDataLoading(true);
    database
      .ref("paymentCollections/" + id)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        setAmount(data.amount.toString());
        setBarcode(data.barCode);
        getDate(data.collectedOn);
        getEmployee(data.collectionBy);
        setCustomerName(data.customerName);
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const getDate = (date) => {
    var today = new Date(date);

    var fullDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    setCollectedOn(fullDate);
  };
  const getEmployee = (empId) => {
    database
      .ref("employees/" + empId)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setCollectedBy(snapshot.val().name);
        } else {
          setCollectedBy("Employee Deleted");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteCollection = () => {
    setLoading(true);
    database
      .ref("paymentCollections/" + id)
      .remove()
      .then(() => {
        setLoading(false);
        navigation.goBack();
      });
  };
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
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
            <Label>Customer Name</Label>
            <Input
              value={customerName}
              onChangeText={setCustomerName}
              disabled={edit}
            />
          </Item>
          <Item floatingLabel>
            <Label>Amount</Label>
            <Input value={amount} onChangeText={setAmount} disabled={edit} />
          </Item>
          <Item floatingLabel>
            <Label>BarCode</Label>
            <Input value={barCode} onChangeText={setBarcode} disabled={edit} />
          </Item>
          <Item floatingLabel>
            <Label>Collected On</Label>
            <Input
              value={collectedOn}
              onChangeText={setCollectedOn}
              disabled={edit}
            />
          </Item>
          <Item floatingLabel>
            <Label>collected By</Label>
            <Input
              value={collectedBy}
              onChangeText={setCollectedBy}
              disabled={edit}
            />
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
              "Delete Collection History",
              `Are you sure to delete collection of ${customerName}?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Confirm",
                  onPress: () => deleteCollection(),
                },
              ],
              { cancelable: false }
            )
          }
          disabled={isLoading}
        >
          {!isLoading ? (
            <Text>Delete Collection</Text>
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
