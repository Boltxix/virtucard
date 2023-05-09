import React, { useContext, useEffect, useState } from 'react'
import defProfileImg from '../img/profile.png'
import Update from '../components/Update';
import { AuthContext } from "../context/authContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";





const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false)
    const [user, setUser] = useState({});
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const userId = currentUser ? currentUser.id : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/user/${userId}`);
                setUser(res.data[0])
            } catch (err) {
                console.log(err)
            }
        }
        if (userId) {
            fetchData();
        }
    }, [userId])

    const handleDelete = async () => {

        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone and all your posts and events will be deleted.");
        if(confirmDelete){
            try {
                await axios.delete(`/user/${userId}`)
                logout()
                navigate("/")
            } catch (err) {
                console.log(err)
            }
        }
    }

    if (!currentUser) {
        return <div className='error'>Please login to view your profile.</div>;
      }

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
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
        </div>
    )
}

export default Profile