import React, { useContext } from 'react' // Import React and useContext hook
import Logo from "../img/logo.png" // Import logo image
import { Link } from 'react-router-dom' // Import Link component from react-router-dom
import { AuthContext } from '../context/authContext' // Import AuthContext from authContext.js

const Navbar = () => { // Define Navbar functional component

  const { currentUser, logout } = useContext(AuthContext); // Use useContext hook to access currentUser and logout functions from AuthContext




  return ( // Render the following JSX
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          {/*Render a Link component that links to the home page */}
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        {/* Render links that link to different categorys */}
        <div className="links">
          <Link className='link' to="/?cat=birthday">
            <h6>BIRTHDAY</h6>
          </Link>
          <Link className='link' to="/?cat=events">
            <h6>EVENTS</h6>
          </Link>
          <Link className='link' to="/?cat=wedding">
            <h6>WEDDING</h6>
          </Link>
          <Link className='link' to="/?cat=valentines">
            <h6>VALENTINES</h6>
          </Link>
          <Link className='link' to="/?cat=christmas">
            <h6>CHRISTMAS</h6>
          </Link>
          <Link className='link' to="/profile">
            <span>{currentUser?.username}</span>
          </Link>
          {/* If the user is logged in, render the following JSX, Render a Link component that links to the user's events page */}
          {currentUser && (
            <Link className='link' to="/events">
              <span>Your Events</span>
            </Link>
          )}
          {/* If the user is logged in, render a Link component that logs the user out when clicked; otherwise, render a Link component that links to the login page */}
          {currentUser ? <Link className='link' to='/'><span onClick={logout}>Logout</span></Link> : <Link className='link' to="/login">Login</Link>}
          <span className='write'>
            <Link className='link' to="/write">Post</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar