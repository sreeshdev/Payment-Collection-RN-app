import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Authentication from "../screens/Login/Authentication";
import Home from "../screens/Dashboard/Home";
import Login from "../screens/Login/Login";
import AddEmployee from "../screens/Employee/AddEmployee";
import ViewEmployee from "../screens/Employee/ViewEmployee";
import AddCustomer from "../screens/Customer/AddCustomer";
import ViewCustomer from "../screens/Customer/viewCustomer";
import AddPackage from "../screens/Packages/AddPackage";
import ViewPackage from "../screens/Packages/ViewPackage";
import Customer from "../screens/Customer/index";
import Employee from "../screens/Employee/index";
import Scan from "../screens/Scan/index";
import TypeBoxPage from "../screens/Scan/TypeBoxPage";
import Package from "../screens/Packages/index";
import Collection from "../screens/Collection/index";
import SendCollection from "../screens/Collection/SendCollection";
import ViewCollection from "../screens/Collection/ViewCollection";

const authenticationStack = createStackNavigator(
  {
    LoginScreen: {
      screen: Login,
    },
  },
  {
    initialRouteName: "LoginScreen",
    headerMode: "none",
  }
);
const employeeStack = createStackNavigator(
  {
    AddEmployee: {
      screen: AddEmployee,
    },
    ViewEmployee: {
      screen: ViewEmployee,
    },
    Employee: {
      screen: Employee,
    },
  },
  {
    initialRouteName: "Employee",
    headerMode: "none",
  }
);
const customerStack = createStackNavigator(
  {
    AddCustomer: {
      screen: AddCustomer,
    },
    ViewCustomer: {
      screen: ViewCustomer,
    },
    Customer: {
      screen: Customer,
    },
  },
  {
    initialRouteName: "Customer",
    headerMode: "none",
  }
);
const scanStack = createStackNavigator(
  {
    Scan: {
      screen: Scan,
    },
    TypeBoxPage: {
      screen: TypeBoxPage,
    },
  },
  {
    initialRouteName: "Scan",
    headerMode: "none",
  }
);
const packageStack = createStackNavigator(
  {
    AddPackage: {
      screen: AddPackage,
    },
    ViewPackage: {
      screen: ViewPackage,
    },

    Package: {
      screen: Package,
    },
  },
  {
    initialRouteName: "Package",
    headerMode: "none",
  }
);
const collectionStack = createStackNavigator(
  {
    Collection: {
      screen: Collection,
    },
    SendCollection: {
      screen: SendCollection,
    },
    ViewCollection: {
      screen: ViewCollection,
    },
  },
  {
    initialRouteName: "Collection",
    headerMode: "none",
  }
);
const mainStack = createStackNavigator(
  {
    HomeScreen: {
      screen: Home,
    },
    EmployeeStack: {
      screen: employeeStack,
    },
    CustomerStack: {
      screen: customerStack,
    },
    ScanStack: {
      screen: scanStack,
    },
    PackageStack: {
      screen: packageStack,
    },
    CollectionStack: {
      screen: collectionStack,
    },
  },
  {
    initialRouteName: "HomeScreen",
    headerMode: "none",
  }
);

const authenticationSwitch = createSwitchNavigator(
  {
    AuthenticationScreen: {
      screen: Authentication,
    },
    MainStack: {
      screen: mainStack,
    },
    AuthenticationStack: {
      screen: authenticationStack,
    },
  },
  { initialRouteName: "AuthenticationScreen" }
);

export default createAppContainer(authenticationSwitch);
