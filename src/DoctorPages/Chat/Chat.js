import React,{useState,useRef,useEffect} from 'react'
import './Chat.css'
import { userDetails } from '../../Api/DoctorApi'
import DoctorLayout from '../../Pages/DoctorLayout'
// import firebase from 'firebase';
import {firebaseApp} from "../../firebaseConfig"
import { useLocation } from 'react-router-dom'
import { FaTelegramPlane} from "react-icons/fa";
import loader from '../../images/spinner.gif'
import { TiAttachment } from "react-icons/ti";
import { useSelector, useDispatch } from 'react-redux'
import * as API from '../../Api/DoctorApi';
import axios from "axios"

function Chat() {
    const [email, setemail] = useState('')
    const [user, setUser] = useState({})
    const [message, setmessage] = useState('')
    const [loading, setloading] = useState(false)
    const [conversation, setconversation] = useState([])
    const [error, seterror] = useState()
    const [sendingNow, setsendingNow] = useState(false)
    const [image, setImage] = useState("")
    const emailR = useRef(null);
    const messagesEndRef = useRef(null)
	const userData = useSelector((state) => state.user.value)
	const location = useLocation();

    const recipientEmail = location.state.userData === undefined ? JSON.parse(location.state.notification.message).patient : location.state.userData.email

    const handleImageAsFile = async (e) => {
        setloading(true)
        const image = e.target.files[0]
        await firebaseApp.storage().ref(`new-attaches/${image.name}`).put(image);

        const url = await firebaseApp.storage().ref(`new-attaches`).child(image.name).getDownloadURL()


        if (url) {
            setImage(url)
            setloading(false)
        }
    }
    const chat_code = (patient, doctor) => {
        return patient + '-' + doctor;
    }
    // FUNCTION FOR SENDING MESSAGE
    const send = async () => {
        let type = '';
        // let url ='';
        var messag = message;
        if (message.length === 0) {
            messag = 'Media Attachment';
        }
        setsendingNow(true)
        try {
            let sen = {
                message: messag.trim(),
                recipient: recipientEmail,
                attachment: image,
                file_type: type,
                sender: userData.email,
                symptoms: [],
                createDate: (new Date()).toLocaleString(),
                timeStamp: Date.now()
            };

			API.sendMessage(sen)

            console.log(recipientEmail, "location.state.userData.emaillocation.state.userData.emaillocation.state.userData.email")
           
            await firebaseApp.firestore().collection('newSMessages').doc(chat_code(recipientEmail, userData.email)).collection('messages').add(sen);

            firebaseApp.firestore().collection('device_token').doc(recipientEmail).get().then(snapshot=>{
                console.log('Docs: ', snapshot.data())
                let data = snapshot.data();
                if(data.token != undefined){
                  
        
                  axios.post('https://fcm.googleapis.com/fcm/send', {
                    "to": data.token,
                    "notification": {
                      "title": `New message from Dr. ${userData.firstname} ${userData.lastname}`,
                      "sound": "beep.mp3",
                      "body": "Click to open",
                      "subtitle": "You have a new message",
                      "android_channel_id": "12345654321",
                    },
                    "data": {
                        "body": "Chat message",
                        "title": "Chat messahe",
                        "name": "From Doc",
                        "message": {
                            "name": userData.email,
                            "time": new Date(),
                            "patient": recipientEmail,
                            "doctor": userData.email,
                            "sender": `${userData.firstname} ${userData.lastname}`,
                            "status": 'sent',
                        }
                    },
                    "content_available": true,
                    "priority": "high"
                  }, {
                    headers: {
                      Authorization : `key=AAAAEfHKSRA:APA91bH2lfkOJ8bZUGvMJo7cqdLYqk1m633KK7eu5pEaUF0J1ieFgpcWtYItCRftxVLSghEOZY5cQ8k9XfB_PVyfQeDHiC5ifuowqYUytsF0Nby4ANcZhVcFj6E0u5df2c4LItkjq4H2`
                    }
                  }).then((res)=>{
                    console.log(res.data)
                  })
                }
                // if(snapshot.docs.length > 0){
                  
                
            })
            if (true) {
                setmessage('')
                // setattachment(null)
                setImage("")
                // alert('file uploaded successfully')
            } else {
                seterror('There was an error sending your message')
            }

        } catch (e) {
            console.log('message sending failed: ', e)
        }
        setsendingNow(false)
    }

    // LOAD FIREBASE CHAT FUNCTION
    const loadfirebasechat = async (data) => {
        firebaseApp.firestore().collection('newSMessages').doc(chat_code(recipientEmail, userData.email)).collection('messages').orderBy('timeStamp', 'asc').onSnapshot(snapshot => {
            var r = snapshot.docs.map(doc => {
                return (doc.data())
            });
            setconversation(r)
            setloading(false)
        }, error => {
            console.log(error)
        });
    }

    useEffect(() => {
        (async () => {
            await loadfirebasechat()
        })()
    }, [])


    // THIS USEEFFECT TRIGGER WHEN THEIR IS A NEW MESSAGE
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, [conversation]);

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

	// console.log(conversation,'yyy')
    return (
		<DoctorLayout>
<div className="chart-cantaner">

<h4 className="dr-chat-detail">You are Chatting with <span>{location.state.userData === undefined ? JSON.parse(location.state.notification.message).sender : location.state.userData.firstname}</span>  </h4>

{conversation.length > 0 ? conversation.map(chat => {
	return (
		<>
			<div key={chat.sender} className={`${chat.sender === userData.email ? 'chat-msg-doc' : 'chat-msg-user'}`}>
				{chat.message && chat.attachment === "" ? (<p className='chat-msg'>{chat.message}</p>) : chat.message && chat.attachment != "" ?
					<div>
						<img src={chat.attachment} alt="" className='msg-img' />
					</div> : null
				}
				{/* <p>{chat.message ? chat.message : 'loading chat'}</p> */}
				<p className='created-date'> about {timeSince(new Date(chat.createDate))} ago</p>
			</div>

			<div ref={messagesEndRef} />

		</>
	)
}) : 'No chat history'}
<div className='chat-input-wrapper'>
{loading? '':(<div className='img_upload_user' style={{display: image ? "block" : "none"}}>
	{image !=="" ? <img src={image} alt="" className='upload-image-attachment'/> : ''}
</div>)}
	<textarea type="text" placeholder='Enter your message' 
	value={message} onChange={(e) => setmessage(e.target.value)}
	style={{display: image || loading ? "none" : "block"}}
	className='chat-box-message-input-c'>
	</textarea>
	<div className='actions-wrapper'>
	{loading && image == ""? <img className='loader-img-file' src={loader} alt=""/> :(<><input type="file" onChange={handleImageAsFile} id="file-input" />
	<FaTelegramPlane onClick={send} className="send-icon" /></>)}

		{loading || image !==""? '': <label for="file-input" className="send-icon-upload-file">
			<TiAttachment onChange={handleImageAsFile}/>
		</label>}
		<input id="file-input" type="file" />
	</div>

</div>

</div>
		</DoctorLayout>
    )
}

export default Chat
