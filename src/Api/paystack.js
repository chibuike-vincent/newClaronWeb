const axios = require('axios');

// const sk_key = "sk_test_b99f2f6df4585689836cad3d63d8b1d145789934";
const sk_key = "sk_live_10b0401836f2ba502abc0ee39c1264797d5e0213";

const userDetails = async (email) => {
    const key = await apiKey();
    const auth = localStorage.getItem('access-token');
    const response = await axios({
        method: 'GET',
        url: 'https://api.clarondoc.com/users/'+email,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        },
        options: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

    if(response.data.success){
        localStorage.setItem('user', JSON.stringify(response.data.userDetails))
        return response.data.userDetails
    }
}

export const initPayment = async(price, phone, network,email)=>{
    let user = await userDetails(email)
    console.log(user, "from payment")

    let response

    try{
        let res = await axios.default.post('https://api.paystack.co/charge', {
                "amount": price*100, 
                "email": `${user.email}`,
                "firstname": `${user.firstname}`,
                "lastname": `${user.lastname}`,
                "currency": "GHS",
                "plan": 'PLN_2lw4dvg8vkv2aro',
                "mobile_money": {
                    "phone" : `${phone}`,
                    "provider" : `${network.toUpperCase()}`
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${sk_key}`,
                }
            }
        )
        response = res.data
    }catch(e){
        try{
            response = e.response.data
        }catch(e){
            response = null
        }
    }

    return response
}



export const verOtp = async(tnx_ref, otp,email)=>{
    let user = await userDetails(email)

    let response

    try{
        let res = await axios.default.post('https://api.paystack.co/charge/submit_otp', {
                "reference": tnx_ref, 
                "otp": `${otp}`,
            },
            {
                headers: {
                    'Authorization': `Bearer ${sk_key}`,
                }
            }
        )
        response = res.data
    }catch(e){
        try{
            response = e.response.data
        }catch(e){
            response = null
        }
    }

    return response
}

export const cardPayment = async(card, amount,email)=>{
    let user = await userDetails(email)

    let response

    try{
        let res = await axios.default.post('https://api.paystack.co/charge', {
                "amount": amount*100, 
                "email": `${user.email}`,
                "pin": `${card.pin}`,
                "card": {
                    "cvv": card.cvv,
                    "number": card.number,
                    "expiry_month": card.month,
                    "expiry_year": card.year,
                },
                "custom_fields": [
                    {
                    "value": "Payment:"+(Math.floor(Math.random() * 100) + 1)+(Math.floor(Math.random() * 100) + 1)+(Math.floor(Math.random() * 100) + 1),
                    "display_name": "Payment entry --"+(Math.floor(Math.random() * 100) + 1),
                    "variable_name": "Payment entry _for"+(Math.floor(Math.random() * 100) + 1)
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${sk_key}`,
                  
                }
            }
        )
        response = res.data
    }catch(e){
        try{
            response = e.response.data
        }catch(e){
            response = null
        }
    }

    return response
}

export const Upgrade_sub = async(plan, end,email)=>{
    const key = await apiKey()
    const auth = await localStorage.getItem('access-token');
    let user = await userDetails(email)

    const response = await axios({
        method: 'PUT',
        url: `https://api.clarondoc.com/subscriptions/upgrade`,
        data: {
            email: user.email,
            plan: plan,
            end: end
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
            'x-api-key': key
        }
    })

    return response.data
}


export const apiKey = async (data) => {
    let key = await localStorage.getItem('api-key');

    if(key != null){
        return key
    }else{
        const response = await axios({
            method: 'POST',
            url: 'https://api.clarondoc.com/getAPIKey',
            data: {
                email: 'developer@clarondoc.com',
                password: 'Basket012Ball'
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })

        key = response.data.apiKey

        await localStorage.setItem('api-key', key)

        return key
    }
}