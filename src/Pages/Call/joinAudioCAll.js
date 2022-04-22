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

  console.log(JSON.parse(location.state.notification.call), "JSON.parse(location.state.notification.call)")


  useEffect(() => {

    const getClienInstance = async() => {
      let clientInstance = await Agora.createClient(config);
      const type = location.state.mediaType
      setTrackType(type)
      setClient(clientInstance);
      setClientInstance(clientInstance)
      join_now(JSON.parse(location.state.notification.call))
      
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


//   const startUrgent = async(email)=>{
//     setInitializing(true)
    
//     try{
      
//       let res = await axios.get('https://api.clarondoc.com/urgent/token')
     
//       let doc = await firebaseApp.firestore().collection('calls').doc(email).set({data: {
//         time: new Date(),
//         recipient: email,
//         caller: userDetail.email,
//         status: 'started',
//         channel: res.data.RTCChannel,
//         token: res.data.RTCAccessToken
//       }})
//       // call_id = (recp)
//       await join(res.data.RTCChannel,res.data.RTCAccessToken)
      
//     }catch(e){
//       console.log(e)
//       alert('Unable to start call', e.message)
//       setTimeout(()=>{
//         navigate(-1)
//       }, 3000)
//     }
//   }


  const join_now = async(data)=>{
    // start
    setrecp(data.doctor)
    email_r.current = data.doctor;

    setInCall(true)
    
    await join(data.channel,data.token)
    

    // firebaseApp.firestore().collection('calls').doc(email).onSnapshot(async snapshot=>{
    //    console.log(snapshot, "snapshotsnapshot")
    //         try {
    //           if(true){
    //             urgent = snapshot.data().data;
  
    //             console.log('count:'+ countt_r.current)
  
    //             if(urgent.status == 'ongoing'){
    //               setpicked(true);
    //               console.log('picked')
    //             }

    //             let tokenRes = await axios.get('https://api.clarondoc.com/urgent/token')

    //             firebaseApp.firestore().collection('device_token').doc(email).get().then(snapshot=>{
    //               console.log('Docs: ', snapshot.data())
    //               let data = snapshot.data();
    //               if(data.token != undefined){
                    
          
    //                 axios.post('https://fcm.googleapis.com/fcm/send', {
    //                   "to": data.token,
    //                   "notification": {
    //                     "title": "Urgent Care",
    //                     "sound": "ring.mp3",
    //                     "body": "Incoming calling call",
    //                     "subtitle": "You have a call request",
    //                     "android_channel_id": "12345654321",
    //                   },
    //                   "data": {
    //                       "body": "call request",
    //                       "title": "call request",
    //                       "name": "hellworld",
    //                       "call": {
    //                           "name": userDetail.email,
    //                           "time": new Date(),
    //                           "patient": userDetail.email,
    //                           "doctor": email,
    //                           "caller": `${userDetail.firstname} ${userDetail.lastname}`,
    //                           "status": 'started',
    //                           "end_now": 'false',
    //                           "channel": tokenRes.data.RTCChannel,
    //                           "token": tokenRes.data.RTCAccessToken
    //                       }
    //                   },
    //                   "content_available": true,
    //                   "priority": "high"
    //                 }, {
    //                   headers: {
    //                     Authorization : `key=AAAAEfHKSRA:APA91bH2lfkOJ8bZUGvMJo7cqdLYqk1m633KK7eu5pEaUF0J1ieFgpcWtYItCRftxVLSghEOZY5cQ8k9XfB_PVyfQeDHiC5ifuowqYUytsF0Nby4ANcZhVcFj6E0u5df2c4LItkjq4H2`
    //                   }
    //                 }).then((res)=>{
    //                   console.log(res.data)
    //                 })
    //               }
    //               // if(snapshot.docs.length > 0){
                    
                  
    //           })
               
                
  
    //             countt_r.current+=1;
    //             setInitializing(false)
    //             setOpen(false)
    //             setInCall(true)

    //         }              
    //         } catch (error) {
              
    //         }
          
    //   }, e => {
    //       console.log('Firebase Error: ', e)
    //   })

     
    // stop
  }

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