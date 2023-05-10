import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../context/authContext'

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",

  })
  const [errors, setError] = useState({})

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validate(inputs)
    if (Object.keys(validationErrors).length === 0) {
      try {
        await login(inputs)
        navigate("/")
      } catch (err) {
        setError({ server: err.response.data})
      }
    } else {
      setError(validationErrors)
    }
  }

  const validate = (values) => {
    let errors = {}
    if(!values.username){
      errors.username = "Username is required"
    }
    if(!values.password){
      errors.password = "Password is required"
    }
    return errors
  }

  return (
    <div className='auth'>
      <div className="card">
        <div className="left">
          <h1>VirtuCard</h1>
          <p>VirtuCard is a virtual celebration card platfrom which allows you to share and browse others peoples cards. Create events with a card attached so your guests can enjoy their virtual invitation.</p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input required type="text" placeholder='username' name="username" onChange={handleChange} />
            {errors.username && <p>{errors.username}</p>}
            <input required type="password" placeholder='password' name="password" onChange={handleChange} />
            {errors.password && <p>{errors.password}</p>}
            {errors.server && <p>{errors.server}</p>}
            <button onClick={handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login