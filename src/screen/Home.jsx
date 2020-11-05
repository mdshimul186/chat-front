
import React from 'react'
import LayoutChat from '../components/Layout'
import Avatar from '@material-ui/core/Avatar';


function Home() {
  return (
    <>
      <LayoutChat>
      <div className='home_sec'>
      <div className="content">
      <h5>Md shimul</h5>
       
        <Avatar className="avatar_home" alt="Remy Sharp" />
        
        <p>Search for someone to start a conversation,
           Add contacts to your favorites to reach them faster</p>
      </div>
      </div>
      </LayoutChat>
    </>
  )
}

export default Home
