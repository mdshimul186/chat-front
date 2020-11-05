

import React,{useState,useEffect,useRef} from 'react'
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import {socket} from '../App'
import Peer from "simple-peer";

function CallComp({roomid,activity}) {
    
   
    const {user,startreceivecall} = useSelector(state => state.auth)
    //webrtc
    const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
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
   if((activity==="videocall") && roomid){
callPeer(roomid)
   }
 }, [activity,roomid])
    
    


    function callPeer(id) {
        if(id!==''){
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            setCallingFriend(true)
            setCaller(id)
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }
            const peer = new Peer({
              initiator: true,
              trickle: false,
          
              stream: stream,
            });
    
            myPeer.current=peer;
        
            peer.on("signal", data => {
              socket.emit("callUser", { userToCall: id, signalData: data, from: user._id })
            })
        
            peer.on("stream", stream => {
              if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
              }
            });
    
            peer.on('error', (err)=>{
              //endCall()
            })
        
            socket.on("callAccepted", signal => {
              setCallAccepted(true);
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
          })
        } else {
          //setModalMessage('We think the username entered is wrong. Please check again and retry!')
         // setModalVisible(true)
          //return
        }
      }
    

      function acceptCall() {
        dispatch({
          type:"START_RECEIVE",
          payload:{setReceivingCall:false,setCaller:null,setCallerSignal:null}
        })
        //ringtoneSound.unload();
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
           
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
            socket.emit("acceptCall", { signal: data, to: caller })
          })
    
          peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
          });
    
          peer.on('error', (err)=>{
            endCall()
          })
    
          peer.signal(callerSignal);
    
          socket.current.on('close', ()=>{
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
        socket.emit('rejected', {to:caller})
        window.location.reload()
      }
    
      function endCall(){
        myPeer.current.destroy()
        socket.emit('close',{to:caller})
        window.location.reload()
      }
    
   

   



      let incomingCall;
      if (receivingCall && !callAccepted && !callRejected) {
        incomingCall = (
          <div className="incomingCallContainer">
            <div className="incomingCall flex flex-column">
              <div><span className="callerID">{caller}</span> is calling you!</div>
              <div className="incomingCallButtons flex">
              <button name="accept" className="alertButtonPrimary" onClick={()=>acceptCall()}>Accept</button>
              <button name="reject" className="alertButtonSecondary" onClick={()=>rejectCall()}>Reject</button>
              </div>
            </div>
          </div>
        )
      }


      let PartnerVideo;
      if (callAccepted && isfullscreen) {
        PartnerVideo = (
          <video style={{height:"300px",width:"48%"}} className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
        );
      } else if (callAccepted && !isfullscreen){
        PartnerVideo = (
          <video style={{height:"300px",width:"48%"}} className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
        );
      }






    
    return (
        <>
          
{/* <button onClick={()=>callPeer(roomid)}>Call</button> */}
             <div style={{display:"flex",flexWrap:"nowrap"}}>
            <video style={{height:"300px",width:"48%",marginRight:"10px"}} className="userVideo" playsInline muted ref={userVideo} autoPlay />
            {incomingCall}
            {PartnerVideo}
            </div>
        </>
    )
}

export default CallComp

