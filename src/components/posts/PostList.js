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
    console.log("sasa")
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
    await axios
      .put(`http://localhost:5000/post/likepost/${postId}`, likePost)
      .then((response) => {
        response.data && setNotice(response.data);
        //update main posts array by replacing the old object post.   comments with the new from the response
        setPosts(posts.map(
          post => post._id === response.data.post._id ? { ...post, likes: response.data.post.likes } : post
        ));
        const likePostSocket = {
          postId, userName, userWhoGetsTheLike,
        };
        if (event.target.className !== "greyIcon" && sessionStorage.getItem("token")) {
          sessionSocket.emit("post-like", likePostSocket);
        }
        else {
          sessionSocket.emit("post-dislike", likePostSocket);
        }
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
      backgroundColor: box !== "delete" && "rgb(68, 68, 68)", 
      color: "#fff", 
      position: "absolute",
      left: box === "name" ? "0" : null,
      right: box === "delete" || box === "FullPost" ? "0" : null , 
      top: box === "name" || box === "delete" ?  "0" : null, 
      bottom: box === "FullPost" ? "0" : null,
      padding: "5px",
      zIndex:"2"
  };
};

function likesCasesDisplay(post){
  if (post.likes.find(like => like.user === currentUsername.name) && post.likes.length > 1 )
  return <span>Yours and {post.likes.length - 1} likes</span>
  if (post.likes.find(like => like.user === currentUsername.name) && post.likes.length === 1)
  return <span>You liked it first</span>
  if (!post.likes.find(like => like.user === currentUsername.name) && post.likes.length > 1)
    return <span>{post.likes.length} liked this post</span>
  else return <span>No likes yet</span>
}

  function renderPosts() {
    return posts.map((post, i) => {
      return (
        <div className={`class${post._id ? post._id : ""}`} style={divstyle("#999")} key={i}>
          <div style={divsAbsoluteStyle("name")}>{post.name}</div>
          {post.name === currentUsername.name && (
            <button style={divsAbsoluteStyle("delete")} onClick={() => deletePost(post._id)}>{"🗑️"}</button>
          )}
            <br></br>
           {post.post}
          <br></br>
          <div style={{fontSize:"60%"}}>{post.dates.created.substring(0, post.dates.created.length - 8).replace("T", "  ")}</div>
          <br></br>
          <PostComment postName={post.name} postId={post._id} />
          <br></br>
          <div style={{ display: "flex", alignItems:"center" }}>
          <div onClick={(event) => likePost(event, post._id, currentUsername.name, post.name)}>
              {post.likes.find((element) => element.user === currentUsername.name) ? <div style={{
                cursor: "pointer", margin: "0px 10px 7px 0px", color: "transparent", textShadow: `0 0 0 #2672ff` }}>👍</div> : <div className="greyIcon" style={{margin: "0px 10px 7px 0px" }}>👍</div>}
              </div>
                <Toggle buttonName={likesCasesDisplay(post)}>
            {post.likes.map((like, i) => {
              return (
                <div key={i}>
                  {like.user === null ? "Removed user" : <button>{like.user}</button>}
                </div>
              );
            })}
          </Toggle>
            <div style={{ margin: "0px 0px 5px 10px" }}>
              <Toggle buttonName={`💬 ${post.comments.length}`}>
                {post.comments.slice(0).reverse().map((comment, i) => {
                  return (
                    <div style={{position:"relative"}} key={i}>
                      <div style={{ fontSize: "80%", color: "#555", fontStyle: "italic" }}>{comment.user}</div>
                      <br></br>
                      <div>{comment.comment}</div>
                      <div style={{ fontSize: "50%", marginBottom: "5px" }}>{comment.date.substring(0, comment.date.length - 8).replace("T", "-")}</div>
                      {comment.user === currentUsername.name && (
                        <button
                          style={divsAbsoluteStyle("delete")}
                          onClick={() => deleteComment(comment._id, comment.postId)}
                        >
                          {"🗑️"}
                        </button>
                      )}
                      <hr></hr>
                    </div>
                  );
                })}
              </Toggle>
            </div>
          </div>
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
