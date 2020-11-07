import React, { useState, useEffect, useRef } from 'react'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import { useSelector ,useDispatch} from 'react-redux'
import { socket } from '../App'
import CallComp from './CallComp'
import moment from 'moment'
import {setToast} from './ToastMsg'


function MessageSection({ roomid }) {

  const [messages, setMessages] = useState([])
  const [Members, setMembers] = useState([])
  const [receiver, setreceiver] = useState({})
  const [text, settext] = useState('')

const [isTyping, setisTyping] = useState(false)

  const { user,startreceivecall } = useSelector(state => state.auth)

  const [Call, setCall] = useState(false)
  const [activity, setActivity] = useState("")
  let dispatch = useDispatch()

  useEffect(() => {
    if(startreceivecall && startreceivecall.setReceivingCall === true){
        
      if(startreceivecall.setCaller._id === receiver._id){
          
          setCall(true)
      }
  }
  })


  let lastmsgref = useRef()

  useEffect(() => {
    if (lastmsgref.current) {
      lastmsgref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        //inline: "start"
      })
    }
  })



  useEffect(() => {
    roomid && axios.get('/conversation/find/' + roomid)
      .then(res => {
        setMessages(res.data.messages);
        setMembers(res.data.member)
        res.data.member.map(m=>{
          if(m._id !== user._id){
            setreceiver(m)
            
            
          }
        })

      })
  }, [roomid])



  let handleSend = () => {
    let newmessage = {
      body: text,

    }
    axios.patch('/conversation/sendtext/' + roomid, newmessage)
      .then(res => {
        setMessages(previous => previous.concat(res.data.messages[res.data.messages.length - 1]))
        //setMessages(res.data.messages)
        settext('')

      })
      .catch(err=>{
        //err.response.data
      })
  }


  useEffect(() => {
    if (socket) {


      socket.on('newconversation', data => {
        if (data) {
          if(data[data.length - 1].sender !== user._id){
            setMessages(previous => previous.concat(data[data.length - 1]))

          }
          
        }
      })
    }


  }, [socket])


  
  let handleCall = (calltype) => {
    if(receiver && receiver.status.current === "online"){
      setCall(true)
      setActivity(calltype)
    }else{
      setToast("User is offline","warning")
    }
    
    
  }

  


  useEffect(() => {
    

      socket && socket.on("istyping",data=>{
        setisTyping(data.istyping)
      })
}, [socket])



useEffect(() => {
  socket && receiver._id && socket.on("useronline",data=>{
      
      if(data && (receiver._id === data._id)){
        setreceiver(data)
      }
      
      
  })

  
}, [receiver])

var typing = false;
var timeout = undefined;

function timeoutFunction(){
  typing = false;
  socket.emit("typing",{to:roomid,istyping:false});
  //console.log('typing stopped');
}

let handleKey = (e)=>{
  
 if(e.keyCode === 13){
  handleSend()
 }else{
  if(typing == false) {
    typing = true
    //console.log('typing started');
    socket.emit("typing",{to:roomid,istyping:true});
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }
 }
}






  let messagessec
  messagessec = (<>
    <div className="message_body">


      {
        messages && messages.length > 0 ? messages.map((msg, index) => {
          const lastmessage = messages.length - 1 === index
          return <div key={index} ref={lastmessage ? lastmsgref : null} className={user && user._id === msg.sender ? "msg" : "msgleft"}>
            <div className="text">
              <p>{msg.body}</p>
              <span>{moment(msg.date).format("MMM D - hh:mm A")}</span>
            </div>
            <div className="msg_avatar">
              <Avatar alt="Remy Sharp" />
            </div>
          </div>
        }) : <p style={{ textAlign: "center" }}>No messages found</p>
      }



    </div>
    <div className="message_input">
      <div className="message_icon">
        <i className="far fa-laugh"></i>
        <i className="far fa-image"></i>
        <i className="fas fa-paperclip"></i>
      </div>

      <div className="input">
        <input value={text} onKeyDown={(e)=>{ handleKey(e)}} onChange={(e)=>settext(e.target.value)} type="text" placeholder="Type something..."></input>
        <i onClick={() => handleSend()} className="far fa-paper-plane"></i>
      </div>
    </div></>
  )



  return (
    <div className="msg_secs">
      <div className="msg_sec_head">
        <div className="avatar">
          <Avatar alt="Remy Sharp" />
        </div>
        <div className="text">
          <h6>{receiver && receiver.first} {receiver && receiver.last}</h6>
          <span>{isTyping ? "Typing..." :receiver.status && receiver.status.current === 'online' ? "online" : receiver && moment(receiver.status && receiver.status.lastonline).fromNow()}</span>
          
        </div>
        <div className="options">
          <span onClick={() => handleCall("videocall")}><i class="fas fa-video"></i></span>
          <span onClick={() => handleCall("audiocall")}><i class="fas fa-phone"></i></span>
          <span><i class="far fa-star"></i></span>
          <span><i class="fas fa-ellipsis-h"></i></span>

        </div>
      </div>
      

      {
        Call ? <CallComp activity={activity} roomid={roomid} receiver={receiver} /> : messagessec
      }


    </div>
  )
}

export default MessageSection
