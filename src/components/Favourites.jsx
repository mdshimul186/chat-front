import React,{useState,useEffect} from 'react'
import axios from 'axios'
import SingleUser from './SingleUser'
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux'

function Favourites() {
    const [Users, setUsers] = useState([])
    let history = useHistory()
    const {profile} = useSelector(state => state.auth)
    useEffect(() => {
      profile && profile.favourites && setUsers(profile.favourites)
    }, [profile])

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
            Users &&Users.length >0 ? Users.map((user,index)=>{
                return <div key={index} onClick={()=>handlePush(user)} className="contact_list">
                 <SingleUser  user={user} />
                </div>
                
            }):
            <p style={{textAlign:"center"}}>No favourites found</p>
        }
            
        </>
    )
}

export default Favourites
