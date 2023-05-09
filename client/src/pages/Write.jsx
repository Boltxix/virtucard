import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from "axios"
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'



const Write = () => {
  const state = useLocation().state
  const [value, setValue] = useState(state?.desc || '');
  const [title, setTitle] = useState(state?.title || '');
  const [file, setFile] = useState('null');
  const [cat, setCat] = useState(state?.cat || '');

  const [err, setError] = useState(null)

  const navigate = useNavigate()

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

  const handleClick = async e => {
    e.preventDefault()
    const imgUrl = await upload()

    try {
      state ? await axios.put(`/posts/${state.id}`, {
        title,
        desc: value,
        cat,
        img: file ? imgUrl : ""
      })
        : await axios.post(`/posts/`, {
          title,
          desc: value,
          cat,
          img: file ? imgUrl : "",
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        })
        navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")
    }
  }

  return (
    <div className='add'>
      <div className="content">
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <div className="editorContainer">
          <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status :</b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input style={{ display: "None" }} type="file" id="file" onChange={e => setFile(e.target.files[0])} />
          <label className='file' htmlFor="file">Upload Image</label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
          {err && <p><b>{err}</b></p>}
        </div>
        <div className="item">
          <h1>Category</h1>
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