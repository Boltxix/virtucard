import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DOMPurify from "dompurify";


const Event = () => {
const [event, setEvent] = useState({});
const location = useLocation();

const eventId = location.pathname.split("/")[2];

useEffect(()=>{
  const fetchData = async () => {
    try {
      const res = await axios.get(`/events/${eventId}`)
      setEvent(res.data[0])
      

    } catch (err) {
      console.log(err)
      
    }
  }
  fetchData()
}, [eventId])


  return (
    <div className="event">
      <div className="eventContent">
        <img src={`../upload/events/${event.img}`} alt="" />
        <h1>{event.name}</h1>
        <div className="info">
          <label>Date</label>
          <p>{new Date(event.date).toLocaleString()}</p>
          <label>Location</label>
          <p>{event.location}</p>
          <label>Description</label>
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