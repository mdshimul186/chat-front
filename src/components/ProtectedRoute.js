 import React from 'react'
 import {Route,Redirect} from 'react-router-dom'
 import {useSelector} from 'react-redux'

 function ProtectedRoute({ component: Component, ...rest }) {
     const {authenticated} = useSelector(state => state.auth)
     return(
     <Route {...rest} render={(props) => (
         authenticated === true
           ? <Component {...props} />
           : <Redirect to='/' />
       )} />
     )
 }

 export default ProtectedRoute
