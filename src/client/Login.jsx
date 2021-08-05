import React, {useState} from "react"
import {useHistory} from 'react-router-dom'
import store from 'store'

const Login = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
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
    await fetch(`${API_BASE_URL}/api/login`, requestOptions)
      .then(response => {
        if (response.status === 200) {
          store.set('loggedIn', true)
          history.push("/")
        } else {
          setErrorMessage({message: "Incorrect username or password"})
        }
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="employee_email">Email</label>
        <input name="employee_email" id="employee_email" value={formData.employee_email} onChange={handleChange} /><br/>
        <label htmlFor="password">Password</label>
        <input name="password" id="password" value={formData.password} onChange={handleChange} /><br/>
        <button type="submit">Login</button>      
      </form>
    </div>
  );
}

export default Login;