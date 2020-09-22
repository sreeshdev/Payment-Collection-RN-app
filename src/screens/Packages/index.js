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

export default Package = ({ navigation }) => {
  const [packageList, setpackageList] = useState([]);
  useEffect(() => {
    let temp = [];
    database
      .ref("package/")
      .orderByChild("name")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });

        setpackageList(temp);
      });
  }, []);
  //   const createEmployee = () => {
  //     setLoading(true);
  //     database
  //       .ref("customers/" + phone)
  //       .set({
  //         locality,
  //         phone,
  //         name,
  //         barCode,
  //       })
  //       .then((snapshot) => {
  //         setLoading(false);
  //         navigation.navigate("HomeScreen");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  return (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("HomeScreen")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Package</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.navigate("AddPackage")}>
            <Icon name="add" />
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {packageList.length > 0 &&
            packageList.map((packages) => {
              return (
                <ListItem
                  thumbnail
                  key={packages.id}
                  onPress={() => {
                    navigation.navigate("ViewPackage", {
                      id: packages.id,
                      type: "view",
                    });
                  }}
                >
                  <Left />
                  <Body>
                    <Text>{packages.name}</Text>
                  </Body>
                  <Right>
                    <Text style={{ marginRight: 20, color: "green" }}>
                      ₹ {packages.Amount}
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
