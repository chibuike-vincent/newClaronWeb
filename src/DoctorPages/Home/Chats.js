import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
// import './Consultations.css';
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import moment from 'moment';
import { useSelector} from 'react-redux';
import {useNavigate } from "react-router-dom";


function Chats() {
  const [chats, setChats] = useState([])
  const [loaded, setLoaded] = useState(false);
  const userData = useSelector((state) => state.user.value)
  const navigate = useNavigate()



  useEffect(() => {
    const getChats = async () => {
      setLoaded(true);
      const res = await API.getChats();
      console.log(res, "chaat")
      if (res) {
        setChats(res);
        setLoaded(false);
      }
    };
    getChats();
  }, []);

 

  return (
    <>
      <DoctorLayout>

        <div class="container-notification-card">
         
          
          {
            chats.length === 0 && loaded ? (
              <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : chats && chats.length ? chats.map((item, index) => (
              <div className="reject-accept-container" onClick={()=>navigate("/ChatDoctor",{state:{userData: item}})}>
                <div class="actions-doc-claron" style={{width: "100%", display: "flex"}}>
                   <div style={{width: "10%"}}>
                   <img src={item.avatar} alt="profileimage" style={{width: "50%", height: "50%", borderRadius: "50%"}} />
                   </div>
                   <div>
                       <p>{item.name}</p>
                       <p>{item.message}</p>
                   </div>
                   
                   <div class="date-created-container">
                  <p> {moment(item.createDate).format("YYYY-MM-DD hh:mm A")}</p>
                </div>
                </div>

                
              </div>
            )) : <p style={{ textAlign: 'center' }}>No chat to display.</p>
          }
        </div>
      </DoctorLayout>
    </>
  )
}

export default Chats

