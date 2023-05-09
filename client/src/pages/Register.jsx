import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",

  })
  const [err, setError] = useState(null)

  const navigate = useNavigate()


  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post("/auth/register", inputs)
      navigate("/login")
    } catch (err) {
      setError(err.response.data)
    }
  }

  return (
    <div className='auth'>
      <div className="card">
        <div className="left">
          <h1>VirtuCard</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
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
            <input required type="email" placeholder='email' name="email" onChange={handleChange} />
            <input required type="password" placeholder='password' name="password" onChange={handleChange} />
            {err && <p>{err}</p>}
            <button onClick={handleSubmit}>Register</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register