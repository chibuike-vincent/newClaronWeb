import React, { useEffect, useState, useRef } from "react";
import axios from "axios"
import './calls.css'
import './General.css'
import { FaPhoneSlash, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import image from '../../images/logo.png'
import { FaPhone } from "react-icons/fa";
import Agora from "agora-rtc-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import {firebaseApp} from "../../firebaseConfig"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const config = { 
  mode: "rtc", codec: "vp8",
};

const appId = "0742c8affa02429b9622956bac0d67d0"; //ENTER APP ID HERE

let _engine
let call_id
let urgent
let countt = 0
let email = 'samuel.anakwa@claronhealth.com';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Index() {
  const navigate  = useNavigate()
  const [inCall, setInCall] = useState(false);
  const [recp, setrecp] = useState(email)
  const [picked, setpicked] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [trackType, setTrackType] = useState()
  const location = useLocation()
  const [client, setClient] = useState(null);
  const [clientInstance, setClientInstance] = useState(null);
  const [uid, setUid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [muteAudio, setMuteAudio] = useState(false);
  const [initializing, setInitializing] = useState(false)
  const [doctor, setDoctor] = useState("")
  const [userEmail, setUserEmail] = useState("")

  let countt_r = useRef(0)
  countt_r.current = 0;
  const email_r = useRef('')

 

  useEffect(() => {

    const getClienInstance = async() => {
      let clientInstance = await Agora.createClient(config);
      const type = location.state.mediaType
      setTrackType(type)
      setClient(clientInstance);
      setClientInstance(clientInstance)
      setInCall(true)
    
    await join(JSON.parse(location.state.notification.call).channel, JSON.parse(location.state.notification.call).token)
      
    }
    getClienInstance()
    
  }, [])

  let user = localStorage.getItem('user')
  const userDetail = JSON.parse(user)

  const join = async(channelName, token) => {
      console.log(token, channelName, "token, channelName")
    if(client){
    clientInstance.init(appId, () => {
      clientInstance.join(token, channelName, null, (uid) => {
        let localStreamInstance = Agora.createStream({
          streamID: uid,
          audio: true,
          video: false,
          screen: false
        });
        setLocalStream(localStreamInstance);
        localStreamInstance.init(() => {
          clientInstance.publish(localStreamInstance);
          localStreamInstance.play("local_stream");
        });

        clientInstance.on("stream-added", (evt) => {
          let remoteStream = evt.stream;
          const id = remoteStream.getId();
          client.subscribe(remoteStream);
        });

        clientInstance.on("stream-subscribed", (evt) => {
          let remoteStream = evt.stream;
          remoteStream.play("remote_stream");
        });
      });
    });
  }
  };


  const mute = async () => {
    if(muteAudio){
      await localStream.unmuteAudio()
      setMuteAudio(false)
    }else {
      await localStream.muteAudio()
      setMuteAudio(true)
    }
    
    
  };

  const leaveChannel = async () => {
    await localStream.close()
    await client.leave();
    setInCall(false);
    navigate(-1)
  };

  const handleGoBack = () => {
    handleClose()
    navigate(-1)
  }


  return (
    <div className="out-container-call">
         
     
      {inCall ? (
         <>
         <div className="controls">
         <div class="claron-audio-logo-container">
           
               <h2>Urgents Care</h2>
           
          
           <img className='cal-logo-img' src={image} alt="" />
         </div>
         <div id="local_stream"></div>
          <div id="remote_stream"></div>
           <div class="inner-control">
           <p className={trackState.audio ? "on" : ""}
             onClick={() => mute("audio")}>
   
             {!muteAudio ? <button className='mute'><FaVolumeMute className='mute-audio-control' />Mute</button> : <button className='mute'><FaVolumeUp className='mute-audio-control' />Unmute</button>}
   
   
           </p>
           {
             trackType === "audio" ? null : (
               <p className={trackState.video ? "on" : ""}
                 onClick={() => mute("video")}>
                 {trackState.video ? "MuteVideo" : "UnmuteVideo"}
               </p>
             )
           }
   
           {<button className='leav' onClick={() => leaveChannel()}><FaPhoneSlash className='leav-icon' />End Call</button>}
           </div>
       </div>
       </>
        
      ) : null
      }
    </div>
  );
}

export default Index;