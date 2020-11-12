import React,{useState,useEffect} from 'react'
import axios from 'axios'
import SingleUser from './SingleUser'
import {useHistory} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

function SearchUser() {
    const [Users, setUsers] = useState([])
     const [Loading, setLoading] = useState(true)

    let history = useHistory()

    useEffect(() => {
        setLoading(true)
       axios.get('/user/alluser')
       .then(res=>{
           setUsers(res.data.user)
           console.log(res.data.user);
           setLoading(false)
       })
    }, [])

    let handlePush=(user)=>{
        axios.post('/conversation/createconversation/'+user._id)
        .then(res=>{
            if(res.status=200){
                history.push(`/room/${res.data.id}`)
            }
        })

    }
    return (
        <>
        {
            Loading ? <span style={{textAlign:"center",display:"block",marginTop:"10px"}}><CircularProgress size={25} /></span> :
            Users && Users.length>0 ? Users.map((user,index)=>{
                return <div key={index} onClick={()=>handlePush(user)} className="contact_list" style={{cursor:"pointer"}}>
                 <SingleUser  user={user} />
                </div>
                
            }):
            <p style={{textAlign:"center"}}>No users found</p>
        }
            
        </>
    )
}

export default SearchUser
