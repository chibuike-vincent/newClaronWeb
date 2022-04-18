import "core-js/stable";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import {configureStore} from '@reduxjs/toolkit'
import {Provider} from 'react-redux'
import userReducer from "../src/features/user"
import {persistStore,persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import toast, { Toaster } from 'react-hot-toast';
import {
  getTokenFn,
  onMessageListener
} from "./firebaseConfig";
import * as API from "./Api/DoctorApi";
import firebase from "./firebaseConfig"
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const notify = (notification) =>  toast( <div>
  <p><b>{notification?.title}</b></p>
  <p>{notification?.body}</p>
</div>);

const persistedReducer = persistReducer(persistConfig, userReducer)
const store = configureStore({
  reducer:{
    user:persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

})

let persistor = persistStore(store)


onMessageListener().then(payload => {
  notify(payload.notification)
  // setNotification({title: payload.notification.title, body: payload.notification.body})
  console.log(payload);
  }).catch(err => console.log('failed: ', err));



ReactDOM.render(
  <BrowserRouter>
  <Provider store={store}>
  <PersistGate  persistor={persistor}>
     <App />
    </PersistGate>
  </Provider>

</BrowserRouter>,
  document.getElementById('root')
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
