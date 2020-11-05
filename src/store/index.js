import {createStore, applyMiddleware, compose} from 'redux'
import Thunk from 'redux-thunk'
import rootReducer from './reducer/combineReducer'

const store = createStore(rootReducer,compose(applyMiddleware(Thunk)))

 export default store

//  ,
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

 