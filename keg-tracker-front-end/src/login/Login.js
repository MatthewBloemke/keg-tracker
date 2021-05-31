import React, {useEffect, useState} from "react"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
function Login () {
    const initialFormState = {
        employee_email: "",
        password: ""
    }
    const [formData, setFormData] = useState({...initialFormState})
    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data: formData})
        }
        console.log(requestOptions)
        await fetch(`${API_BASE_URL}/login`, requestOptions)
            .then(console.log)
    }
    return (
        <form onSubmit = {handleSubmit}>
            <div>
                <h1>Login</h1>
                <label htmlFor="employee_email">email: </label>
                <input name="employee_email" value={formData.employee_email} onChange={handleChange}></input> <br/>
                <label htmlFor="password">password: </label>
                <input name="password" value={formData.password} onChange={handleChange}></input> <br/>
                <button type="submit">Submit</button>
            </div>            
        </form>

    )    
}

export default Login;
