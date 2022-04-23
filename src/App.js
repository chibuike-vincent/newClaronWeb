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


function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);
  const userData = useSelector((state) => state.user.value)

  const redirectFn = (notification, data) => { 
    if(notification.title.includes('Urgent Care')){
      navigate("/join", { state: { notification:data, mediaType: "audio" }})
    }else if(notification.title.includes('New message') && data.name.includes("From Patient")){
      navigate("/ChatDoctor", { state: { notification:data }})
    }else if(notification.title.includes('New message') && data.name.includes("From Doc")){
      navigate("/chat", { state: { notification:data } })
    }else{
      navigate("/join-call", {state: {notification:data, mediaType: "video"}})
    }
  }

  const notify = (notification, data) =>  toast( 
  <div style={{cursor:"pointer"}} onClick={() => redirectFn(notification, data)}>
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
  },[]);

  onMessageListener().then(payload => {
    if(payload?.notification){
      notify(payload.notification, payload.data)
      setNotification({title: payload.notification.title, body: payload.notification.body})
      console.log(payload, "Hello notify");
    }else{
      notify(payload.data, payload.call)
      setNotification({title: payload.data.title, body: payload.data.body})
      console.log(payload, "Hello notify");
    }
    }).catch(err => console.log('failed: ', err));

  return (
    <>
      <Toaster/>
      <IndexRoutes />
    </>
  );
}

export default App;
