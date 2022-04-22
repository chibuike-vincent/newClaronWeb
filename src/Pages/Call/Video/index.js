import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
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
import axios from "axios";
import { firebaseApp } from "../../../firebaseConfig";

const config = {
  mode: "rtc",
  codec: "vp8",
};

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

// const appId = "66310665192842a28975ec67dfdd536b"; //ENTER APP ID HERE
// const token = "00666310665192842a28975ec67dfdd536bIAAPVs1q7EOWpSgfGA73SnUOwd6cMQV1VFg90F59VOS22ppjTicAAAAAEADbqsx09wb9YQEAAQAgXvxh";

const appId = "0742c8affa02429b9622956bac0d67d0"; //ENTER APP ID HERE

function App() {
  const navigate = useNavigate();
  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState("");
  const [channelName, setChannelName] = useState("");
  const location = useLocation();
  const [picked, setpicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [trackType, setTrackType] = useState();
  const [client, setClient] = useState(null);
  const [clientInstance, setClientInstance] = useState(null);
  const [uid, setUid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [muteAudio, setMuteAudio] = useState(false);
  const [initializing, setInitializing] = useState(false);

  let countt_r = useRef(0);
  countt_r.current = 0;
  const email_r = useRef("");

  const doctor = location.state.doctor;
  const patientEmail = location.state.patientEmail;

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get("https://api.clarondoc.com/urgent/token");

        let doc = await firebaseApp
          .firestore()
          .collection("normal_calls")
          .doc(patientEmail)
          .set({
            data: {
              time: new Date(),
              patient: patientEmail,
              doctor: doctor.email,
              caller: `${doctor.firstname} ${doctor.lastname}`,
              status: "started",
              end_now: "false",
              channel: res.data.RTCChannel,
              token: res.data.RTCAccessToken,
            },
          });

        firebaseApp
          .firestore()
          .collection("device_token")
          .doc(patientEmail)
          .get()
          .then((snapshot) => {
            console.log("Docs: ", snapshot.data());
            let data = snapshot.data();
            if (data.token != undefined) {
              axios
                .post(
                  "https://fcm.googleapis.com/fcm/send",
                  {
                    to: data.token,
                    notification: {
                      title: "Incoming Call Request",
                      sound: "ring.mp3",
                      body: "Click to open app",
                      subtitle: "You have a call request",
                      android_channel_id: "12345654321",
                    },
                    data: {
                      body: "call request",
                      title: "call request",
                      name: "hellworld",
                      call: {
                        name: doctor.email,
                        time: new Date(),
                        patient: patientEmail,
                        doctor: doctor.email,
                        caller: `${doctor.firstname} ${doctor.lastname}`,
                        status: "started",
                        end_now: "false",
                        channel: res.data.RTCChannel,
                        token: res.data.RTCAccessToken,
                      },
                    },
                    content_available: true,
                    priority: "high",
                  },
                  {
                    headers: {
                      Authorization: `key=AAAAEfHKSRA:APA91bH2lfkOJ8bZUGvMJo7cqdLYqk1m633KK7eu5pEaUF0J1ieFgpcWtYItCRftxVLSghEOZY5cQ8k9XfB_PVyfQeDHiC5ifuowqYUytsF0Nby4ANcZhVcFj6E0u5df2c4LItkjq4H2`,
                    },
                  }
                )
                .then((res) => {
                  console.log(res.data);
                });
            }
            // if(snapshot.docs.length > 0){
          });

        setToken(res.data.RTCAccessToken);
        setChannelName(res.data.RTCChannel);
        setInCall(true);
        // end
      } catch (e) {
        console.log("aa");
        console.log(e);
      }
    })();

    return () => {};
  }, []);

  return (
    <div>
      {inCall ? (
        <VideoCall
          setInCall={setInCall}
          appId={appId}
          token={token}
          channelName={channelName}
          useClient={useClient}
          useMicrophoneAndCameraTracks={useMicrophoneAndCameraTracks}
        />
      ) : null}
    </div>
  );
}

export default App;
