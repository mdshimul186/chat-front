import React,{useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NavbarComp from './components/NavbarComp';
import Home from './screen/Home';
import SignIn from './screen/Signin';
import SignUp from './screen/SignUp';

import axios from 'axios'
import jwt from 'jwt-decode'
import store from './store'
import ToastMsg from './components/ToastMsg'


import io from 'socket.io-client';
import ProtectedRoute from './components/ProtectedRoute'
import SingleRoom from './screen/SingleRoom';
import { useSelector, useDispatch } from "react-redux"




let token = localStorage.getItem('chat_key')
axios.defaults.baseURL = 'https://fbchat-back.herokuapp.com'
//axios.defaults.baseURL = 'http://localhost:5000'



if(token){
  
  let decoded = jwt(token)
  
  axios.defaults.headers.common['Authorization'] = token;
  store.dispatch({
    type: "SET_USER",
    payload: decoded
  })


 axios.get('/user/profile')
 .then(res=>{
    store.dispatch({
      type: 'SET_PROFILE',
      payload:res.data.user

    })
 })
  
}


export let socket
function App() {
  const { user, authenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    if (authenticated) {
      let loggedInSocket = user._id
      var options = {
        rememberUpgrade: true,
        transports: ['websocket'],
        secure: true,
        rejectUnauthorized: false
      }
      
      socket = io('https://fbchat-back.herokuapp.com', options)


      socket.emit('come_online', loggedInSocket)



      return () => {
        socket.disconnect()
      }
    }

  }, [authenticated])

  useEffect(() => {

    if (authenticated) {
      socket.on('new', data => {

        if (data) {
          dispatch({
            type: "NEW_MESSAGES",
            payload: data
          })

        }
        
      })


      socket.on('imonline',data=>{
        dispatch({
          type: "IMONLINE",
          payload: "online"
        })
      })

      
    }

  }, [authenticated])
  return (
    <>
    <ToastMsg />
    <NavbarComp />
    <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/room/:roomid" component={SingleRoom} />
          <Route path="/signin" component={SignIn}  />
          <Route path="/signup" component={SignUp}  />
          

      </Switch>
      </>
  );
}

export default App;
