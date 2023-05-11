import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from "axios"


// Define a functional component called "Home"
const Home = () => {
  //Define a state variable called "posts" and initialize it to an empty array
  const [posts, setPosts] = useState([])
  // Get the current URL query string using the "useLocation" hook from the React Router library
  const cat = useLocation().search

  // Use the "useEffect" hook to fetch the posts data from the server when the component mounts or when the "cat" variable changes
  useEffect(() => {
    // Define an asynchronous function called "fetchData" to fetch the posts data from the server
    const fetchData = async () => {
      try {
        // Use the Axios library to send a GET request to the server and get the posts data
        const res = await axios.get(`/posts${cat}`)
        // Update the "posts" state variable with the fetched data
        setPosts(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    // Call the "fetchData" function to fetch the posts data
    fetchData()
  }, [cat])

  // Define a function called "getText" to extract the text content from an HTML string
  const getText = (html) => {
    // Use the DOMParser API to parse the HTML string and create a document object
    const doc = new DOMParser().parseFromString(html, "text/html")
    // Return the text content of the document body
    return doc.body.textContent
  }

  // Render the component
  return (
    <div className='home'>
      <div className="posts">
        {/* Map over the "posts" array and render each post as a "div" element */}
        {posts.map((post) => (
          <div className='post' key={post.id}>
            <div className="img">
              {/* Render the post image */}
              <img src={`../upload/posts/${post.img}`} alt="" />
            </div>
            <div className="content">
              {/* Create a link to the individual post page */}
              <Link className="link" to={`/post/${post.id}`}>
                {/* Render the post title */}
                <h1>{post.title}</h1>
              </Link>
              {/* Render the post description */}
              <p>{getText(post.desc)}</p>
              {/* Create a button to read more about the post */}
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export the "Home" component as the default export of this module
export default Home