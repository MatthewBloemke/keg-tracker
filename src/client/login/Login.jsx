import React, {useState} from "react"
import {useHistory} from 'react-router-dom'
import { login } from "../utils/api"
import CustomInput from "../utils/CustomInput"
import "./login.css"

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
        <h1>Welcome To Keg Tracker</h1>
        <p id="bottomLoginHeader"></p>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <CustomInput label="Email" name="employee_email" color="blue" handleChange={handleChange} type="text" value={formData.employee_email}/>
          <CustomInput label="Password" name="password" color="blue" handleChange={handleChange} type="text" value={formData.password}/>
          <button className="btn btn-primary" type="submit">Login</button> <br/>
        </form>
      </div>

    </main>
  );
}

export default Login;