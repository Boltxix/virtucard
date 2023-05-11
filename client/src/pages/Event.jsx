import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DOMPurify from "dompurify";


const Event = () => {
  // Define state variables
  const [event, setEvent] = useState({});
  // Get the current location using the "useLocation" hook from React Router
  const location = useLocation();
  // Extract the event ID from the URL path
  const eventId = location.pathname.split("/")[2];

  // Fetch event data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Axios to make a GET request to the server
        const res = await axios.get(`/events/${eventId}`)
        // Update the state with the fetched event data
        setEvent(res.data[0])


      } catch (err) {
        console.log(err)

      }
    }
    fetchData()
  }, [eventId])

  // Render the event information
  return (
    <div className="event">
      <div className="eventContent">
        {/* Display the event image */}
        <img src={`../upload/events/${event.img}`} alt="" />
        {/* Display the event name */}
        <h1>{event.name}</h1>
        <div className="info">
          {/* Display the event date */}
          <label>Date</label>
          <p>{new Date(event.date).toLocaleString()}</p>
          {/* Display the event location */}
          <label>Location</label>
          <p>{event.location}</p>
          {/* Display the event description */}
          <label>Description</label>
          {/* Use the "dangerouslySetInnerHTML" attribute to render the event description as HTML */}
          {/* Sanitize the HTML using the DOMPurify library to prevent XSS attacks */}
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event.description),
            }}></p>
        </div>
      </div>
    </div>
  )
}

export default Event