import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall"
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import axios from "axios"
import {firebaseApp} from "../../../firebaseConfig"

const config = { 
  mode: "rtc", codec: "vp8",
};


const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();


const appId = "0742c8affa02429b9622956bac0d67d0"; //ENTER APP ID HERE

function App() {
    const navigate  = useNavigate()
  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState("");
  const [channelName, setChannelName] = useState("");
  const location = useLocation()
  const [picked, setpicked] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [trackType, setTrackType] = useState()
  const [client, setClient] = useState(null);
  const [clientInstance, setClientInstance] = useState(null);
  const [uid, setUid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [muteAudio, setMuteAudio] = useState(false);
  const [initializing, setInitializing] = useState(false)


  let countt_r = useRef(0)
  countt_r.current = 0;
  const email_r = useRef('')

useEffect(() => {
  setInCall(true)
  }, [])



  return (
    <div>
      {inCall ? (
          
        <VideoCall guest={"doctor"} setInCall={setInCall} appId={appId} token={JSON.parse(location.state.notification.call).token} channelName={JSON.parse(location.state.notification.call).channel} useClient={useClient} useMicrophoneAndCameraTracks={useMicrophoneAndCameraTracks} />
      ) : null
      }
    </div>
  );
}

export default App;
