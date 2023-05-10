import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",

  })
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()


  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: "" }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validate(inputs)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    } else {
      try {
        await axios.post("/auth/register", inputs)
        navigate("/login")
      } catch (err) {
        setErrors({ server: err.response.data })
      }
    }
  }

  const validate = (values) => {
    let errors = {}
    if(!values.username){
      errors.username = "Username is required"
    }
    if(!values.email){
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(values.email)){
      errors.email = "Email is invalid"
    }
    if(!values.password){
      errors.password = "Password is required"
    }else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long"
    }
    return errors
  }

  return (
    <div className='auth'>
      <div className="card">
        <div className="left">
          <h1>VirtuCard</h1>
          <p>
          Welcome to VirtuCard, the online celebration card platform. Please fill out the form  to create your account and start storing your digital celebration card.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input required type="text" placeholder='username' name="username" onChange={handleChange} />
            {errors.username && <p>{errors.username}</p>}
            <input required type="email" placeholder='email' name="email" onChange={handleChange} />
            {errors.email && <p>{errors.email}</p>}
            <input required type="password" placeholder='password' name="password" onChange={handleChange} />
            {errors.password && <p>{errors.password}</p>}
            {errors.server && <p>{errors.server}</p>}
            <button onClick={handleSubmit}>Register</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register