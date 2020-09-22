import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Spinner,
  Left,
  Body,
  Icon,
  Right,
  Button,
  Title,
  Item,
  Input,
  Segment,
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

export default Customer = ({ navigation }) => {
  const [customerList, setCustomerList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [limit, setLimit] = useState(50);
  const [loadMoreData, setLoadMoreData] = useState(true);
  const [searchBar, setSearchBar] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchBy, setSearchBy] = useState("phone");
  useEffect(() => {
    let temp = [];
    setLoader(true);
    database
      .ref("customers/")
      .orderByChild("name")
      .limitToFirst(limit)
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
        setLimit(limit + 50);
        setCustomerList(temp);
        setLoader(false);
      });
    // fetchData();
  }, []);
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 40;
    let result =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    //true if the end is reached other wise false
    return result;
  };
  const fetchData = () => {
    var temp = [];
    database
      .ref("customers/")
      .orderByChild("name")
      .limitToFirst(limit)
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
        setLimit(limit + 50);
        setCustomerList(temp);
        setLoadMoreData(true);
      });
  };
  const fetchInActiveData = () => {
    var temp = [];

    database
      .ref("customers/")
      .orderByChild("isActive")
      .equalTo(false)
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((childSnapshot) => {
            temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
        setLimit(limit + 50);
        setCustomerList(temp);
        setLoadMoreData(true);
      });
  };
  const search = () => {
    var temp = [];

    setLoader(true);
    if (searchInput.length > 0) {
      database
        .ref("customers/")
        .orderByChild(searchBy)
        .startAt(searchInput)
        .endAt(searchInput + "\uf8ff")
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            snapshot.forEach((childSnapshot) => {
              temp.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            setLoader(false);
            setCustomerList(temp);
          } else {
            database
              .ref("customers/")
              .orderByChild(searchBy)
              .startAt(searchInput.toUpperCase())
              .endAt(searchInput.toUpperCase() + "\uf8ff")
              .once("value")
              .then((snapshot) => {
                if (snapshot.val()) {
                  snapshot.forEach((childSnapshot) => {
                    temp.push({
                      id: childSnapshot.key,
                      ...childSnapshot.val(),
                    });
                  });
                  setLoader(false);
                  setCustomerList(temp);
                }
              });
          }
        });
    } else {
      fetchData();
      setLoader(false);
    }
  };

  return (
    <Container style={styles.AndroidSafeArea}>
      {searchBar ? (
        <View>
          <Header searchBar rounded hasSegment>
            <Left style={{ flex: 0.1 }}>
              <Button
                transparent
                onPress={() => {
                  fetchData();
                  setSearchBar(false);
                  setSearchBy("phone");
                  setSearchInput("");
                }}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder={"Search By " + searchBy}
                value={searchInput}
                onChangeText={(value) => {
                  setSearchInput(value);
                }}
                onSubmitEditing={search}
              />
              <Icon name="ios-people" />
            </Item>
            <Button transparent>
              <Text>Search</Text>
            </Button>
          </Header>
          <Segment>
            <Button
              first
              active={searchBy === "name" ? true : false}
              onPress={() => {
                setSearchBy("name");
                setSearchInput("");
              }}
            >
              <Text>By Name</Text>
            </Button>
            <Button
              active={searchBy === "phone" ? true : false}
              onPress={() => {
                setSearchBy("phone");
                setSearchInput("");
              }}
            >
              <Text>By Phone</Text>
            </Button>
            <Button
              last
              active={searchBy === "barCode" ? true : false}
              onPress={() => {
                setSearchBy("barCode");
                setSearchInput("");
              }}
            >
              <Text>By Box No.</Text>
            </Button>
            <Button
              last
              active={searchBy === "InActive" ? true : false}
              onPress={() => {
                fetchInActiveData();
                setSearchBy("InActive");
              }}
            >
              <Text>InActive</Text>
            </Button>
          </Segment>
        </View>
      ) : (
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => navigation.navigate("HomeScreen")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Customer</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => setSearchBar(true)}>
              <Icon name="ios-search" />
            </Button>
            <Button
              transparent
              onPress={() => navigation.navigate("AddCustomer")}
            >
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
      )}
      <Content
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            //prevent multiple hits for same page number

            if (loadMoreData) {
              //bottom reached start loading data
              setLoadMoreData(false);
              fetchData();
            }
          }
        }}
      >
        {loader ? (
          <Spinner color="#eeeeee" />
        ) : (
          <List>
            {customerList.length > 0 &&
              customerList.map((customer) => {
                return (
                  <ListItem
                    thumbnail
                    key={customer.id}
                    onPress={() => {
                      navigation.navigate("ViewCustomer", {
                        id: customer.id,
                        type: "view",
                      });
                    }}
                  >
                    <Left />
                    <Body>
                      <Text>{customer.name && customer.name}</Text>
                      <Text note numberOfLines={1}>
                        {customer.locality && customer.locality}
                      </Text>
                      <Text note>{customer.phone && customer.phone}</Text>
                    </Body>
                    <Right>
                      {customer.isActive && customer.isActive ? (
                        <Text style={{ marginRight: 20, color: "green" }}>
                          Active
                        </Text>
                      ) : (
                        <Text style={{ marginRight: 20, color: "red" }}>
                          Inactive
                        </Text>
                      )}
                    </Right>
                  </ListItem>
                );
              })}
          </List>
        )}
      </Content>
      <HomeFooter screen="Customer" navigation={navigation} />
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingTop: 50,
    // backgroundColor: "#ecf0f1",
  },
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
