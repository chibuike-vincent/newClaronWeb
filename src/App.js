import "core-js/stable";
import "./App.css";
import React, { useEffect, useState } from "react";
import IndexRoutes from "./Routes/Index";
import { useSelector, useDispatch } from "react-redux";
import { LOGIN } from "../src/features/user";
import { userDetails } from "../src/Api/Auth";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  Navigate,
  us,
} from "react-router-dom";
import queryString from "query-string";
import * as API from "./Api/DoctorApi";
import {
  getTokenFn,
  onMessageListener
} from "./firebaseConfig";
import toast, { Toaster } from 'react-hot-toast';
import { ShowMessage, type } from "../src/Component/Toaster";
import firebase from "./firebaseConfig"

function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);
  const userEmail = useSelector((state) => state.user.value)

  const notify = (notification) =>  toast( <div>
    <p><b>{notification?.title}</b></p>
    <p>{notification?.body}</p>
  </div>);

  useEffect(() => {

    const getUserInfo = async () => {
      const userData = Object.fromEntries([...searchParams]);
      const data = JSON.parse(localStorage.getItem("user"));
      const type = localStorage.getItem("type");
      

      const response = await userDetails(userData.email);

      if (userData.email && response && response.email === userData.email) {
        dispatch(LOGIN(response));
        localStorage.setItem("access-token", userData.accessToken);
        localStorage.setItem("login-expiry", userData.tokenExpiryUTC);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("user", JSON.stringify(response));
      } else if (
        response &&
        data &&
        data.email !== "undefined" &&
        type === "patient"
      ) {
        navigate("/userDashboard");
      } else if (
        response &&
        data &&
        data.email !== "undefined" &&
        type === "doctor"
      ) {
        navigate("/doctorDashboard");
      }

    
    };

    getUserInfo();

    getTokenFn(setTokenFound).then(async(firebaseToken) => {
      try {
        console.log(firebaseToken, "qqqqqq")
        localStorage.setItem("firebaseToken", firebaseToken);
        setToken(firebaseToken);
        await firebase.firestore().collection('device_token').doc(userEmail.email).set({token: firebaseToken});
        await API.updateFCMToken(firebaseToken)
      } catch (error) {
        await firebase.firestore().collection('device_token').doc('error').set({token: error});
        console.log(error)
      }
    })
    .catch((err) => {
      return err;
    });;

  },[]);


  onMessageListener().then(payload => {
    notify(payload.notification)
    setNotification({title: payload.notification.title, body: payload.notification.body})
    console.log(payload);
    }).catch(err => console.log('failed: ', err));

    
 

  return (
    <>
      <Toaster/>
      <IndexRoutes />
    </>
  );
}

export default App;
