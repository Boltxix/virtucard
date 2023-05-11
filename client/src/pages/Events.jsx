import React, { useEffect, useState, useContext } from 'react'
import NewEvent from '../components/NewEvent'
import { Link, } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from "../context/authContext";

//Define the Events component
const Events = () => {
    // Define state variables using the useState hook
    const [openUpdate, setOpenUpdate] = useState(false)
    const [events, setEvents] = useState([])

    // Get the current user from the authentication context using the useContext hook
    const { currentUser } = useContext(AuthContext);

    // Get the user ID from the current user object, or set it to null if the user is not logged in
    const userId = currentUser ? currentUser.id : null;

    // Use the useEffect hook to fetch the events data from the server when the component mounts or the user ID changes
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
    // Define a function to handle event deletion using the HTTP DELETE request
    const handleDelete = async (eventId) => {
        // Show a confirmation dialog before deleting the event
        const confirmDelete = window.confirm("Are you sure you want to delete your event?");
        if (confirmDelete) {
            try {
                // Send the HTTP DELETE request to the server
                await axios.delete(`/events/${eventId}`);
                // Remove the deleted event from the events array using the setEvents function
                setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            } catch (err) {
                console.log(err);
            }
        }
    };
    // If the user is not logged in, display an error message
    if (!currentUser) {
        return <div className='error'>Please login to view your events.</div>;
    }
    // Render the component's HTML using JSX syntax
    return (
        <div className='events'>
            <div className="new">
                {/* Show the NewEvent component when the user clicks the "Create Event" button */}
                <button className='btn' onClick={() => setOpenUpdate(true)}>Create Event</button>
                {openUpdate && <NewEvent setOpenUpdate={setOpenUpdate} />}
            </div>
            <h2 className='title'>Below you can find the list of all your planned events</h2>
            <div className="allEvents">
                {/* Map over the events array and render an HTML element for each event */}
                {events.map((event) => (
                    <div className="event" key={event.id}>
                        <div className="img">
                            <img src={`/upload/events/${event.img}`} alt="" />
                        </div>
                        <div className="content">
                            <h1>{event.name}</h1>
                            <p>{new Date(event.date).toLocaleString()}</p>
                            <p>{event.location}</p>
                            {/* Use the Link component from React Router to navigate to the event details page */}
                            <Link className="link" to={`/events/${event.id}`}>

                                <button className='detailBtn'>Details</button>
                            </Link>
                            {/* Call the handleDelete function when the user clicks the "Delete" button */}
                            <button className='deleteBtn' onClick={() => handleDelete(event.id)}>Delete</button>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

// Export the Events component as the default export of this module
export default Events