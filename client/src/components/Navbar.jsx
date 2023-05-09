import React, { useContext } from 'react'
import Logo from "../img/logo.png"
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Navbar = () => {

  const { currentUser, logout } = useContext(AuthContext);




  return (
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
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
          {currentUser && (
            <Link className='link' to="/events">
              <span>Your Events</span>
            </Link>
          )}
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