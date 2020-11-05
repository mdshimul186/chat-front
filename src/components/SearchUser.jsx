import React,{useState,useEffect} from 'react'
import axios from 'axios'
import SingleUser from './SingleUser'
import {useHistory} from 'react-router-dom'

function SearchUser() {
    const [Users, setUsers] = useState([])
    let history = useHistory()
    useEffect(() => {
       axios.get('/user/alluser')
       .then(res=>{
           setUsers(res.data.user)
           console.log(res.data.user);
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
            Users && Users.map((user,index)=>{
                return <div key={index} onClick={()=>handlePush(user)} className="contact_list">
                 <SingleUser  user={user} />
                </div>
                
            })
        }
            
        </>
    )
}

export default SearchUser
