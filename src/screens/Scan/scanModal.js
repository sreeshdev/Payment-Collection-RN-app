import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { database, auth } from "../../config/firebase";
import { AsyncStorage, Platform, StatusBar, SafeAreaView } from "react-native";

const ScanModal = ({
  modalState,
  customer,
  changeModalState,
  changeCustomer,
}) => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@userDetails");
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const approvePay = () => {
    const collectedOn = new Date().getTime();

    database
      .ref("paymentCollections")
      .push({
        customerName: customer.name,
        barCode: customer.barCode,
        amount: customer.amount ? customer.amount : 0,
        collectionBy: user,
        collectedOn,
      })
      .then((snapshot) => {
        changeModalState(!modalState);
        changeCustomer(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    customer && (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalState}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeadText}>Customer Detail</Text>
              <Text style={styles.modalText}>Name: {customer.name}</Text>
              <Text style={styles.modalText}>Phone: {customer.phone}</Text>
              <Text style={styles.modalText}>
                Locality: {customer.locality}
              </Text>
              {/* <Text style={styles.modalText}>Package: {customer.packages}</Text> */}
              <Text style={styles.modalText}>Box No.: {customer.barCode}</Text>
              <Text style={styles.modalText}>
                Collection Date: {new Date().getDate()}-
                {new Date().getMonth() + 1}-{new Date().getFullYear()}
              </Text>
              <Text style={styles.modalPriceText}>
                Amount: ₹{customer.amount}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableHighlight
                  style={{ ...styles.cancelButton }}
                  onPress={() => {
                    changeModalState(!modalState);
                    changeCustomer(null);
                  }}
                >
                  <Text style={{ ...styles.textStyle, color: "red" }}>
                    Cancel
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => approvePay()}
                >
                  <Text style={styles.textStyle}>Approve Pay</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        {/* <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight> */}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 40,
    height: 400,
    // justifyContent: "center",
    alignItems: "center",
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 11,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    marginLeft: 20,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    marginLeft: 20,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalPriceText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalHeadText: {
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
});

export default ScanModal;
