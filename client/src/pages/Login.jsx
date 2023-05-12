import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../context/authContext'

const Login = () => {

  // Define state variables for inputs and errors
  const [inputs, setInputs] = useState({
    username: "",
    password: "",

  })
  const [errors, setError] = useState({})

  // Get the navigate function from react-router-dom
  const navigate = useNavigate()

  // Get the login function from the AuthContext
  const { login } = useContext(AuthContext)

  // Handle changes to the input fields
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    // Validate the inputs
    const validationErrors = validate(inputs)
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Call the login function with the inputs
        await login(inputs)
        // Navigate to the home page
        navigate("/")
      } catch (err) {
        // Set the error state if there is an error from the server
        setError({ server: err.response.data })
      }
    } else {
      // Set the error state if there are validation errors
      setError(validationErrors)
    }
  }

  // Validate the input values
  const validate = (values) => {
    let errors = {}
    const usernameRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    if (!values.username) {
      errors.username = "Username is required"
    } else if (!usernameRegex.test(values.username)) {
      errors.username = "Username can only contain letters, numbers, and symbols"
    }
    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long"
    }
    return errors
  }

  // Render the login form
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