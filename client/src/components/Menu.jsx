import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

const Menu = ({ cat }) => {
  // Define a state variable called "posts" and initialize it to an empty array
  const [posts, setPosts] = useState([]);

  // Use the useEffect hook to fetch data from the server when the component mounts or when the "cat" prop changes
  useEffect(() => {
    // Define an async function called "fetchData" that fetches data from the server using Axios
    const fetchData = async () => {
      try {
        // Make a GET request to the server to fetch posts that match the "cat" prop
        const res = await axios.get(`/posts/?cat=${cat}`);
        // Update the "posts" state variable with the fetched data
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    // Call the "fetchData" function to fetch data from the server
    fetchData();
  }, [cat]);

  // Render the component
  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {/* Map over the "posts" array and display each post's image, title, and a "Read More" button */}
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <img src={`../upload/posts/${post?.img}`} alt="" />
          <h2>{post.title}</h2>
          {/* Link the "Read More" button to the post's individual page */}
          <Link className="link" to={`/post/${post.id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;