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
import { View } from "react-native";
import { StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native";
import { database, auth } from "../../config/firebase";
import HomeFooter from "../../components/HomeFooter";
import { Alert } from "react-native";

export default Employee = ({ navigation }) => {
  const [employeeList, setEmployeeList] = useState([]);
  useEffect(() => {
    let temp = [];
    database
      .ref("employees/")
      .orderByChild("name")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });

        setEmployeeList(temp);
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
          <Title>Employee</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => navigation.navigate("AddEmployee")}
          >
            <Icon name="add" />
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {employeeList.length > 0 &&
            employeeList.map((employee) => {
              return (
                <ListItem
                  thumbnail
                  key={employee.id}
                  onPress={() => {
                    navigation.navigate("ViewEmployee", {
                      id: employee.id,
                      type: "view",
                    });
                  }}
                >
                  <Left />
                  <Body>
                    <Text>{employee.name}</Text>
                    <Text note numberOfLines={1}>
                      {employee.email}
                    </Text>
                    <Text note>{employee.phone}</Text>
                  </Body>
                  {/* <Right>
                  <View style={{ flexDirection: "row" }}>
                    <Button>
                      <Text>Modify</Text>
                    </Button>
                    <Button transparent>
                      <Text>View</Text>
                    </Button>
                  </View>
                </Right> */}
                </ListItem>
              );
            })}
        </List>
      </Content>
      <HomeFooter screen="Employee" navigation={navigation} />
    </Container>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
