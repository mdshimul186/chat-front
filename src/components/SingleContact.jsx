import React,{useEffect,useState} from 'react'
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux'
import moment from 'moment'


const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);


function SingleContact({ conversation }) {
    const [User, setUser] = useState({})
    const [lastMsg, setlastMsg] = useState({})

    const {user,startreceivecall} = useSelector(state => state.auth)

    useEffect(() => {
        conversation && conversation.member.map(m=>{
            if(user._id !== m._id){
                setUser(m)
            }
        })
       if(conversation.messages.length>0){
           setlastMsg(conversation && conversation.messages[conversation.messages.length - 1])

       }

       
    }, [conversation])

    useEffect(() => {
       if(startreceivecall && startreceivecall.setReceivingCall){
        
           if(startreceivecall.setCaller._id === User._id){
               
               setlastMsg({...lastMsg,body:"calling"})
           }
       }
    }, [startreceivecall])

    let last
    last = (
<>
{
                    lastMsg && lastMsg.body === 'calling' ? <span>calling</span>:
                <span>{lastMsg && user._id ==  lastMsg.sender ? "You:" : <>{User.first} {User.last}:</>} {lastMsg &&  lastMsg.type==='image' ?'image':lastMsg.body}</span>

                }
</>
    )
    return (
        <>

            <div className="avatar">
                {
                    User.status && User.status.current === "online" ? <StyledBadge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        variant="dot"
                    >
                        <Avatar src={User.profileimg}  />
                    </StyledBadge> :
                        <Avatar src={User.profileimg} />

                }
            </div>
            <div className="text">
                <h6>{User.first} {User.last}</h6>
                {lastMsg && last} 
            </div>
            <div className="time">
            
            
                <span>{lastMsg && moment(lastMsg.date).format("MMM D")}</span>
                <span>{lastMsg && moment(lastMsg.date).format("hh:mm A")}</span>
            </div>
        </>
    )
}

export default SingleContact
