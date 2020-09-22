import * as firebase from "firebase";
import firestore from "firebase/firestore";

const firebaseConfig = {
  // fire base Config data
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var database = firebase.database();

export { database, auth };
