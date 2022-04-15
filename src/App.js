import "core-js/stable";
import "./App.css";
import React, { useEffect, useState } from "react";
import IndexRoutes from "./Routes/Index";
import { useDispatch } from "react-redux";
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
  requestFirebaseNotificationPermission,
  onMessageListener,
} from "./firebaseConfig";
import toast, { Toaster } from 'react-hot-toast';
import { ShowMessage, type } from "../src/Component/Toaster";
import firebase from "firebase/app";
import "firebase/messaging";;

function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  // const [notification, setNotification] = useState({title: '', body: ''});

  const notify = (notification) =>  toast( <div>
    <p><b>{notification?.title}</b></p>
    <p>{notification?.body}</p>
  </div>);

  // function ToastDisplay() {
  //   return (
  //     <div>
  //       <p><b>{notification?.title}</b></p>
  //       <p>{notification?.body}</p>
  //     </div>
  //   );
  // };

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
  },[]);


  requestFirebaseNotificationPermission()
      .then(async(firebaseToken) => {
        localStorage.setItem("firebaseToken", firebaseToken);
        setToken(firebaseToken);
        await API.updateFCMToken(firebaseToken)

        onMessageListener()
        .then((payload) => {
          console.log("firebaseToken, firebaseToken ddddd")

          if (payload?.notification?.title){
            notify(payload?.notification)
          }
        
          // setNotification({title: payload?.notification?.title, body: payload?.notification?.body});     
        })
        .catch((err) => console.log('failed: ', err));
      })
      .catch((err) => {
        return err;
      });

    

    

  return (
    <>
    <Toaster/>
      <IndexRoutes />
    </>
  );
}

export default App;
