
import React,{useState} from 'react'
import LayoutChat from '../components/Layout'
import Avatar from '@material-ui/core/Avatar';
import {useSelector,useDispatch} from 'react-redux'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';


function Home() {
  const {profile} = useSelector(state => state.auth)
  const [imgsending, setimgsending] = useState(false)
  let dispatch = useDispatch()

  let handleProfileImage = (img) => {
    setimgsending(true)
    if (img) {
        let formData = new FormData()
        formData.append('profileimg', img)
        axios.put('/user/profileimg', formData)
            .then(res => {
              dispatch({
                type: 'SET_PROFILE',
                payload:res.data.user
          
              })
              setimgsending(false)
            })
    }
  
  }
  return (
    <>
      <LayoutChat>
      <div className='home_sec'>
      <div className="content">
      <h5>{profile?.first} {profile?.last}</h5>
       
        <Avatar src={profile?.profileimg} className="avatar_home" alt="Remy Sharp" />
        <div className='mt-3'>
        <input
        accept="image/*"
        style={{display:"none"}}
        id="contained-button-file11"
        accept="image/*" 
        type="file"
        onChange={(e)=> handleProfileImage(e.target.files[0])}
      />
      <label htmlFor="contained-button-file11">
      {
        imgsending ? <CircularProgress size={30} /> :  <Button variant="contained" color="primary" component="span">
          Upload profile image
        </Button>
      }
       
      </label>
        </div>
       
        
        <p>Search for someone to start a conversation</p>
      </div>
      </div>
      </LayoutChat>
    </>
  )
}

export default Home
