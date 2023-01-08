import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAhKw99SP8g0BktREohAFZt2AB7kEYh7hs",
  authDomain: "arc3share.firebaseapp.com",
  projectId: "arc3share",
  storageBucket: "arc3share.appspot.com",
  messagingSenderId: "792728815703",
  appId: "1:792728815703:web:56c7e74dbb509ff8383b12",
  measurementId: "G-SFMZCF5VFG"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(firebaseApp);

export default firebaseStorage