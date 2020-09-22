import React, { useEffect } from "react";
import {
  Button,
  Container,
  Header,
  Text,
  View,
  Footer,
  FooterTab,
  Icon,
} from "native-base";

export default HomeFooter = ({ navigation, screen }) => {
  return (
    <Footer>
      <FooterTab>
        <Button
          vertical
          active={screen == "Home" ? true : false}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Icon name="apps" />
          <Text style={{ fontSize: 12 }}>Dashboard</Text>
        </Button>
        <Button
          vertical
          active={screen == "Scan" ? true : false}
          onPress={() => navigation.navigate("Scan")}
        >
          <Icon name="camera" />
          <Text style={{ fontSize: 12 }}>Scan</Text>
        </Button>

        <Button
          vertical
          active={screen == "Customer" ? true : false}
          onPress={() => navigation.navigate("Customer")}
        >
          <Icon active name="people" />
          <Text style={{ fontSize: 12 }}>Customer</Text>
        </Button>
        <Button
          vertical
          active={screen == "Employee" ? true : false}
          onPress={() => navigation.navigate("Employee")}
        >
          <Icon name="person" />
          <Text style={{ fontSize: 12 }}>Employee</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
};
