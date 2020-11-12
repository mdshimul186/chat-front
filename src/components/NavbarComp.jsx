import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'



function NavbarComp() {
  const {profile,authenticated} = useSelector(state => state.auth)

  let logout=()=>{
    
    localStorage.removeItem("chat_key_token")
    window.location.pathname = "/"
  }
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <Link to="/" className="navbar-brand" href="#">Chat App</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse " id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      {
        authenticated ? <li className="nav-item">
        <button onClick={()=>logout()} className="btn btn-sm btn-danger" >Logout</button>
      </li>:
      <>
      <li className="nav-item">
        <Link className="nav-link" to="/signin">Sign in</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/signup">Sign up</Link>
      </li>
      </>
      }
      
     
    </ul>
  </div>
</nav>
    </>
  )
}

export default NavbarComp
