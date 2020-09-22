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
  Right,
  Icon,
  Body,
  Title,
} from "native-base";
import Select2 from "react-native-select-two";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

import { database, auth } from "../../config/firebase";

export default AddCustomer = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [office, setOffice] = useState("");
  const [serial, setSerial] = useState("");
  const [no, setNo] = useState("");
  const [selectedPackages, setSelectedPackage] = useState([]);
  const [packagesList, setPackageList] = useState([]);
  const [amount, setAmount] = useState("");
  const [locality, setLocality] = useState("");
  const [name, setName] = useState("");
  const [barCode, setBarCode] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setActive] = useState(true);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const temp = [];
    database
      .ref("package/")
      .orderByChild("name")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({
              id: childSnapshot.key,
              name: `${childSnapshot.val().name} @ ₹${
                childSnapshot.val().Amount
              }`,
              Amount: childSnapshot.val().Amount,
            });
          });

        setPackageList(temp);
      });
  }, []);
  const setSelectedPackageId = (data) => {
    var selectedPackage = [];
    var price = 0;

    data.forEach((id) => {
      packagesList.forEach((packages) => {
        if (id === packages.id) {
          selectedPackage.push(packages);
          price += parseInt(packages.Amount);
        }
      });
    });

    setAmount(price.toString());
    setSelectedPackage(selectedPackage);
  };
  const createEmployee = () => {
    setLoading(true);
    database
      .ref("customers")
      .push({
        office,
        serial,
        no,
        packages: selectedPackages,
        amount,
        city,
        locality,
        phone,
        name,
        barCode,
        isActive,
      })
      .then((snapshot) => {
        setLoading(false);
        navigation.navigate("HomeScreen");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var CustomerState = [
    { label: "InActive", value: 0 },
    { label: "Active", value: 1 },
  ];
  const mockData = [
    { id: 1, name: "React Native Developer", checked: true }, // set default checked for render option item
    { id: 2, name: "Android Developer" },
    { id: 3, name: "iOS Developer" },
  ];
  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Customer")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Add Customer</Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ padding: 10, marginTop: 0 }}>
        <KeyboardAwareScrollView>
          <Form>
            <Item floatingLabel>
              <Label>Office</Label>
              <Input value={office} onChangeText={setOffice} />
            </Item>
            <Item floatingLabel>
              <Label>Serial</Label>
              <Input value={serial} onChangeText={setSerial} />
            </Item>
            <Item floatingLabel>
              <Label>No</Label>
              <Input value={no} onChangeText={setNo} />
            </Item>

            <Item floatingLabel>
              <Label>Customer Name</Label>
              <Input value={name} onChangeText={setName} />
            </Item>
            <Item floatingLabel>
              <Label>Phone</Label>
              <Input
                value={phone}
                keyboardType="numeric"
                onChangeText={setPhone}
              />
            </Item>
            <Item floatingLabel>
              <Label>Locality</Label>
              <Input value={locality} onChangeText={setLocality} />
            </Item>
            <Item floatingLabel>
              <Label>City</Label>
              <Input value={city} onChangeText={setCity} />
            </Item>
            <Item style={{ marginTop: 10 }}>
              {/* <Label>Package</Label> */}
              <Select2
                style={{ borderRadius: 5 }}
                colorTheme="blue"
                popupTitle="Select Package"
                title="Select Package"
                cancelButtonText="Cancel"
                selectButtonText="Add"
                data={packagesList}
                searchPlaceHolderText="Search package"
                onSelect={(data) => {
                  setSelectedPackageId(data);
                }}
                onRemoveItem={(data) => {
                  setSelectedPackageId(data);
                }}
              />
            </Item>
            <Item floatingLabel>
              <Label>Amount</Label>
              <Input value={amount} onChangeText={setAmount} disabled />
            </Item>
            <Item floatingLabel>
              <Label>BarCode ID</Label>
              <Input value={barCode} onChangeText={setBarCode} />
            </Item>
            <RadioForm
              style={{
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              radio_props={CustomerState}
              initial={1}
              formHorizontal={true}
              labelHorizontal={false}
              onPress={(value) => {
                value ? setActive(true) : setActive(false);
              }}
            />
          </Form>
          <Button
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={createEmployee}
            disabled={isLoading}
          >
            {!isLoading ? (
              <Text>Create Customer</Text>
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
