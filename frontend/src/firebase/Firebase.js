import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var config = {
  apiKey: "AIzaSyD80dV2anOhJL_W1SKSq_rcRx50H0tonyg",
  authDomain: "xtreme-react-admin.firebaseapp.com",
  databaseURL: "https://xtreme-react-admin.firebaseio.com",
  projectId: "xtreme-react-admin",
  storageBucket: "xtreme-react-admin.appspot.com",
  messagingSenderId: "452884069288",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const Db = firebase.database();
const Auth = firebase.auth();

export { Db, Auth };
