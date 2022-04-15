import React, { useState, useEffect, useRef } from 'react'
import './Chat.css'
import { FaTelegramPlane, FaArrowAltCircleUp } from "react-icons/fa";
import { TiAttachment } from "react-icons/ti";
import MainLayout from '../MainLayout';
import { useLocation } from 'react-router-dom'
import { sendMessage } from '../../Api/chats';
import { userDetails } from '../../Api/Auth'
// import firebase from 'firebase';
import firebase from "../../firebaseConfig"
import loader from '../../images/spinner.gif'
// import { formatRelative } from 'date-fns'
// import moment from 'moment';

// let interval

function Chat() {
    // if (!firebase.apps.length) {
    //     firebase.initializeApp({
    //         apiKey: "AIzaSyA07_A7At-J9Mu6NMXBpoLVYcrKWR3ezy4",
    //         authDomain: "fcm-notify-db9b8.firebaseapp.com",
    //         databaseURL: "https://fcm-notify-db9b8.firebaseio.com",
    //         projectId: "fcm-notify-db9b8",
    //         storageBucket: "fcm-notify-db9b8.appspot.com",
    //         messagingSenderId: "77071010064",
    //         appId: "1:77071010064:web:e693b1fa22167a00e27d95",
    //         measurementId: "G-VWCS7XBQC3"
    //     });
    // } else {
    //     firebase.app(); // if already initialized, use that one
    // }


    const { state } = useLocation();
    const { age } = state;
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

    const handleImageAsFile = async (e) => {
        setloading(true)
        const image = e.target.files[0]
        await firebase.storage().ref(`new-attaches/${image.name}`).put(image);

        const url = await firebase.storage().ref(`new-attaches`).child(image.name).getDownloadURL()


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
                recipient: state.doctor.email,
                attachment: image,
                file_type: type,
                sender: user.email,
                symptoms: [],
                createDate: (new Date()).toLocaleString(),
                timeStamp: Date.now()
            };

            sendMessage(sen)

            await firebase.firestore().collection('newSMessages').doc(chat_code(user.email, state.doctor.email)).collection('messages').add(sen);

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
        firebase.firestore().collection('newSMessages').doc(chat_code(data.email, state.doctor.email)).collection('messages').orderBy('timeStamp', 'asc').onSnapshot(snapshot => {
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
            let account = localStorage.getItem("user")
            let token = localStorage.getItem('access-token')
            let key = localStorage.getItem('api-key');
            let ema = localStorage.getItem('email');
            setemail(ema)
            emailR.current = ema;
            userDetails(JSON.parse(account).email, key, token).then(data => {
                setUser(data)
                loadfirebasechat(data)
            })
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

    return (
        <MainLayout>

            <div className="chart-cantaner">

                <h4 className="dr-chat-detail">You are Chatting with <span>Dr {state.doctor.firstname} {age}</span></h4>

                {conversation.length > 0 ? conversation.map(chat => {
                    return (
                        <>
                            <div key={chat.sender} className={`${chat.sender === user.email ? 'chat-msg-doc' : 'chat-msg-user'}`}>
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
        </MainLayout>
    )
}

export default Chat
