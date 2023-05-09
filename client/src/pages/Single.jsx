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
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Comments from '../components/Comments.jsx';
import {  useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../axios";




const Single = () => {
  const [post, setPost] = useState({});
  const [commentOpen, setCommentOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);


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



  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  const { isLoading, error, data } = useQuery(["likes", postId], () =>
    makeRequest.get("/likes?postId=" + postId).then((res) => {
      return res.data
    }))

  const QueryClient = useQueryClient()

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId="+ postId)
      return makeRequest.post("/likes", { postId: postId })
    },
    {
      onSuccess: () => {
        QueryClient.invalidateQueries(["likes"])
      }
    }
  )


  if (isLoading) {
    return <div>Loading...</div>

  } else {
  }

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id))
  }

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
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}></p>
        <div className="info">
          <div className="item">
            {isLoading ? "loading" 
            : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data.length} Likes
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;