import React, {useState} from "react"
import {useHistory} from 'react-router-dom'
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
    console.log(formData)
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({data: formData})
    }
    await fetch(`${window.location.origin}/api/login`, requestOptions)
      .then(response => {
        if (response.status === 200) {
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
        <h1>Keg Tracker</h1>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <CustomInput label="Email" name="employee_email" color="blue" handleChange={handleChange} />
          <CustomInput label="Password" name="password" color="blue" handleChange={handleChange} />
          <button className="btn btn-primary" type="submit">Login</button> <br/>
        </form>
      </div>

    </main>
  );
}

export default Login;