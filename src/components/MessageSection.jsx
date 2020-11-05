import React, { useState, useEffect, useRef } from 'react'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import { useSelector ,useDispatch} from 'react-redux'
import { socket } from '../App'
import CallComp from './CallComp'


function MessageSection({ roomid }) {

  const [messages, setMessages] = useState([])
  const [text, settext] = useState('')
  const { user,startreceivecall } = useSelector(state => state.auth)

  const [Call, setCall] = useState(false)
  const [activity, setActivity] = useState("")
  let dispatch = useDispatch()

 // useEffect(() => {
    //socket && socket.on("hey", (data) => {
      //setCall(true)
      //setReceivingCall(true);
      //ringtoneSound.play();
      //setCaller(data.from);
      //setCallerSignal(data.signal);
   // })
  //}, [socket])


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

      })
  }, [roomid])



  let handleSend = () => {
    let newmessage = {
      body: text,

    }
    axios.patch('/conversation/sendtext/' + roomid, newmessage)
      .then(res => {
        //setMessages(res.data.messages)
        settext('')

      })
  }


  useEffect(() => {
    if (socket) {


      socket.on('newconversation', data => {
        if (data) {

          setMessages(previous => previous.concat(data[data.length - 1]))
          settext('')
        }
      })
    }


  }, [socket])


  
  let handleCall = () => {
    setCall(true)
    setActivity("videocall")
    
  }

  


  useEffect(() => {
    socket && socket.on("hey", (data) => {
      setCall(true)
      dispatch({
        type:"START_RECEIVE",
        payload:{setReceivingCall:true,setCaller:data.from,setCallerSignal:data.signal}
      })
        //setReceivingCall(true);
        //ringtoneSound.play();
        //setCaller(data.from);
        //setCallerSignal(data.signal);
      })
}, [socket])

  let messagessec
  messagessec = (<>
    <div className="message_body">


      {
        messages && messages.length > 0 ? messages.map((msg, index) => {
          const lastmessage = messages.length - 1 === index
          return <div key={index} ref={lastmessage ? lastmsgref : null} className={user && user._id === msg.sender ? "msg" : "msgleft"}>
            <div className="text">
              <p>{msg.body}</p>
              <span>Oct 18 - 10:32 PM</span>
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
        <input value={text} onChange={(e) => settext(e.target.value)} type="text" placeholder="Type something..."></input>
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
          <h6>User Name</h6>
          <span>Last online 11 days ago</span>
        </div>
        <div className="options">
          <span onClick={() => handleCall()}><i class="fas fa-video"></i></span>
          <span><i class="fas fa-phone"></i></span>
          <span><i class="far fa-star"></i></span>
          <span><i class="fas fa-ellipsis-h"></i></span>

        </div>
      </div>
      

      {
        Call ? <CallComp activity={activity} roomid={roomid} /> : messagessec
      }


    </div>
  )
}

export default MessageSection
