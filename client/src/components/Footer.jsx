import React from 'react'
import Logo from "../img/logo.png"

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <div className="social-media">

        <a href="https://github.com/Boltxix">Github</a>
        <a href="https://www.linkedin.com/in/maciej-sobiecki-3a3402176/">LinkedIn</a>
      </div>
      <p>&copy; 2023 VirtuCard. All Rights Reserved.</p>
      <span>Made with <b>React.js</b></span>
    </footer>
  )
}

export default Footer