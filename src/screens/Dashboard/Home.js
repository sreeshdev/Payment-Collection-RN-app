import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Header,
  Text,
  View,
  Footer,
  FooterTab,
  Title,
  Left,
  Right,
  Body,
  Icon,
  Spinner,
} from "native-base";
import {
  AsyncStorage,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";

import { auth, database } from "../../config/firebase";
import HomeFooter from "../../components/HomeFooter";
import EmployeeFooter from "../../components/EmployeeFooter";

export default Home = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [totalCustomer, setTotalCustomer] = useState("");
  const [totalEmployee, setTotalEmployee] = useState("");
  const [activeCustomer, setActiveCustomer] = useState("");
  const [inActiveCustomer, setInActiveCustomer] = useState("");
  const [monthlyCollection, setMonthlyCollection] = useState("");
  const [todayCollection, setTodayCollection] = useState("");
  const [employeeMonthCollection, setEmployeeMonthCollection] = useState("");
  const [employeeTodayCollection, setEmployeeTodayCollection] = useState("");
  const [
    employeeTodayCollectionAmount,
    setEmployeeTodayCollectionAmount,
  ] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userDetails");
      if (value !== null) {
        database
          .ref("employees/" + value)
          .once("value")
          .then((snapshot) => {
            setCurrentUser(snapshot.val());
            if (snapshot.val().isAdmin) {
              getTotalCustomer();
              getTotalEmployee();
              getActiveCustomer();
              getInActiveCustomer();
              getMonthlyCollection();
              getTodayCollection();
            } else {
              getEmployeeMonthCollection(value);
              getEmployeeTodayCollection(value);
            }
          });
      }
    } catch (e) {
      // error reading value
    }
  };
  const removeData = async () => {
    try {
      const value = await AsyncStorage.removeItem("@userDetails");
    } catch (e) {
      // error reading value
    }
  };
  const getTotalCustomer = async () => {
    await database
      .ref("customers/")
      .once("value")
      .then((snapshot) => {
        setTotalCustomer(snapshot.numChildren());
      });
  };
  const getActiveCustomer = async () => {
    await database
      .ref("customers/")
      .orderByChild("isActive")
      .equalTo(true)
      .once("value")
      .then((snapshot) => {
        setActiveCustomer(snapshot.numChildren());
      });
  };
  const getInActiveCustomer = async () => {
    await database
      .ref("customers/")
      .orderByChild("isActive")
      .equalTo(false)
      .once("value")
      .then((snapshot) => {
        setInActiveCustomer(snapshot.numChildren());
      });
  };
  const getTotalEmployee = async () => {
    await database
      .ref("employees/")
      .once("value")
      .then((snapshot) => {
        setTotalEmployee(snapshot.numChildren());
      });
  };
  const getMonthlyCollection = async () => {
    var count = 0;
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1).getTime();
    var lastDay = new Date(y, m + 1, 0).getTime();
    await database
      .ref("paymentCollections/")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((child) => {
            if (
              child.val().collectedOn >= firstDay &&
              child.val().collectedOn <= lastDay
            ) {
              count++;
            }
          });
        setMonthlyCollection(count);
      });
  };
  const getEmployeeMonthCollection = async (value) => {
    var count = 0;
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1).getTime();
    var lastDay = new Date(y, m + 1, 0).getTime();
    await database
      .ref("paymentCollections/")
      .orderByChild("collectionBy")
      .equalTo(value)
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((child) => {
            if (
              child.val().collectedOn >= firstDay &&
              child.val().collectedOn <= lastDay
            ) {
              count++;
            }
          });
        setEmployeeMonthCollection(count);
      });
  };
  const getTodayCollection = async () => {
    var count = 0;
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();
    var firstDay = new Date(y, m, d).getTime();
    var lastDay = new Date(y, m, d + 1).getTime();
    await database
      .ref("paymentCollections/")
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((child) => {
            if (
              child.val().collectedOn >= firstDay &&
              child.val().collectedOn <= lastDay
            ) {
              count++;
            }
          });
        setTodayCollection(count);
        setLoader(false);
      });
  };
  const getEmployeeTodayCollection = async (value) => {
    var count = 0;
    var TodayAmount = 0;
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth(),
      d = date.getDate();
    var firstDay = new Date(y, m, d).getTime();
    var lastDay = new Date(y, m, d + 1).getTime();
    await database
      .ref("paymentCollections/")
      .orderByChild("collectionBy")
      .equalTo(value)
      .once("value")
      .then((snapshot) => {
        snapshot.val() &&
          snapshot.forEach((child) => {
            if (
              child.val().collectedOn >= firstDay &&
              child.val().collectedOn <= lastDay
            ) {
              count++;
              TodayAmount += parseFloat(child.val().amount);
            }
          });
        setEmployeeTodayCollection(count);
        setEmployeeTodayCollectionAmount(TodayAmount);
      });

    setLoader(false);
  };
  useEffect(() => {
    setLoader(true);
    getData();
  }, []);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoader(true);
    getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const logout = () => {
    removeData().then(() => navigation.navigate("LoginScreen"));
  };

  return currentUser && currentUser.isAdmin ? (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left />
        <Body>
          <Title>Admin Dashboard</Title>
        </Body>
        <Right>
          <Button transparent onPress={logout}>
            <Icon name="log-out" />
          </Button>
        </Right>
      </Header>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
            // alignItems: "center",
            // padding: 20,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-end",
              padding: 20,
              fontSize: 26,
            }}
          >
            Welcome {currentUser.name}!
          </Text>
          <View style={styles.container}>
            <View style={styles.item}>
              <Text style={{ fontSize: 18 }}>Total Customers</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {totalCustomer}
                </Text>
              )}
            </View>
            <View style={styles.item}>
              <Text style={{ fontSize: 18 }}>Total Employees</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {totalEmployee}
                </Text>
              )}
            </View>
            <View style={styles.item}>
              <Text style={{ fontSize: 18 }}>Active Customers</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {activeCustomer}/{totalCustomer}
                </Text>
              )}
            </View>
            <View style={styles.item}>
              <Text style={{ fontSize: 18 }}>InActive Customers</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {inActiveCustomer}
                </Text>
              )}
            </View>
            <View style={{ ...styles.item }}>
              <Text style={{ fontSize: 18 }}>Month Collection</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {monthlyCollection}/{activeCustomer}
                </Text>
              )}
            </View>
            <View style={{ ...styles.item }}>
              <Text style={{ fontSize: 18 }}>Today Collection</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {todayCollection}
                </Text>
              )}
            </View>
            <Button
              style={{
                ...styles.item,
                borderWidth: 0,
                borderRadius: 0,
              }}
              onPress={() => {
                navigation.navigate("Package");
              }}
            >
              <Text style={{ fontSize: 18 }}>Package List</Text>
            </Button>
            <Button
              style={{
                ...styles.item,
                borderWidth: 0,
                borderRadius: 0,
              }}
              onPress={() => {
                navigation.navigate("Collection");
              }}
            >
              <Text style={{ fontSize: 18 }}>Collection List</Text>
            </Button>
          </View>

          {/* <Button
          style={{ marginTop: 20 }}
          onPress={() => {
            navigation.navigate("AddCustomer");
          }}
        >
          <Text>Add Customer</Text>
        </Button> */}
        </View>
      </ScrollView>
      <HomeFooter screen="Home" navigation={navigation} />
    </Container>
  ) : currentUser && !currentUser.isAdmin ? (
    <Container style={styles.AndroidSafeArea}>
      <Header>
        <Left />
        <Body>
          <Title>Dashboard</Title>
        </Body>
        <Right>
          <Button transparent onPress={logout}>
            <Icon name="log-out" />
          </Button>
        </Right>
      </Header>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              alignSelf: "flex-end",
              padding: 20,
              fontSize: 26,
            }}
          >
            Welcome {currentUser.name} !
          </Text>
          <View style={styles.EmployeeContainer}>
            <View style={styles.EmployeeItem}>
              <Text style={{ fontSize: 25 }}>Month Collection</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {employeeMonthCollection}
                </Text>
              )}
            </View>
            <View style={styles.EmployeeItem}>
              <Text style={{ fontSize: 25 }}>Today Collection</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {employeeTodayCollection}
                </Text>
              )}
            </View>
            <View style={styles.EmployeeItem}>
              <Text style={{ fontSize: 25 }}>Today Collection Amount</Text>
              {loader ? (
                <Spinner color="blue" />
              ) : (
                <Text style={{ fontSize: 23, marginTop: 10 }}>
                  {employeeTodayCollectionAmount}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <EmployeeFooter screen="Home" navigation={navigation} />
    </Container>
  ) : (
    <View style={styles.LoadContainer}>
      <Spinner color="blue" />
    </View>
  );
};
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right
  },
  LoadContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  EmployeeContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    bottom: 0,
    marginTop: "50%",
  },
  EmployeeItem: {
    width: "50%",
    borderWidth: 0.5,
    borderColor: "grey",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: "50%",
    borderWidth: 0.5,
    borderColor: "grey",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
