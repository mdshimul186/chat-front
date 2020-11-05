import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {setToast} from '../components/ToastMsg'


import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [load, setload] = useState(false)
  const classes = useStyles();

  let dispatch = useDispatch()
  let history = useHistory()

  let handleSignin=(e)=>{
    setload(true)
    e.preventDefault()
    let user = {
      email,
      password
    }
    axios.post('/user/signin', user)
    .then(res=>{
     if(res.status === 200){
      localStorage.setItem('chat_key', res.data.token)
      dispatch({type:"SET_USER", payload: res.data.user})
      setToast("Signin success","success")
      setload(false)
      window.location.pathname='/'
      }
    })
    .catch(err=>{
      err.response && setError(err.response.data)
      setload(false)
      
    })
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && error.error ? <p style={{color:"red"}}>{error.error}</p>:null}
        <form onSubmit={handleSignin} className={classes.form} noValidate>
          <TextField
            error={error && error.email ? true: false}
            helperText={error && error.email ? error.email: false}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e)=>setEmail(e.target.value)}
          />
          <TextField
            error={error && error.password ? true: false}
            helperText={error && error.password ? error.password: false}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e)=>setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          {
            load?<CircularProgress color="white" size={30} />:'Sign In'
          }
          
            
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link style={{color:"black"}} to='/signup'>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
