import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import { login } from "../utils/api";
import {TextField, Button, Grid, AppBar, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";
import LoginIcon from '@mui/icons-material/Login';
import Alert from '@mui/material/Alert';




const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiAppBar-root': {
      backgroundColor: theme.palette.primary.dark,
      height: '10px'
    }    
  }

}))

const Login = () => {

  const history = useHistory()
  const initialFormData = {
    employee_email: "",
    password: ""
  }

  const classes= useStyles()

  const [formData, setFormData] = useState({...initialFormData})
  const [errorMessage, setErrorMessage] = useState(null)
  const handleChange = ({target}) => {
    setFormData({
      ...formData,
      [target.name]: target.value
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    const abortController = new AbortController();
    await login(formData, abortController.signal)
      .then(response => {
        if (response.error) {
          setErrorMessage({message: "Incorrect username or password"})
        } else {
          localStorage.setItem("user", formData.employee_email)
          localStorage.setItem("name", response.employee_name)
          localStorage.setItem("id", response.employee_id)
          history.push("/")          
        }
      })
  }

  return (

      <Grid container alignItems="center">
        <Grid item xs={12}>
          <AppBar className={classes.root} position="static"></AppBar>
          <AppBar position="static">
            <Typography variant="h4" component='div' sx={{flexGrow: 1, textAlign: 'center', pb: '20px', pt: '20px'}}>
              Welcome To Loon Juice Keg Tracker
            </Typography>
          </AppBar>          
        </Grid>
        <Grid item xs={12} textAlign="center">
          <img style={{borderRadius: "5px", marginTop: "15px", maxWidth: "400px", width: "30%", minWidth: "250px"}} src='https://res.cloudinary.com/ratebeer/image/upload/w_400,c_limit/brew_20712.jpg' alt="loon juice"/>
        </Grid>
        <Grid item xs={12}>
          <div className="form" style={{textAlign: "center"}}>
            <form onSubmit={handleSubmit}>
              <TextField id ="outlined-basic" label="Email" name="employee_email" margin="normal" onChange={handleChange}/> <br/>
              <TextField id="outlined-password-input" label="Password" type="password" name="password" margin="normal" onChange={handleChange}/> <br/> <br/>
              <Button type="submit" variant="contained" size="large" endIcon={<LoginIcon/>} >Login</Button>
            </form>
          </div>
          <div>
            {errorMessage ? <Alert onClose={() => {setErrorMessage(null)}} sx={{width: "30%", margin: "auto", mt: "20px"}} variant="filled" severity="error">{errorMessage.message}</Alert>: null}
          </div>                       
        </Grid>

      </Grid>

  );
}

export default Login;