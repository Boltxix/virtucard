import React, { useEffect, useState, useContext } from 'react'
import NewEvent from '../components/NewEvent'
import { Link, } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from "../context/authContext";


const Events = () => {
    const [openUpdate, setOpenUpdate] = useState(false)
    const [events, setEvents] = useState([])
    const { currentUser} = useContext(AuthContext);


    const userId = currentUser ? currentUser.id : null;
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/events/${userId}`)
                setEvents(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
}, [userId])

const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your event?");
    if (confirmDelete) {
      try {
        await axios.delete(`/events/${eventId}`);
        // Remove the deleted event from the events array
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!currentUser) {
    return <div className='error'>Please login to view your events.</div>;
  }

    return (
        <div className='events'>
            <div className="new">
                <button className='btn' onClick={() => setOpenUpdate(true)}>Create Event</button>
                {openUpdate && <NewEvent setOpenUpdate={setOpenUpdate} />}
            </div>
            <h2 className='title'>Below you can find the list of all your planned events</h2>
            <div className="allEvents">
                {events.map((event) => (
                    <div className="event" key={event.id}>
                        <div className="img">
                            <img src={`/upload/events/${event.img}`} alt="" />
                        </div>
                        <div className="content">
                            <h1>{event.name}</h1>
                            <p>{new Date(event.date).toLocaleString()}</p>
                            <p>{event.location}</p>
                            <Link className="link" to={`/events/${event.id}`}>
                                   
                                <button className='detailBtn'>Details</button>
                            </Link>
                            <button className='deleteBtn' onClick={() => handleDelete(event.id)}>Delete</button>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Events