

import React,{useState,useEffect,useRef} from 'react'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import {socket} from '../App'
import Peer from "simple-peer";

function CallComp({roomid,activity,receiver}) {
    
   
    const {user,startreceivecall} = useSelector(state => state.auth)
    //webrtc
    const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState({});
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [receiverID, setReceiverID] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [isfullscreen, setFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [Activity, setActivity] = useState(false)



    const userVideo = useRef();
    const partnerVideo = useRef();
    //const socket = useRef();
    const myPeer=useRef();

    let dispatch = useDispatch()




useEffect(() => {

  if(startreceivecall.setReceivingCall){
    setReceivingCall(true)
    setCaller(startreceivecall.setCaller);
    setCallerSignal(startreceivecall.setCallerSignal);
    setActivity(startreceivecall.activity)
  }



    // socket && socket.on("hey", (data) => {
    //   dispatch({
    //     type:"START_RECEIVE",
    //     payload:true
    //   })
    //     setReceivingCall(true);
    //     //ringtoneSound.play();
    //     setCaller(data.from);
    //     setCallerSignal(data.signal);
    //   })
}, [socket,startreceivecall])

 useEffect(() => {
   if(activity  && receiver){
callPeer(receiver._id, activity)
   }
 }, [activity,receiver])
    
    useEffect(() => {
     socket && socket.on('rejected', ()=>{
      window.location.reload()
    })
    }, [socket])


    function callPeer(id,activity) {
        if(id!==''){
          navigator.mediaDevices.getUserMedia({ video: activity === "videocall"? true:false, audio: true }).then(stream => {
            setStream(stream);
            setCallingFriend(true)
            setCaller(id)
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }
            const peer = new Peer({
              initiator: true,
              trickle: false,
          config: {
    
            iceServers: [
                // {
                //     urls: "stun:numb.viagenie.ca",
                //     username: "sultan1640@gmail.com",
                //     credential: "98376683"
                // },
                // {
                //     urls: "turn:numb.viagenie.ca",
                //     username: "sultan1640@gmail.com",
                //     credential: "98376683"
                // }

                {
                  urls: "stun:stun.stunprotocol.org",
                },
                {
                  urls: "turn:numb.viagenie.ca",
                  credential: "muazkh",
                  username: "webrtc@live.com",
                }
            ]
        },
              stream: stream,
            });
    
            myPeer.current=peer;
        
            peer.on("signal", data => {
              socket.emit("callUser", { userToCall: id, signalData: data, from: user,activity:activity })
            })
        
            peer.on("stream", stream => {
              if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
              }
            });
    
            peer.on('error', (err)=>{
              endCall()
            })
        
            socket.on("callAccepted", signal => {
              setCallAccepted(true);
              setCallingFriend(false)
              peer.signal(signal);
            })
    
            socket.on('close', ()=>{
              window.location.reload()
            })
      
            socket.on('rejected', ()=>{
              window.location.reload()
            })
          })
          .catch(()=>{
           // setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
            //setModalVisible(true)
            window.location.reload()
          })
        } else {
          //setModalMessage('We think the username entered is wrong. Please check again and retry!')
         // setModalVisible(true)
          //return
        }
      }
    

      function acceptCall(Activity) {
        dispatch({
          type:"START_RECEIVE",
          payload:{setReceivingCall:false,setCaller:null,setCallerSignal:null,activity:null}
        })
        //ringtoneSound.unload();
        navigator.mediaDevices.getUserMedia({ video: Activity === 'videocall' ? true:false, audio: true }).then(stream => {
           
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
          setCallAccepted(true);
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          });
    
          myPeer.current=peer
    
          peer.on("signal", data => {
            socket.emit("acceptCall", { signal: data, to: caller._id })
          })
    
          peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
          });
    
          peer.on('error', (err)=>{
            endCall()
          })
    
          peer.signal(callerSignal);
    
          socket.on('close', ()=>{
            window.location.reload()
          })
        })
        .catch(()=>{
          //setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
          //setModalVisible(true)
        })
      }
    
      function rejectCall(){
        //ringtoneSound.unload();
        setCallRejected(true)
        socket.emit('rejected', {to:roomid})
        window.location.reload()
      }
    
      function endCall(){
        myPeer.current.destroy()
        socket.emit('close',{to:roomid})
        window.location.reload()
      }


      function toggleMuteVideo(){
        if(stream){
          setVideoMuted(!videoMuted)
          stream.getVideoTracks()[0].enabled = videoMuted
        }
      }

      function toggleMuteAudio(){
        if(stream){
          setAudioMuted(!audioMuted)
          stream.getAudioTracks()[0].enabled = audioMuted
        }
      }
    
   

   



      let incomingCall;
      if (receivingCall && !callAccepted && !callRejected) {
        incomingCall = (
          <div className="incomingCallContainer">
            <div className="incomingCall flex flex-column">
              <div><span className="callerID">{caller && caller.first} {caller && caller.last}</span> is calling you!</div>
              <div className="incomingCallButtons flex">
              <button name="accept" className="alertButtonPrimary" onClick={()=>acceptCall(Activity)}>Accept</button>
              <button name="reject" className="alertButtonSecondary" onClick={()=>rejectCall()}>Reject</button>
              </div>
            </div>
          </div>
        )
      }


      let PartnerVideo;
      if (callAccepted && isfullscreen) {
        PartnerVideo = (
          <video  className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
        );
      } else if (callAccepted && !isfullscreen){
        PartnerVideo = (
          <video  className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
        );
      }

      let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }


  let callcontrol
  callcontrol = (
<div className="call_control">
{
  callAccepted && <>
  <span onClick={()=>toggleMuteAudio()}>{audioMuted ? <i class="fas fa-microphone-slash"></i>:<i class="fas fa-microphone"></i>}</span>
  {
    activity === 'audiocall' ? null :Activity === 'audiocall' ? null :  <span onClick={()=>toggleMuteVideo()}>{videoMuted ? <i class="fas fa-video-slash"></i> :<i class="fas fa-video"></i> }</span>

  }
  </>
}
              
              <span onClick={()=>{
                callAccepted ? endCall() : rejectCall()
              }}><i class="fas fa-phone-slash"></i></span>
            </div>
  )

  let callingfriend
  callingfriend = (
    <div className='calling_container'>
      <h5>calling....</h5>
    </div>
  )



    
    return (
        <>
          

             <div className="video_container" >
            { UserVideo}
            {callingFriend &&  callingfriend}
            {incomingCall}
            {PartnerVideo}
            {callcontrol}

            </div>
        </>
    )
}

export default CallComp

