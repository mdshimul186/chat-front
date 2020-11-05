import React,{useEffect,useState} from 'react'
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux'


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

    const {user} = useSelector(state => state.auth)

    useEffect(() => {
        conversation && conversation.member.map(m=>{
            if(user._id !== m._id){
                setUser(m)
            }
        })
       
        setlastMsg(conversation && conversation.messages[conversation.messages.length - 1])

       
    }, [conversation])
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
                        <Avatar alt="Remy Sharp"  />
                    </StyledBadge> :
                        <Avatar alt="Remy Sharp" />

                }
            </div>
            <div className="text">
                <h6>{User.first} {User.last}</h6>
                <span>{lastMsg && lastMsg.body}</span>
            </div>
            <div className="time">
                <span>Oct 8</span>
                <span>10:32 am</span>
            </div>
        </>
    )
}

export default SingleContact
