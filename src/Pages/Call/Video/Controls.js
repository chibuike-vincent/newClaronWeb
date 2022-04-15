import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneSlash, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { BsCameraVideoOff, BsCameraVideo } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";

export const Controls = (props) => {
  const { tracks, setStart, setInCall, useClient } = props;
  const client = useClient();
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const navigate = useNavigate();

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    navigate(-1);
  };

  return (
    <div className="video-controls" style={{ display: "flex" }}>
      <p className="video-controls-button" onClick={() => mute("audio")}>
        {trackState.audio ? (
          <FaVolumeMute size={50} className="mute-audio-control" />
        ) : (
          <FaVolumeUp size={50} className="mute-audio-control" />
        )}
      </p>
      <p className="video-controls-button" onClick={() => mute("video")}>
        {trackState.video ? (
          <BsCameraVideoOff size={50} className="mute-audio-control" />
        ) : (
          <BsCameraVideo size={50} className="mute-audio-control" />
        )}
      </p>
      <p onClick={() => leaveChannel()} className="leave-video-controls-button">
        <ImPhoneHangUp size={50} className="mute-audio-control" />
      </p>
    </div>
  );
};
