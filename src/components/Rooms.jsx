import React,{useEffect,useState} from 'react'

import SingleContact from './SingleContact';
import {useHistory} from 'react-router-dom'
import {socket} from '../App.js'
import {useSelector} from 'react-redux'
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

function Rooms() {
    const [users, setUsers] = useState([])
    const [Loading, setLoading] = useState(false)
    
  



    const [conversations, setConversations] = useState([])
    useEffect(() => {
        setLoading(true)
        axios.get('/conversation/getall')
        .then(res=>{
            setConversations(res.data.conversations)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
      socket && socket.on("newmessage",data=>{
       
        if(conversations){
            let newarray = [...conversations]
          
            let index = newarray.findIndex(c=>c._id == data._id)
            newarray[index] = data
            setConversations([...newarray])
            
           
        }
          
      })

    
     
    }, [socket,conversations])




    const {user} = useSelector(state => state.auth)
    useEffect(() => {
        socket && conversations && socket.on("useronline",data=>{
            
            let newarray = [...conversations]
           
            data && newarray && newarray.map(c=>{
                
                c.member.map(m=>{
                  
                    if(m._id == data._id){
                       
                        let index = newarray.findIndex(n=>n._id == c._id)
                        let singlecon = newarray[index]
                        let singleconmem = [...singlecon.member]
                        let index2 = singleconmem.findIndex(m2=>m2._id === data._id)
                        singleconmem[index2] = data
                        
                        let finalcon = {...singlecon,member:singleconmem}
                        newarray[index] = finalcon
                        setConversations(newarray)
                        
                        
                    }
                })
            })
            
            
        })

        
    }, [socket,conversations])




    let history = useHistory()




    let handlePush=(conversation)=>{
        // let id
        // conversation && conversation.member.map(m=>{
        //     if(user._id !== m._id){
        //         id = m._id
        //     }
        // })

        history.push(`/room/${conversation._id}`)
       
    }
    return (
        <>
            {
                Loading ? <span style={{textAlign:"center",display:"block",marginTop:"10px"}}><CircularProgress size={25} /></span> :
                conversations && conversations.length >0 ? conversations.map((con,index)=>{
                        return <div key={index} onClick={()=>handlePush(con)} className="contact_list" style={{cursor:"pointer"}}>
                    <SingleContact conversation={con}/>
                </div>
                    }):
                    <p style={{textAlign:"center"}}>No conversations found!search user and start new conversation</p>
                }
        </>
    )
}

export default Rooms
