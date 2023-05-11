import axios from 'axios'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useLocation, useNavigate } from 'react-router-dom'

const NewEvent = ({ setOpenUpdate }) => {
    // Get the state passed from the previous page using useLocation hook
    const state = useLocation().state
    // Set up state variables for the input fields and error messages
    const [value, setValue] = useState(state?.description || '');
    const [name, setName] = useState(state?.name || '')
    const [file, setFile] = useState(null)
    const [date, setDate] = useState(state?.date || '')
    const [location, setLocation] = useState(state?.location || '')
    const [err, setError] = useState(null)

    // Get the navigate function from react-router-dom
    const navigate = useNavigate()

    // Function to validate the input fields
    const validateInputs = () => {
        let isValid = true
        if (!name.trim()) {
            setError('Please enter an event name')
            isValid = false
        }
        if (!date) {
            setError('Please enter an event name')
            isValid = false
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/ // Regular expression to validate the date format
            if (!dateRegex.test(date)) {
                setError('Please enter a valid date')
                isValid = false
            }
        }
        if (!location.trim()) {
            setError('Please enter a location')
            isValid = false
        }
        if (!file) {
            setError('Please select an event card image')
            isValid = false
        } else {
            const allowedTypes = ['image/jpeg', 'image/png'] // Array of allowed image types
            if (!allowedTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG or PNG)')
                isValid = false
            }
            const maxSize = 5 * 1024 * 1024 // Maximum file size of 5MB
            if (file.size > maxSize) {
                setError('Please select an image file smaller than 5MB')
                isValid = false
            }
        }

        return isValid
    }

    // Function to upload the image file to the server using axios
    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file)
            const res = await axios.post("/eventUpload", formData) // Send a POST request to the server with the image file data
            return res.data // Return the URL of the uploaded image
        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded") // Display an error message if the upload fails
        }
    }

    // Function to handle the form submission
    const handleSubmit = async e => {
        e.preventDefault()

        // Validate the input fields
        if (!validateInputs()) {
            return
        }

        // Upload the image file to the server
        const imgUrl = await upload()

        try {
            // Send a POST request to the server to create a new event with the input data
            await axios.post(`/events/`, {
                name,
                img: file ? imgUrl : "",
                date: date,
                location,
                description: value
            })
            navigate('/events/') // Navigate to the events page after the event is created

        } catch (err) {
            setError(err.response?.data?.message || "An unknown error occurred, Please make sure the image has been uploaded")// Display an error message if the request fails
        }
    }

    // Render the form with input fields and error messages
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
                    <button className='create' type='submit' onClick={handleSubmit}>Create Event</button>
                </form>
                {/* On click close the new event component and reload the window  */}
                <button className='close' type='submit' onClick={() => {
                    setOpenUpdate(false)
                    window.location.reload();
                }}>Close</button>
            </div>
        </div>

    )
}

export default NewEvent