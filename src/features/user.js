import {createSlice} from "@reduxjs/toolkit"
import moment from 'moment';
const userSlice = createSlice({
    name:"user",
    initialState:{
        value:{},
        cart: [],
        notifications: [],
        patients:[],
        schedule:null
    },
    reducers:{
        LOGIN: (state,action)=>{
            state.value = action.payload
        },

        USERS:(state,action)=>{
            // state.patients.push(action.payload)
            state.patients = action.payload
        },

        SCHEDULE:(state,action)=>{
            state.schedule = action.payload
            if(action.payload.filter === ""){
                state.schedule = action.payload.res.filter(i => moment(i.scheduledFor).format("YYYY-MM-DD") === moment(Date.now()).format("YYYY-MM-DD"))
              }else{
                state.schedule = action.payload.res.filter(sch => moment(sch.scheduledFor).format("YYYY-MM-DD") === moment(action.payload.filter).format("YYYY-MM-DD"))
                
              }
        },
        
        LOGOUT:(state)=>{
            state.value ={}
        },
        UPDATE: (state,action)=>{
            state.value.avatar = action.payload
        },

        UPDATESUB: (state,action)=>{
            state.value.subscription = action.payload
        },

        UPDATEAVAILABILITY: (state,action)=>{
            state.value.availability = action.payload
        },

        UPDATEUSERINFO: (state,action)=>{
            state.value = action.payload
        },
        UPDATECARTINFO: (state,action)=>{
            state.cart.push(action.payload)
        },

        CLEARCARTINFO: (state,action)=>{
            state.cart = []
        },
        UPDATECARTQUANTITY: (state,action)=>{
            state.cart[state.cart.indexOf(state.cart.filter(d => d.drugId === action.payload.drugId)[0])].quantity += 1
            state.cart[state.cart.indexOf(state.cart.filter(d => d.drugId === action.payload.drugId)[0])].total +=  action.payload.drug.unitprice
            
        },
        REMOVEFROMCART: (state,action)=>{
            
            for(let i = 0; i < state.cart.length; i++){
                console.log(state.cart[i], "pay")
                if(state.cart[i].drugId === action.payload.id && state.cart[i].quantity > 1 || state.cart[i].drugId === action.payload.drugId && state.cart[i].quantity > 1){
                    state.cart[i].quantity -= 1
                    state.cart[i].total -= action.payload.drug.unitprice
                }else if(state.cart[i].drugId === action.payload.id && state.cart[i].quantity === 1 || state.cart[i].drugId === action.payload.drugId && state.cart[i].quantity === 1){
                    state.cart.splice(i, 1)
                }
            }
        },

        NOTIFICATIONS: (state,action)=>{
            state.notifications = action.payload
        }
    }
})
export const {SCHEDULE,UPDATEAVAILABILITY,LOGIN,LOGOUT,UPDATE,UPDATESUB,UPDATEUSERINFO,UPDATECARTINFO,REMOVEFROMCART, UPDATECARTQUANTITY, NOTIFICATIONS,CLEARCARTINFO,USERS} = userSlice.actions
export default userSlice.reducer;