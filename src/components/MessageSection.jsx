import React, { useState, useEffect, useRef } from 'react'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { socket } from '../App'
import CallComp from './CallComp'
import moment from 'moment'
import { setToast } from './ToastMsg'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';


function MessageSection({ roomid }) {

  const [messages, setMessages] = useState([])
  const [Members, setMembers] = useState([])
  const [receiver, setreceiver] = useState({})
  const [text, settext] = useState('')

  const [isTyping, setisTyping] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [imgsending, setimgsending] = useState(false)
  const [isFavourite, setisFavourite] = useState(false)

  const { user, startreceivecall,profile } = useSelector(state => state.auth)

  const [Call, setCall] = useState(false)
  const [activity, setActivity] = useState("")
  let dispatch = useDispatch()


  //check if there is any incoming call in redux state
  useEffect(() => {
    if (startreceivecall && startreceivecall.setReceivingCall === true) {

      if (startreceivecall.setCaller._id === receiver._id) {
        setCall(true)
      }
    }
  })


  //check if this is a favourite contact
  useEffect(() => {
    
    if(profile && profile.favourites){
      if(profile.favourites.length>0){
        profile.favourites.map(f=>{
          if(f._id === receiver._id){
            setisFavourite(true)
           
          }else if(f._id !== receiver._id){
            setisFavourite(false)
          }
        })
      }else{
        setisFavourite(false)
      }
      
    } 
   
  },[profile,receiver])



  //scroll to last message automatically
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



  //find all conversation accrording to room id
  useEffect(() => {
    roomid && axios.get('/conversation/find/' + roomid)
      .then(res => {
        setMessages(res.data.messages);
        setMembers(res.data.member)
        res.data.member.map(m => {
          if (m._id !== user._id) {
            setreceiver(m)


          }
        })

      })
  }, [roomid])


//send message usuing api
  let handleSend = () => {
    let newmessage = {
      body: text,

    }
    axios.patch('/conversation/sendtext/' + roomid, newmessage)
      .then(res => {
        setMessages(previous => previous.concat(res.data.messages[res.data.messages.length - 1]))
        //setMessages(res.data.messages)
        settext('')
        setShowEmoji(false)

      })
      .catch(err => {
        //err.response.data
      })
  }


  //send image using api
  let handleImage = (img) => {
    setimgsending(true)
    if (img) {
      let formData = new FormData()
      formData.append('image', img)
      axios.patch('/conversation/image/' + roomid, formData)
        .then(res => {
          setMessages(previous => previous.concat(res.data.messages[res.data.messages.length - 1]))
          settext('')
          setShowEmoji(false)
          setimgsending(false)
        })
    }

  }

  //set or remove favourite contact api
  let handleFavourite=(id)=>{
    axios.put('/user/favourite/'+id)
    .then(res=>{
     
      dispatch({
        type: 'SET_PROFILE',
        payload:res.data.user
  
      })
    })
  }


  //check if here is any new message from socket
  useEffect(() => {
    if (socket) {
      socket.on('newconversation', data => {
        if (data) {
          if (data[data.length - 1].sender._id !== user._id) {
            setMessages(previous => previous.concat(data[data.length - 1]))
          }

        }
      })
    }


  }, [socket])


//call user
  let handleCall = (calltype) => {
    if (receiver && receiver.status.current === "online") {
      setCall(true)
      setActivity(calltype)
    } else {
      setToast("User is offline", "warning")
    }


  }



//check if user is typing or not
  useEffect(() => {


    socket && socket.on("istyping", data => {
      setisTyping(data.istyping)
    })
  }, [socket])


// check if user online or not
  useEffect(() => {
    socket && receiver._id && socket.on("useronline", data => {

      if (data && (receiver._id === data._id)) {
        setreceiver(data)
      }


    })


  }, [receiver])

  var typing = false;
  var timeout = undefined;

  function timeoutFunction() {
    typing = false;
    socket.emit("typing", { to: roomid, istyping: false });
    //console.log('typing stopped');
  }

  let handleKey = (e) => {

    if (e.keyCode === 13) {
      handleSend()
    } else {
      if (typing == false) {
        typing = true
        //console.log('typing started');
        socket.emit("typing", { to: roomid, istyping: true });
        timeout = setTimeout(timeoutFunction, 5000);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
      }
    }
  }




  let addEmoji = e => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)

    settext(text + emoji)
  }


  let renderImage = (url) => {
    return (
      <a target='_blank' href={url}><img style={{ objectFit: "contain", width: "200px", display: "block", minHeight: "100px" }} src={url}></img></a>
    )
  }


//main message section
  let messagessec
  messagessec = (<>
    <div className="message_body">


      {
        messages && messages.length > 0 ? messages.map((msg, index) => {
          const lastmessage = messages.length - 1 === index
          return <div key={index} ref={lastmessage ? lastmsgref : null} className={user && user._id === msg.sender._id ? "msg" : "msgleft"}>
            <div className="text">
              {msg.type === 'image' ? renderImage(msg.body) : <p>{msg.body}</p>}
              <span>{moment(msg.date).format("MMM D - hh:mm A")}</span>
            </div>
            <div className="msg_avatar">
              <Avatar src={msg.sender.profileimg} />
            </div>
          </div>
        }) : <p style={{ textAlign: "center" }}>No messages found</p>
      }



    </div>
    <div className="message_input">
      {
        showEmoji && <span className='picker'>
          <Picker showPreview={false} showSkinTones={false} onSelect={addEmoji} />
        </span>
      }

      <div className="message_icon">
        <div>
          <i onClick={() => setShowEmoji(!showEmoji)} style={showEmoji ? { color: "#F9A70F" } : { color: "#666" }} className="far fa-laugh"></i>

        </div>

        <div>
          <input onChange={(e) => handleImage(e.target.files[0])} style={{ display: "none" }} accept="image/*" id="icon-button-file" type="file" />
          <label style={{ margin: "0" }} htmlFor="icon-button-file">
            <IconButton style={{ padding: "0" }} color="primary" aria-label="upload picture" component="span">
              {imgsending ? <CircularProgress size={25} /> : <i className="far fa-image"></i>}

            </IconButton>
          </label>

        </div>



        {/* <i className="fas fa-paperclip"></i> */}
      </div>

      <div className="input">
        <input value={text} onKeyDown={(e) => { handleKey(e) }} onChange={(e) => settext(e.target.value)} type="text" placeholder="Type something..."></input>
        <i style={{ cursor: "pointer" }} onClick={() => text && handleSend()} className="far fa-paper-plane"></i>
      </div>
    </div></>
  )

//message section ends

  return (
    <div className="msg_secs">
      <div className="msg_sec_head">
        <div className="avatar">
          <Avatar src={receiver && receiver.profileimg} />
        </div>
        <div className="text">
          <h6>{receiver && receiver.first} {receiver && receiver.last}</h6>
          <span>{isTyping ? "Typing..." : receiver.status && receiver.status.current === 'online' ? "online" : receiver && moment(receiver.status && receiver.status.lastonline).fromNow()}</span>

        </div>
        <div className="options">
          <span onClick={() => handleCall("videocall")}><i className="fas fa-video"></i></span>
          <span onClick={() => handleCall("audiocall")}><i className="fas fa-phone"></i></span>
          <span  onClick={()=>handleFavourite(receiver && receiver._id)}><i style={isFavourite ? {color:"red",fontWeight:"bold"}:{color:"#666"}} className="far fa-star"></i></span>
          <span onClick={()=>setToast("comming soon","info")}><i className="fas fa-ellipsis-h"></i></span>

        </div>
      </div>


      {
        Call ? <CallComp activity={activity} roomid={roomid} receiver={receiver} /> : messagessec
      }


    </div>
  )
}

export default MessageSection
