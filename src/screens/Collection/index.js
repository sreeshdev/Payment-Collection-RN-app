import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon,
  Right,
  Button,
  Title,
} from "native-base";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { database, auth } from "../../config/firebase";
import HomeFooter from "../../components/HomeFooter";
import { Alert } from "react-native";

export default Collection = ({ navigation }) => {
  const [collectionList, setCollectionList] = useState([]);
  let focusListener;
  useEffect(() => {
    getData();
    focusListener = navigation.addListener("didFocus", () => {
      getData();
    });
    return () => {
      focusListener.remove();
    };
  }, []);
  const getData = () => {
    let temp = [];
    database
      .ref("paymentCollections/")
      .orderByKey()
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp = [{ id: childSnapshot.key, ...childSnapshot.val() }, ...temp];
          });

        setCollectionList(temp);
      });
  };
  const deleteAllCollection = () => {
    database.ref("paymentCollections/").remove().then(getData());
  };

  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("HomeScreen")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Collection List</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() =>
              Alert.alert(
                "Delete ALL Collections",
                `Are you sure to delete all collection history?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Confirm",
                    onPress: () => deleteAllCollection(),
                  },
                ],
                { cancelable: false }
              )
            }
          >
            <Icon name="trash" />
          </Button>
          <Button
            transparent
            onPress={() => navigation.navigate("SendCollection")}
          >
            <Icon name="mail" />
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {collectionList.length > 0 &&
            collectionList.map((collection) => {
              return (
                <ListItem
                  thumbnail
                  key={collection.id}
                  onPress={() => {
                    navigation.navigate("ViewCollection", {
                      id: collection.id,
                      type: "view",
                    });
                  }}
                >
                  <Left />
                  <Body>
                    <Text>
                      {collection.customerName} - {collection.barCode}
                    </Text>
                    <Text note>
                      Collected On:
                      {new Date(collection.collectedOn).getDate()}-
                      {new Date(collection.collectedOn).getMonth() + 1}-
                      {new Date(collection.collectedOn).getFullYear()}
                    </Text>
                  </Body>
                  <Right>
                    <Text style={{ marginRight: 20, color: "green" }}>
                      ₹ {collection.amount}
                    </Text>
                  </Right>
                </ListItem>
              );
            })}
        </List>
      </Content>
      <HomeFooter screen="Home" navigation={navigation} />
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
