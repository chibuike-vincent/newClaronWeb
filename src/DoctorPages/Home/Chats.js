import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import './Home.css';
import DoctorLayout from '../../Pages/DoctorLayout';
import * as API from "../../Api/DoctorApi";
import { useSelector} from 'react-redux';
import {useNavigate } from "react-router-dom";
import {  formatDistance } from 'date-fns'
import doctor from '../../images/doc-1.jpg'
import UserModal from '../Home/UserModal'

function Chats() {
  const [chats, setChats] = useState([])
  const [loaded, setLoaded] = useState(false);
  const userData = useSelector((state) => state.user.value)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
                <div class="actions-doc-msg">
                   <div style={{width: "10%"}}>
                   <img src={item.avatar && item.avatar !== "undefined" ? item.avatar : doctor} alt="profileimage" className='chat-profile-img'/>
                   </div>
                   <div className='mesage-name-time-container'>
                       <div className='time-msg-wrapper'>
                         <span className='chat-name-p'>{item.name}</span>
                         <span>{ item.message.length > 50 ? item.message.substring(0, 50)+'...' : item.message }</span>
                        </div>
                       <p className='chat-time'>{formatDistance(new Date(item.time), new Date(), { addSuffix: true })}</p> 
                   </div>
                   
                   <div class="date-created-container">
                   
                   

                    
                     {/* <p> about {item.time} </p> */}
                  {/* <p>{moment(item.createDate).format("YYYY-MM-DD hh:mm A")}</p> */}
                </div>
                </div>

                
              </div>
            )) : <p style={{ textAlign: 'center' }}>No chat to display.</p>
          }
        </div>
        <button className='fixed-chat-icon'onClick={handleOpen} >Chat</button>
        <UserModal handleOpen={handleOpen} handleClose={handleClose} open={open} setOpen={setOpen} />
      </DoctorLayout>
    </>
  )
}

export default Chats

