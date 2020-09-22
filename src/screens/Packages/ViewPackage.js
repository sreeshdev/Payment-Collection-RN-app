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

export default ViewPackage = ({ navigation }) => {
  // const [phone, setPhone] = useState("");
  const { id, type } = navigation.state.params;
  const [edit, setEdit] = useState(type === "edit" ? false : true);
  const [Amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  useEffect(() => {
    setDataLoading(true);
    database
      .ref("package/" + id)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        setName(data.name);
        setAmount(data.Amount);
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updatePackage = () => {
    setLoading(true);

    database
      .ref("package/" + id)
      .update({
        name,
        Amount,
      })
      .then((snapshot) => {
        setLoading(false);

        setEdit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePackage = () => {
    setLoading(true);
    database
      .ref("package/" + id)
      .remove()
      .then(() => {
        setLoading(false);
        navigation.navigate("Package");
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
          <Title>{!edit ? "Edit Package" : "View Package"}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => setEdit(false)}>
            <Icon name="create" />
          </Button>
        </Right>
      </Header>
      {dataLoading ? (
        <Spinner color="#eeeeee" />
      ) : (
        <Content style={{ padding: 20 }}>
          <Form>
            <Item floatingLabel>
              <Label>Package Name</Label>
              <Input value={name} onChangeText={setName} disabled={edit} />
            </Item>
            <Item floatingLabel>
              <Label>Price</Label>
              <Input value={Amount} onChangeText={setAmount} disabled={edit} />
            </Item>
            {/* <Item floatingLabel>
            <Label>Phone</Label>
            <Input value={phone} onChangeText={setPhone} />
          </Item> */}
          </Form>

          {!edit ? (
            <Button
              style={{
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={updatePackage}
              disabled={isLoading}
            >
              {!isLoading ? (
                <Text>Update Package</Text>
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
                  "Delete Package",
                  `Are you sure to delete Package ${name}?`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Confirm",
                      onPress: () => deletePackage(),
                    },
                  ],
                  { cancelable: false }
                )
              }
              disabled={isLoading}
            >
              {!isLoading ? (
                <Text>Delete Package</Text>
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
        </Content>
      )}
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
