import {  useState } from "react";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from '../context/authContext'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import defProfileImg from '../img/profile.png'


const Comments = ({postId}) => {

  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

const {isLoading, error, data} = useQuery(["comments"], () =>
makeRequest.get("/comments?postId="+ postId).then((res)=>{
  return res.data
}))

const queryClient = useQueryClient();

const mutation = useMutation(
  (newComment) => {
    return makeRequest.post("/comments", newComment)
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"])
    },
  }
)

  const handleClick = async e => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
}


  
  return (
    <div className="comments">
      <div className="write">
        <img className="userImg" src={currentUser.img ? `../upload/profiles/${currentUser.img}` : defProfileImg} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
        <div className="comment">
          <img src={comment.img ? `../upload/profiles/${comment.img}` : defProfileImg} alt="" />
          <div className="info">
            <span>{comment.username}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;