
let init ={
    user:{},
    profile:{},
    authenticated: false,
    startreceivecall: {
        setReceivingCall:false,
        setCaller:null,
        setCallerSignal:null,
        activity:null
    },
    status:'offline',
    loading: false,
    snack:{open:false,message:"",type:''}
}

const authReducer = (state=init, action)=>{
    switch (action.type) {
        case "SET_USER":
       return{
           ...state,
           user:action.payload,
           authenticated: true
        }
        case 'SET_PROFILE':
            return{
                ...state,
                profile:action.payload
            }
        case "START_LOAD":
       return{
           ...state,
           loading: true
        }
        case "STOP_LOAD":
       return{
           ...state,
           loading: false
        }
        case "LOGOUT":
        return{
            user:{},
            authenticated: false,
            loading: false,
            snack:{open:false,message:"",type:''}
            }
        case "SNACKBAR":
            return{
                ...state,
                snack:action.payload
            }
        case "IMONLINE":
            return{
                ...state,
                status:action.payload
            }
        case "START_RECEIVE":
            return{
                ...state,
                startreceivecall:{
                    setReceivingCall:action.payload.setReceivingCall,
                    setCaller:action.payload.setCaller,
                    setCallerSignal:action.payload.setCallerSignal,
                    activity:action.payload.activity
                }
            }
    
        default:
            return state;
    }
}

export default authReducer