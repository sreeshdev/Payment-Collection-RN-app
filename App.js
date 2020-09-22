import React, { Component } from "react";
import AppNavigation from "./src/routes";
import { Root } from "native-base";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    } else {
      return (
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      );
    }
  }
}
