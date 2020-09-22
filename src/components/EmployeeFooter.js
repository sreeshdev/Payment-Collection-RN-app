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

export default EmployeeFooter = ({ navigation, screen }) => {
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
      </FooterTab>
    </Footer>
  );
};
