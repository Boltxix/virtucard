import React, { useState, useContext } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from "../context/authContext";



const Write = () => {
  // Get the state passed from the previous page using useLocation hook
  const state = useLocation().state
  // Set up state variables using useState hook
  const [value, setValue] = useState(state?.desc || '');
  const [title, setTitle] = useState(state?.title || '');
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || '');
  const [err, setError] = useState(null)
  // Get the navigate function from the react-router-dom library
  const navigate = useNavigate()

  const { currentUser } = useContext(AuthContext); // get the current user from the auth context

  if (!currentUser) { // if there is no current user, show an error message
    return <div className='error'>Please login to create a post.</div>;
}

  // Function to validate user inputs
  const validateInputs = () => {
    if (!title) {
      setError("Please enter a title")
      return false
    }

    if (!value) {
      setError("Please enter some content")
      return false
    }
    if (!cat) {
      setError("Please slect a category")
      return false
    }
    return true
  }

  // Function to upload the image file to the server
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await axios.post("/postUpload", formData)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")
    }
  }

  // Function to handle the click event when the user clicks the "Publish" button
  const handleClick = async e => {
    e.preventDefault()
    // Validate user inputs
    if (!validateInputs()) {
      return
    }
    // Upload the image file to the server
    const imgUrl = await upload()
    // If the state exists, update the post using a PUT request
    try {
      state ? await axios.put(`/posts/${state.id}`, {
        title,
        desc: value,
        cat,
        img: file ? imgUrl : ""
      })
        // If the state does not exist, create a new post using a POST request
        : await axios.post(`/posts/`, {
          title,
          desc: value,
          cat,
          img: file ? imgUrl : "",
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        })
      // Redirect the user to the home page
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")
    }
  }
  // Render the component
  return (
    <div className='add'>
      <div className="content">
        {/* Input field for the post title */}
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <div className="editorContainer">
          {/* Rich text editor for the post content */}
          <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          {/* Display the post status and visibility */}
          <span>
            <b>Status :</b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          {/* Input field for the image file */}
          <input style={{ display: "None" }} type="file" id="file" onChange={e => setFile(e.target.files[0])} />
          {/* Button to upload the image file */}
          <label className='file' htmlFor="file">Upload Image</label>
          <div className="buttons">
            {/* Button to save the post as a draft !!!NOT IMPLEMENTED */}
            <button>Save as a draft</button>
            {/* Button to publish the post */}
            <button onClick={handleClick}>Publish</button>
          </div>
          {/* Display error message if there is an error */}
          {err && <p><b>{err}</b></p>}
        </div>
        <div className="item">
          <h1>Category</h1>
          {/* Radio buttons for selecting the post category */}
          <div className="cat">
            <input type="radio" checked={cat === "birthday"} name='cat' value='birthday' id='birthday' onChange={e => setCat(e.target.value)} />
            <label htmlFor="birthday">Birthday</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Events"} name='cat' value='Events' id='Events' onChange={e => setCat(e.target.value)} />
            <label htmlFor="Events">Events</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Wedding"} name='cat' value='Wedding' id='Wedding' onChange={e => setCat(e.target.value)} />
            <label htmlFor="Wedding">Wedding</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Valentines"} name='cat' value='Valentines' id='Valentines' onChange={e => setCat(e.target.value)} />
            <label htmlFor="Valentines">Valentines</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Christmas"} name='cat' value='Christmas' id='Christmas' onChange={e => setCat(e.target.value)} />
            <label htmlFor="Christmas">Christmas</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write