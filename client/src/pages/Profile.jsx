import React, { useContext, useEffect, useState } from 'react'
import defProfileImg from '../img/profile.png'
import Update from '../components/Update';
import { AuthContext } from "../context/authContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";





const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false) // state to control whether the update component is open or not
    const [user, setUser] = useState({}); // state to store the user data
    const { currentUser, logout } = useContext(AuthContext); // get the current user and logout function from the auth context
    const navigate = useNavigate(); // hook to navigate to different routes

    const userId = currentUser ? currentUser.id : null; // get the user id from the current user object

    useEffect(() => { // fetch user data when the component mounts or when the user id changes
        const fetchData = async () => {
            try {
                const res = await axios.get(`/user/${userId}`); // make a GET request to the server to get the user data
                setUser(res.data[0]) // set the user state to the data returned from the server
            } catch (err) {
                console.log(err)
            }
        }
        if (userId) { // only fetch data if the user id exists
            fetchData();
        }
    }, [userId])

    const handleDelete = async () => { // function to handle deleting the user profile

        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone and all your posts and events will be deleted.");
        if (confirmDelete) { // if the user confirms the deletion
            try {
                await axios.delete(`/user/${userId}`) // make a DELETE request to the server to delete the user profile
                logout() // call the logout function from the auth context to log the user out
                navigate("/") // navigate to the home page
            } catch (err) {
                console.log(err)
            }
        }
    }

    if (!currentUser) { // if there is no current user, show an error message
        return <div className='error'>Please login to view your profile.</div>;
    }
    //Render the profile page
    return (
        <div className='profile'>
            <div className="content">
                {user && user.img ? (
                    <img src={`/upload/profiles/${user.img}`} alt="" />
                ) : (
                    <img src={defProfileImg} alt="" />
                )}
                <h1>{user.username}</h1>
                <h3>{user.email}</h3>
                <div className="menuButtons">
                    <button onClick={() => setOpenUpdate(true)}>Edit Profile</button>
                    <button onClick={handleDelete}>Delete Profile</button>
                </div>
            </div>
            {/* Open the update component */}
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
        </div>
    )
}

export default Profile