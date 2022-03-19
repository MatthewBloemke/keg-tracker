import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import { login } from "../utils/api";
import "./login.css";
import {TextField, Button} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import Alert from '@mui/material/Alert';

const Login = () => {
  const history = useHistory()
  const initialFormData = {
    employee_email: "",
    password: ""
  }
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
        if (response === "working") {
          localStorage.setItem("user", formData.employee_email)
          history.push("/")
        } else {
          setErrorMessage({message: "Incorrect username or password"})
        }
      })
  }

  return (
    <main>
      <div className="header">
        <p></p>
        <p></p>
        <h1>Welcome To Keg Tracker</h1>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <TextField id ="outlined-basic" label="Email" name="employee_email" margin="normal" onChange={handleChange}/> <br/>
          <TextField id="outlined-password-input" label="Password" type="password" name="password" margin="normal" onChange={handleChange}/> <br/> <br/>
          <Button type="submit" variant="contained" color="success" size="large" endIcon={<LoginIcon/>} >Login</Button>
        </form>
      </div>
      <div>
        {errorMessage ? <Alert onClose={() => {setErrorMessage(null)}} sx={{width: "30%", margin: "auto"}} variant="filled" severity="error">{errorMessage.message}</Alert>: null}
      </div>
    </main>
  );
}

export default Login;