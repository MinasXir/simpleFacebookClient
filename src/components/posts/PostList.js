import React, { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import PostComment from "./PostComment";
import Notice from "../responds/Notice";
import Toggle from "../toggle/Toggle";

function PostList() {
  const { currentUsername } = useContext(AuthContext);
  const { sessionSocket } = useContext(AuthContext);
  const { posts } = useContext(AuthContext);
  const { setPosts } = useContext(AuthContext)
  const [notice, setNotice] = useState();

  const deletePost = async (postId) => {
    await axios
      .delete(`http://localhost:5000/post/deletepost/${postId}`)
      .then((response) => {
        response.data && setNotice(response.data);
        //update posts array by removing the post
        setPosts(posts.filter(post => post._id !== postId))
      });
  };

  const deleteComment = async (commentId, postId) => {
    const commentToDelete = {
      commentId: commentId,
    };
    await axios
      .put(
        `http://localhost:5000/post/deletecomment/${postId}`,
        commentToDelete
      )
      .then((response) => {
        response.data && setNotice(response.data);
        //update main posts array by replacing the old object post.   comments with the new from the response
        setPosts(posts.map(
          post => post._id === response.data.post._id ? { ...post, comments: response.data.post.comments } : post
        ))
      });
  };
  async function likePost (event, postId, userName, userWhoGetsTheLike) {
    const likePost = {
      userName: userName,
    };
    if (event.target.innerText === "Like the post" && sessionStorage.getItem("token")){
  sessionSocket.emit("post-like", userWhoGetsTheLike);}
    else { sessionSocket.emit("post-dislike", userWhoGetsTheLike); }
 
    await axios
      .put(`http://localhost:5000/post/likepost/${postId}`, likePost)
      .then((response) => {
        response.data && setNotice(response.data);
        //update main posts array by replacing the old object post.   comments with the new from the response
        setPosts(posts.map(
          post => post._id === response.data.post._id ? { ...post, likes: response.data.post.likes } : post
        ))
      });
  };

  const divstyle = (color) => {
    return {
      border: `1px solid ${color}`,
      padding:"25px",
      overflowWrap: `break-word`,
      marginBottom:"20px",
      backgroundColor:"rgb(248, 248, 248)",
      position:"relative",
      boxShadow: ` 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`
    };
  };
  const divsAbsoluteStyle = (box) => {
    return {
      backgroundColor: box !== "delete" && "#1B74E4", 
      color: "#fff", 
      position: "absolute",
      left: box === "name" ? "0" : null,
      right: box === "delete" || box === "FullPost" ? "0" : null , 
      top: box === "name" || box === "delete" ?  "0" : null, 
      bottom: box === "FullPost" ? "0" : null,
      padding: "5px"
  };
};

  function renderPosts() {
    return posts.map((post, i) => {
      return (
        <div className={`class${post._id ? post._id : ""}`} style={divstyle("#999")} key={i}>
          <div style={divsAbsoluteStyle("name")}>{post.name}</div>
            <br></br>
           {post.post}
          <br></br>
          <div style={{fontSize:"60%"}}>{post.dates.created.substring(0, post.dates.created.length - 8).replace("T", "  ")}</div>
          <br></br>
          <div style={{ display: "flex" }}>
          <button onClick={(event) => likePost(event, post._id, currentUsername.name, post.name)}>
              {post.likes.find((element) => element.user === currentUsername.name) ? "👎" : "👍"}
            </button>
          <Toggle buttonName={`${post.likes.length}`}>
            {post.likes.map((like, i) => {
              return (
                <div key={like.user}>
                  {like.user === null ? "Removed user" : like.user}
                </div>
              );
            })}
          </Toggle>
          </div>
          {post.name === currentUsername.name && (
            <button style={divsAbsoluteStyle("delete")} onClick={() => deletePost(post._id)}>{"🗑️"}</button>
          )}
          <br></br>
          <PostComment postName={post.name} postId={post._id} />
          <br></br>
          {post.comments.length > 0 && 
            <Toggle buttonName={post.comments.length ? `💬 ${post.comments.length}` : "No comments yet"}>
              {post.comments.slice(0).reverse().map((comment, i) => {
            return (
              <div style={{ backgroundColor:"#fff", padding:"10px", marginBottom:"8px", position:'relative'}} key={i}>
                <div style={{ fontSize: "80%", color:"#1B74E4",fontStyle:"italic" }}>{comment.user}</div>
                <div style={{ fontSize: "80%", fontWeight: "600" }}>{comment.comment}</div>
                <div style={{ fontSize: "50%", marginBottom:"5px"}}>{comment.date.substring(0, comment.date.length - 8).replace("T", "-")}</div> 
                 {comment.user === currentUsername.name && (
                  <button
                    style={divsAbsoluteStyle("delete")}
                    onClick={() => deleteComment(comment._id, comment.postId)}
                  >
                    {"🗑️"}
                  </button>
                )}
              </div>
            );
          })}
          </Toggle>}
          <Link style={divsAbsoluteStyle("FullPost")} to={`/post/${post._id}`}>Full post</Link>
        </div>
      );
    });
  }

  return (
    <>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      {renderPosts()}
    </>
  );
}

export default PostList;
