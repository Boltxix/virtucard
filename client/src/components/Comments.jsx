import {  useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from '../context/authContext'


const Comments = ({postId}) => {

  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/comments?postId=`+postId);
        setComments(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);


  const handleClick = async e => {
    e.preventDefault()
    try {
         await axios.post(`/comments`,{
            desc,
            postId,
        })
        
    } catch (err) {
      console.log(err)
    }
    setDesc("")
}


  
  return (
    <div className="comments">
      <div className="write">
        <img className="userImg" src={`../upload/profiles/${currentUser.img}`} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button onClick={handleClick}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment">
          <img src={`../upload/profiles/${comment.img}`} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;