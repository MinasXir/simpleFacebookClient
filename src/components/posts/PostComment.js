import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Notice from "../responds/Notice";

export default function PostComment({ postName, postId }) {
  const { currentUsername } = useContext(AuthContext);
  const { posts } = useContext(AuthContext);
  const { setPosts } = useContext(AuthContext);
  const [notice, setNotice] = useState();
  const { sessionSocket } = useContext(AuthContext);
  const inputComment = useRef(null)
  const submit = async (e) => {
    e.preventDefault();
    try {
      const comment = {
        postId: postId,
        user: currentUsername.name,
        comment: inputComment.current.innerText,
      };
      await axios
        .post(`http://localhost:5000/post/comment/${postId}`, comment)
        .then((response) => {
          response.data && setNotice(response.data);
          //update main posts array by replacing the old object post.   comments with the new from the response
          setPosts(posts.map(
            post => post._id === response.data.post._id ? { ...post, comments: response.data.post.comments } : post
          ));
          if (sessionStorage.getItem("token")) {
            const commentPostSocket = {
              postId: postId,
              userName: currentUsername.name,
              userWhoGetsTheComment: postName,
            };
            sessionSocket.emit("post-comment", commentPostSocket);
          }
          inputComment.current.innerText = ""
        });
    } catch (err) {
      err.response.data.errorMessage && setNotice(err.response.data);
    }
  };
  return (
    <>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      <form style={{display:"flex"}} onSubmit={submit}>
        <div
          ref={inputComment}
          contentEditable="true"
          style={{ width: "30vw", border: "1px solid #000" }}
        >
        </div>
        <input type="submit" value="New comment"/>
      </form>
    </>
  );
}
