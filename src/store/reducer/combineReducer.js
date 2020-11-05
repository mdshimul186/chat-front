import {combineReducers} from 'redux'
import authReducers from './authReducer'

const rootReducer = combineReducers({
    auth: authReducers
})

export default rootReducer