import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import TabsSection from './TabsSection'
import {socket} from '../App'
import {useDispatch} from 'react-redux'

import { createBreakpoint } from "react-use";

const useBreakpoint = createBreakpoint();

function LayoutChat({children}) {
    let history = useHistory()
    const breakpoint = useBreakpoint();
    const dispatch = useDispatch()

    const [TabShow, setTabShow] = useState(true)
    const [MesageShow, setMesageShow] = useState(false)
    const [SidebarShow, setSidebarShow] = useState(false)

    useEffect(() => {
        
        if (breakpoint == "tablet"){
            if(history.location.pathname.startsWith('/room')){
                setTabShow(false)
                setMesageShow(true)
                setSidebarShow(false)
            }else{
                setTabShow(true)
                setMesageShow(false)
                setSidebarShow(false)
            }
        }else if (breakpoint == "laptop"){
            setTabShow(true)
                setMesageShow(true)
                setSidebarShow(true)
        }
        
    }, [history.location.pathname,breakpoint])


    useEffect(() => {
        socket && socket.on("hey", (data) => {
            //alert("receivinfg")
            //setCall(true)
            dispatch({
              type:"START_RECEIVE",
              payload:{setReceivingCall:true,setCaller:data.from,setCallerSignal:data.signal,activity:data.activity}
            })
              //setReceivingCall(true);
              //ringtoneSound.play();
              //setCaller(data.from);
              //setCallerSignal(data.signal);
            })
    }, [socket])
   


    return (
        <div>
            <div className='row tab_sec'>
            {
                TabShow && <div className='col-lg-3 tab_sec col-sm-12'>
                    <TabsSection />
                </div>
            }

            {
                MesageShow &&  <div className='col-lg-6 msg_sec col-sm-12'>
                {children}
                    
                </div>
            }

            {
                SidebarShow && <div className='col-lg-3 col-sm-12'>
                    sidebar
                </div>
            }
                
                
                
            </div>
        </div>
    )
}

export default LayoutChat
