import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import Comments from '../components/Comments.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../axios";

// Define the Single page
const Single = () => {

  // Define veriables
  const [post, setPost] = useState({});
  const [commentOpen, setCommentOpen] = useState(false);

  // Get the current location and navigation objects from React Router
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the post ID from the URL
  const postId = location.pathname.split("/")[2];

  // Get the current user from the authentication context
  const { currentUser } = useContext(AuthContext);


 

  // Fetch the post data from the server when the page mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);


  // Handle the delete button click event
  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  // Fetch the likes data for the current post using React Query
  const { isLoading, data } = useQuery(["likes", postId], () =>
    makeRequest.get("/likes?postId=" + postId).then((res) => {
      return res.data
    }))

  // Get the query client object from React Query
  const QueryClient = useQueryClient()
  
  // Define a mutation function to handle like/unlike events
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + postId)
      return makeRequest.post("/likes", { postId: postId })
    },
    {
      // Invalidate the likes query cache when the mutation succeeds
      onSuccess: () => {
        QueryClient.invalidateQueries(["likes"])
      }
    }
    )
    
    if (!currentUser) { // if there is no current user, show an error message
      return <div className='error'>Please login to view more details about the post!</div>;
  }
    // Render a loading message if the likes data is still being fetched
  if (isLoading) {
    return <div>Loading...</div>

  } else {
  }
  // Handle the like button click event
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id))
  }


  // Render the post content and metadata
  return (
    <div className="single">
      <div className="content">

        <img src={`../upload/posts/${post.img}`} alt="" />
        <div className="user">
          {post.userImg && <img
            src={`../upload/profiles/${post.userImg}`}
            alt=""
          />}
          <div className="user">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        {/* Display the post description, sanitized to prevent XSS attacks */}
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}></p>
        <div className="info">
          <div className="item">
            {/* Display the number of likes for the post, and a heart icon that toggles the like status when clicked */}
            {isLoading ? "loading"
              : data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
              ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike} />
              )}
            {data.length} Likes
          </div>

          {/* Display a message outline icon that toggles the comment section when clicked */}
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
      {/* Display the menu component with the post category */}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;