import React, { useContext, useState } from 'react' // Import React and useContext hook
import Logo from "../img/logo.png" // Import logo image
import { Link } from 'react-router-dom' // Import Link component from react-router-dom
import { AuthContext } from '../context/authContext' // Import AuthContext from authContext.js

const Navbar = () => { // Define Navbar functional component

  const { currentUser, logout } = useContext(AuthContext); // Use useContext hook to access currentUser and logout functions from AuthContext

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    }
    setSelectedCategory(category);
  }

  const handleLogoClick = () => {
    setSelectedCategory(null);
  }


  return ( // Render the following JSX
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          {/*Render a Link component that links to the home page */}
          <Link to="/" onClick={handleLogoClick}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        {/* Render links that link to different categorys */}
        <div className="links">
          <Link className={`link ${selectedCategory === 'birthday' ? 'selected' : ''}`} to="/?cat=birthday" onClick={() => handleCategoryClick('birthday')}>
            <h6>BIRTHDAY</h6>
          </Link>
          <Link className={`link ${selectedCategory === 'events' ? 'selected' : ''}`} to="/?cat=events" onClick={() => handleCategoryClick('events')}>
            <h6>EVENTS</h6>
          </Link>
          <Link className={`link ${selectedCategory === 'wedding' ? 'selected' : ''}`} to="/?cat=wedding" onClick={() => handleCategoryClick('wedding')}>
            <h6>WEDDING</h6>
          </Link>
          <Link className={`link ${selectedCategory === 'valentines' ? 'selected' : ''}`} to="/?cat=valentines" onClick={() => handleCategoryClick('valentines')}>
            <h6>VALENTINES</h6>
          </Link>
          <Link className={`link ${selectedCategory === 'christmas' ? 'selected' : ''}`} to="/?cat=christmas" onClick={() => handleCategoryClick('christmas')}>
            <h6>CHRISTMAS</h6>
          </Link>
          <Link className='link' to="/profile" onClick={handleLogoClick}>
            <span>{currentUser?.username}</span>
          </Link>
          {/* If the user is logged in, render the following JSX, Render a Link component that links to the user's events page */}
          {currentUser && (
            <Link className='link' to="/events" onClick={handleLogoClick}>
              <span>Your Events</span>
            </Link>
          )}
          {/* If the user is logged in, render a Link component that logs the user out when clicked; otherwise, render a Link component that links to the login page */}
          {currentUser ? <Link className='link' to='/' onClick={handleLogoClick}><span onClick={logout}>Logout</span></Link> : <Link className='link' to="/login">Login</Link>}
          <span className='write'>
            <Link className='link' to="/write">Post</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar