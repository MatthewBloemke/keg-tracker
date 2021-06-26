import React, {useEffect} from "react"

const Login = () => {
  const loginFunction = async () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({data: {employee_email: "dingus@gmail.com", password: "password"}})
    }
    await fetch(`http://localhost:5000/api/employees`, requestOptions)
      .then(response => {
        console.log(response.status)
      })
  }  
  useEffect(() => {
    loginFunction()

  }, [])
  return (
    <div>
      <h1>I want to login!</h1>
    </div>
  );
}

export default Login;