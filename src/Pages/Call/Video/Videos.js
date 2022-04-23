import React from 'react'
import {
    AgoraVideoPlayer
  } from "agora-rtc-react";
  
function Videos(props) {
    const { users, tracks, guest } = props;
    return (
        <div >
        
            <div id="videos" >
          <AgoraVideoPlayer className='vid-main' videoTrack={tracks[1]} />
          {users.length > 0 ?
            users.map((user) => {
              if (user.videoTrack) {
                return (
                  <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} key={user.uid} />
                );
              } else return null;
            }) : (
              <p>{guest === "doctor" ? "Waiting for doctor to re-join..." : "Waiting for patient to join..."}</p>
            )
            }
        </div>
          
            
         
      </div>
    )
}

export default Videos
