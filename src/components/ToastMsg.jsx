import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux'
import store from '../store'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export let setToast =(message, type)=>{

  store.dispatch({
    
    type:"SNACKBAR",
    payload:{open:true,message:message,type:type}
  })

  setTimeout(() => {
    store.dispatch({
    
      type:"SNACKBAR",
      payload:{open:false,message:"",type:""}
    })
  }, 4000);
  
}


  function ToastMsg() {
    let {snack} = useSelector(state=>state.auth)

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

   const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      
      <Snackbar open={snack.open} autoHideDuration={6000} onClose={handleClose}>
        
      <Alert elevation={6} variant="filled" severity={snack.type} >{snack.message}</Alert>
      </Snackbar>
  
    </div>
  );
}
export default ToastMsg