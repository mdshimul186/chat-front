import React,{useEffect,useState} from 'react'

import SingleContact from './SingleContact';
import {useHistory} from 'react-router-dom'
import {socket} from '../App.js'
import {useSelector} from 'react-redux'
import axios from 'axios'

function Rooms() {
    const [users, setUsers] = useState([])
    
  



    const [conversations, setConversations] = useState([])
    useEffect(() => {
        axios.get('/conversation/getall')
        .then(res=>{
            setConversations(res.data.conversations)
            
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
                conversations && conversations.map((con,index)=>{
                        return <div key={index} onClick={()=>handlePush(con)} className="contact_list">
                    <SingleContact conversation={con}/>
                </div>
                    })
                }
        </>
    )
}

export default Rooms
