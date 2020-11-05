import React,{useEffect,useState} from 'react'
import MessageSection from '../components/MessageSection'
import LayoutChat from '../components/Layout'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {useSelector} from 'react-redux'

import {socket} from '../App'

function SingleRoom() {

    let {roomid} = useParams()
    
   

  

    const {user} = useSelector(state => state.auth)

    useEffect(() => {
        if(socket && roomid){
            socket.emit('joinroom',roomid)
        }
    }, [socket,roomid])


   




   
    return (
        <>
             <LayoutChat>
                <MessageSection roomid={roomid} />
            </LayoutChat>
        </>
    )
}

export default SingleRoom
