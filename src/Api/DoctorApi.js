// import firebase from 'firebase/app';
import {firebaseApp} from '../firebaseConfig';
const axios = require('axios').default
let base_url = 'https://api.clarondoc.com'
//authenticate doctors into the app
export const getuserDetails = async () => {
    const email = await localStorage.getItem('_email')
    const auth = await localStorage.getItem('_accesstoken')
    let key = await localStorage.getItem('_apikey')

    const response = await axios({
        method: 'GET',
        url: 'https://api.clarondoc.com/physicians/'+email,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        },
        options: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // console.log(response.data.physicianDetails)
    if(response.data.success){
        await localStorage.setItem('user', JSON.stringify(response.data.physicianDetails))
    }

    return response.data;
}
//authenticate doctors into the app
export const userDetails = async (email, key, auth) => {
    const response = await axios({
        method: 'GET',
        url: 'https://api.clarondoc.com/physicians/'+email,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        },
        options: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    console.log(response.data.physicianDetails)
    if(response.data.success){
        await localStorage.setItem('user', JSON.stringify(response.data.physicianDetails))
    }
}

export const update_physician = async(data)=>{
    let key = await localStorage.getItem('_apikey')
    let auth = await localStorage.getItem('_accesstoken')
    const response = await axios.put('https://api.clarondoc.com/physicians/update',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
                'x-api-key': key
            },
            options: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    return console.log(response.data)
}


export const update_physician_image = async(data)=>{
    let key = await localStorage.getItem('_apikey')
    let auth = await localStorage.getItem('_accesstoken')
    const response = await axios.put('https://api.clarondoc.com/physicians/picture',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth}`,
                'x-api-key': key
            },
            options: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    return console.log(response.data)
}


export const login = async (email, password)=>{

    let response

    try{
        let key = await getApiKey()
        console.log(key, "ddddd")
        let res = await axios.post(`${base_url}/login?type=doctor`, {
            email,
            password
        },
        {
            headers:{
                'x-api-key': key
            }
        })

        response = res.data
        await localStorage.setItem('_email', email)
        await localStorage.setItem('_accesstoken', response.accessToken)
        await userDetails(email, key, response.accessToken)
    }catch(e){
        response = {
            success: false,
            message: e.response.data.message
        }
    }

    return response

}

// send message to patient
export const sendMessage = async (data) =>{
    try{

        let key =    localStorage.getItem('_apikey')
        let token =  localStorage.getItem('_accesstoken')
        let res = await axios.post(`${base_url}/chats`, data, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })

        return res.data.success

    }catch(e){
        console.log(e)
        return false
    }
}

// respond to consultation request
export const respondRequest = async (response, id)=>{
    try{
        console.log('reach for logger: '+response+id)
        let key = await localStorage.getItem('_apikey')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.post(`${base_url}/physicians/consultations/confirm`, {
            availability: response,
            status: response,
            id
        }, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(res.data);
        return res.data;
    }catch(e){
        console.log(e.response.data);
        return false
    }
}

// get all chats the doctor has
export const getChats = async ()=>{

    let data = []

    try{
        let key = await localStorage.getItem('_apikey')
        let email = await localStorage.getItem('_email')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.get(`${base_url}/chats/conversations/all/${email}`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        res.data.chats.forEach(chat=>{

            let c

            if(chat.from.email == email){
                
                c = {
                    name: `${chat.to.firstname} ${chat.to.lastname}`,
                    message: chat.message,
                    time: chat.createDate,
                    avatar: chat.to.avatar,
                    email: chat.to.email,
                    id: chat.id
                }
            }else{
                c = {
                    name: `${chat.from.firstname} ${chat.from.lastname}`,
                    message: chat.message,
                    time: chat.createDate,
                    avatar: chat.from.avatar,
                    email: chat.from.email,
                    id: chat.id
                }
            }

            data.push(c)
        })
    }catch(e){
        console.log('chat fetch failed: ', e.response.data)
    }

    return data

}

// get patients
export const getPatients = async (query)=>{
    let data = []
    let s = query
    if(query == undefined){
        s = '%20'
    }

    try{
        let query = ' '
        let key = await localStorage.getItem('_apikey')
        let token = await localStorage.getItem('_accesstoken')
        
        let res = await axios.get(`${base_url}/search/users/${s}`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        data = res.data.users
    }catch(e){
        console.log('patients fetch failed: ', e)
    }

    return data
}

// get messages from selected chat
export const getConversation = async (to)=>{

    let data = []

    try{
        let key = await localStorage.getItem('_apikey')
        let email = await localStorage.getItem('_email')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.get(`${base_url}/chats/conversations/between/${email}/and/${to}`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        data = res.data.chats
    }catch(e){
        console.log('conversation fetch failed: ', e)
    }

    return data
}


// fetch notifications
export const getNotifications = async ()=>{

    let data = []

    try{
        let key = await localStorage.getItem('_apikey')
        let email = await localStorage.getItem('_email')
        console.log(email)
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.get(`${base_url}/notifications/users/${email}`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        data = res.data.notifications
        // console.log(data)
    }catch(e){
        // console.log(e)
        data = []
    }

    return data

}

// get doctor's schedule
export const getSchedule = async ()=>{

    let data = []

    try{
        let key = await localStorage.getItem('_apikey')
        let email = await localStorage.getItem('_email')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.get(`${base_url}/requests/physicians/consultations/physicians/${email}`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        data = res.data.requests
    }catch(e){
        data = []
    }

    return data

}

// change status to online, offline or in meeting
export const changeStatus = async (status)=>{
    try{
        let key = await localStorage.getItem('_apikey')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.put(`${base_url}/physicians/update/availability`, {
            availability: status
        }, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data.success
    }catch(e){
        return false
    }
}

// update fcm token for push notifications
export const updateFCMToken = async (fcm)=>{
    console.log(fcm, "fcm")
 let data ;
    try{
        let key = await localStorage.getItem('_apikey')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.post(`${base_url}/notifications/subscribe`, {
            token: fcm
        }, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(res.data)
        data = res.data
    }catch(e){
        console.log(e)
        data = null
    }

    return data

}

// get api key for authorization to all endpoints
export const getApiKey = async ()=>{

    try{
        let key = await localStorage.getItem('_apikey')

        if(key == null){
            let res = await axios.post(`${base_url}/getAPIKey`, {
                email: 'developer@clarondoc.com',
                password: 'Basket012Ball'
            })
            key = res.data.apiKey
            localStorage.setItem('_apikey', key)
            return key
        }else {
            return key
        }
    }catch(e){
        console.log('api key fetch failed: ', e)
    }

}


// added function
export const sendRequestLab = async (recipient, lab) => {
    const email = await localStorage.getItem('_email')
    const auth = await localStorage.getItem('_accesstoken')
    let key = await localStorage.getItem('_apikey')

    const data = {
        sender: email,
        recipient: recipient,
        labs: lab,
        type: 'Lab',
        data: lab
    }

    const response = await axios({
        method: 'POST',
        url: 'https://api.clarondoc.com/prescription/labs',
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        },
        options: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // console.log(response.data.physicianDetails)
    // if(response.data.success){
    // }

    await sendToFireBase(data)

    return response.data;
}

export const getDrugs = async ()=>{
    let data = []

    try{
        let query = ' '
        let key = await localStorage.getItem('_apikey')
        let token = await localStorage.getItem('_accesstoken')
        let res = await axios.get(`${base_url}/drugs`, {
            headers: {
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            }
        })
        data = res.data.drugs
    }catch(e){
        console.log('patients fetch failed: ', e)
    }

    return data
}

export const sendRequestDrug = async (recipient, lab) => {
    const email = await localStorage.getItem('_email')
    const auth = await localStorage.getItem('_accesstoken')
    let key = await localStorage.getItem('_apikey')

    const data = {
        sender: email,
        recipient: recipient,
        drugs: lab,
        type: 'Drug',
        data: lab
    }

    const response = await axios({
        method: 'POST',
        url: 'https://api.clarondoc.com/prescription/drugs',
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        },
        options: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // console.log(response.data.physicianDetails)
    // if(response.data.success){
    // }

    await sendToFireBase(data)

    return response.data;
}

const sendToFireBase = async (data)=>{
    // copied from server
    const productList = data.data;
    const title = data.type === "Drug" ? `Drug prescription` : `Lab prescription`;
    let formattedMessage = `${data.type === "Drug" ? 'Drug' : 'Lab'} prescription \n`;
    productList.map((item, i) => {
        let itemStr = `${i + 1}. ${item.name} - ${item.unitprice ? (item.unitprice * item.qty) : item.charges} ${item.qty ? ' - ' + item.qty + ' quantity ' : ''} \n`
        formattedMessage = formattedMessage + itemStr;
    })

    // send to firebase
    let sen = {
        message: formattedMessage.trim(),
        recipient: data.recipient,
        attachment: '',
        file_type: '',
        sender: data.sender,
        symptoms: [],
        createDate: (new Date()).toString(),
        timeStamp: Date.now()
    };

    // API.sendMessage(sen)

    await firebaseApp.firestore().collection('newSMessages').doc(chat_code(data.recipient, data.sender)).collection('messages').add(sen);

}

const chat_code = (patient, doctor)=>{
    return patient+'-'+doctor;
}