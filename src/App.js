import "core-js/stable";
import './App.css';
import React,{useEffect} from 'react'
import IndexRoutes from './Routes/Index'
import {  useNavigate} from "react-router-dom"
// import { requestFirebaseNotificationPermission, onMessageListener } from "./firebaseConfig"
// import {ShowMessage, type} from "../src/Component/Toaster"


function App() {
  const navigate = useNavigate()
  const data =  JSON.parse(localStorage.getItem('user'));

  useEffect(()=>{
    data? navigate("userDashboard"): navigate("/")
  },[])
  // const [token, setToken] = useState("")

  // requestFirebaseNotificationPermission()
  // .then((firebaseToken) => {
  //   // eslint-disable-next-line no-console
  //   // console.log(firebaseToken);
  //   localStorage.setItem("firebaseToken", firebaseToken)
  //   setToken(firebaseToken)
  // })
  // .catch((err) => {
  //   return err;
  // });




// onMessageListener()
// .then((payload) => {
//   const { title, body } = payload.data;
//   ShowMessage(`${title}; ${body}`)
// })
// .catch((err) => {
//   ShowMessage(type.ERROR, JSON.stringify(err))
// });

  return (
    <IndexRoutes/>
  );
}

export default App;
