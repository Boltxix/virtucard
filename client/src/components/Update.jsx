import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/authContext'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import defProfileImg from '../img/profile.png'



const Update = ({ setOpenUpdate, user }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [newImg, setNewImg] = useState(null)
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  function urlImg(newImg) {
    if (!newImg) {
      return null;
    } else {
      return URL.createObjectURL(newImg);

    }
  }

  const { currentUser } = useContext(AuthContext);
  const { setCurrentUser } = useContext(AuthContext)

  const validateInputs = () => {
    let isValid = true;

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };


  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await axios.post("/profileUpload", formData)
      return res.data
    } catch (err) {
      setMessage("An error occurred uploading the image")
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    if (file && file.name && file.name.includes(" ")) {
      setMessage("File name should not contain spaces");
      return;
    }

    let imgUrl = "";
    if (file) {
      imgUrl = await upload();
      if (!imgUrl) {
        setMessage("An error occurred uploading the image");
        return;
      }
    }

    try {
      const response = await axios.put(`/user/${currentUser.id}`, {
        username,
        email,
        img: file ? imgUrl : ""
      });

      setMessage(response.data);
      setCurrentUser({
        ...user,
        username,
        email,
        img: file ? Date.now() + newImg.name : user.img
      });
    } catch (err) {
      console.log(err);
      setMessage(err.response.data);
    }
  };

  return (
    <div className='update'>
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="files">
            <label htmlFor="file">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img src={urlImg(newImg) ? urlImg(newImg) : (user.img ? `/upload/profiles/${user.img}` : defProfileImg)} alt="" />
                <CloudUploadIcon className='icon' />
              </div>
            </label>
            <input
              type='file'
              id="file"
              style={{ display: "none" }}
              onChange={e => {
                setFile(e.target.files[0]);
                setNewImg(e.target.files[0]);
              }}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={currentUser.username}
            name="username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p className="error">{usernameError}</p>}
          <label>Email</label>
          <input
            type="email"
            placeholder={currentUser.email}
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}
          <p>{message}</p>
          <button type='submit'>Update</button>
        </form>
        <button className='close' onClick={() => {
          setOpenUpdate(false);
          window.location.reload();
        }}>Close</button>
      </div >
    </div>

  )
}

export default Update;