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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  Alert,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { database, auth } from "../../config/firebase";

export default ViewCustomer = ({ navigation }) => {
  const { id, type } = navigation.state.params;

  const [edit, setEdit] = useState(type === "edit" ? false : true);
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
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    const temp = [];
    const packid = [];
    var price = 0;
    database
      .ref("customers/" + id)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          data.phone && setPhone(data.phone.toString());
          data.office && setOffice(data.office);
          data.serial && setSerial(data.serial);
          data.no && setNo(data.no.toString());
          data.packages && setSelectedPackage(data.packages);
          //setAmount(data.amount);
          data.locality && setLocality(data.locality);
          data.name && setName(data.name);
          data.barCode && setBarCode(data.barCode);
          data.city && setCity(data.city);
          data.isActive && setActive(data.isActive);
          data.packages &&
            data.packages.length > 0 &&
            data.packages.map((pack) => {
              //temp.push(pack);
              packid.push(pack.id);
            });

          setDataLoading(false);
          // setCustomerList(temp);
        }
      });
    database
      .ref("package/")
      .orderByChild("name")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            if (packid.includes(childSnapshot.key)) {
              temp.push({
                id: childSnapshot.key,
                name: `${childSnapshot.val().name} @ ₹${
                  childSnapshot.val().Amount
                }`,
                Amount: childSnapshot.val().Amount,
                checked: true,
              });
              price += parseInt(childSnapshot.val().Amount);
            } else {
              temp.push({
                id: childSnapshot.key,
                name: `${childSnapshot.val().name} @ ₹${
                  childSnapshot.val().Amount
                }`,
                Amount: childSnapshot.val().Amount,
              });
            }
          });
        setAmount(price.toString());

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
  const updateCustomer = () => {
    setLoading(true);
    database
      .ref("customers/" + id)
      .set({
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
        setEdit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteCustomer = () => {
    setLoading(true);
    database
      .ref("customers/" + id)
      .remove()
      .then(() => {
        setLoading(false);
        navigation.navigate("Customer");
      });
  };
  var CustomerState = [
    { label: "InActive", value: 0 },
    { label: "Active", value: 1 },
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
          <Title>{!edit ? "Edit Customer" : "View Customer"}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => setEdit(false)}>
            <Icon name="create" />
          </Button>
        </Right>
      </Header>
      {!dataLoading ? (
        <Content style={{ padding: 10, marginTop: 0 }}>
          <KeyboardAwareScrollView>
            <Form>
              <Item floatingLabel>
                <Label>Office</Label>
                <Input
                  value={office}
                  onChangeText={setOffice}
                  disabled={edit}
                />
              </Item>
              <Item floatingLabel>
                <Label>Serial</Label>
                <Input
                  value={serial}
                  onChangeText={setSerial}
                  disabled={edit}
                />
              </Item>
              <Item floatingLabel>
                <Label>No</Label>
                <Input value={no} onChangeText={setNo} disabled={edit} />
              </Item>
              <Item floatingLabel>
                <Label>Customer Name</Label>
                <Input value={name} onChangeText={setName} disabled={edit} />
              </Item>
              <Item floatingLabel>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  keyboardType="numeric"
                  onChangeText={setPhone}
                  disabled={edit}
                />
              </Item>
              <Item floatingLabel>
                <Label>Locality</Label>
                <Input
                  value={locality}
                  onChangeText={setLocality}
                  disabled={edit}
                />
              </Item>
              <Item floatingLabel>
                <Label>City</Label>
                <Input value={city} onChangeText={setCity} disabled={edit} />
              </Item>
              <Item style={{ marginTop: 10 }}>
                <Select2
                  disabled
                  style={{ borderRadius: 5 }}
                  colorTheme="blue"
                  popupTitle="Select Package"
                  title="Select Package"
                  cancelButtonText="Cancel"
                  selectButtonText="Add"
                  data={packagesList}
                  onSelect={(data) => {
                    setSelectedPackageId(data);
                  }}
                  searchPlaceHolderText="Search package"
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
                <Input
                  value={barCode}
                  onChangeText={setBarCode}
                  disabled={edit}
                />
              </Item>

              {!edit ? (
                <RadioForm
                  style={{
                    marginTop: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  radio_props={CustomerState}
                  initial={isActive ? 1 : 0}
                  formHorizontal={true}
                  labelHorizontal={false}
                  onPress={(value) => {
                    value ? setActive(true) : setActive(false);
                  }}
                />
              ) : isActive ? (
                <Title
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  Active Customer
                </Title>
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
                  InActive Customer
                </Title>
              )}
            </Form>
            {!edit ? (
              <Button
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={updateCustomer}
                disabled={isLoading}
              >
                {!isLoading ? (
                  <Text>Update Customer</Text>
                ) : (
                  <Spinner color="#eeeeee" />
                )}
              </Button>
            ) : (
              <Button
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                }}
                onPress={() =>
                  Alert.alert(
                    "Delete Customer",
                    `Are you sure to delete customer ${name}?`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Confirm",
                        onPress: () => deleteCustomer(),
                      },
                    ],
                    { cancelable: false }
                  )
                }
                disabled={isLoading}
              >
                {!isLoading ? (
                  <Text>Delete Customer</Text>
                ) : (
                  <Spinner color="#eeeeee" />
                )}
              </Button>
            )}
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
      ) : (
        <Spinner color="#eeeeee" />
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
