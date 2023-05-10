import axios from 'axios'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useLocation, useNavigate } from 'react-router-dom'

const NewEvent = ({ setOpenUpdate }) => {
    const state = useLocation().state
    const [value, setValue] = useState(state?.description || '');
    const [name, setName] = useState(state?.name || '')
    const [file, setFile] = useState(null)
    const [date, setDate] = useState(state?.date || '')
    const [location, setLocation] = useState(state?.location || '')

    const [err, setError] = useState(null)

    const navigate = useNavigate()

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file)
            const res = await axios.post("/eventUpload", formData)
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const imgUrl = await upload()

        try {
            await axios.post(`/events/`, {
                name,
                img: file ? imgUrl : "",
                date: date,
                location,
                description: value
            })
            navigate('/events/')

        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")
        }
    }

    return (
        <div className='newEvent'>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>New Event</h1>
                    <label>Event Name :</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    <label>Event Card :</label>
                    <input type="file" id='file' onChange={e => { setFile(e.target.files[0]) }} />

                    <label>Date and Time of Event : </label>
                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
                    <label>Location of Event : </label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
                    <label>Description of Event : </label>
                    <div className="editorContainer">
                        <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />
                    </div>
                    {err && <p><b>{err}</b></p>}
                    <button className='create' onClick type='submit '>Create Event</button>
                </form>
                <button className='close' onClick={() => {
                    setOpenUpdate(false)
                    window.location.reload();
                }}>Close</button>
            </div>
        </div>

    )
}

export default NewEvent