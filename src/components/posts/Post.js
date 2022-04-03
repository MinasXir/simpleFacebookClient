import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Notice from "../responds/Notice";
import Toggle from "../toggle/Toggle";
import { useLocation } from "react-router-dom";

function Post() {
  const [post, setPost] = useState([]);
  const location = useLocation();
  const { currentUsername } = useContext(AuthContext);
  const [notice, setNotice] = useState();
  const [NewComment, setNewComment] = useState();
  const [DeletedPostMessage, setDeletedPostMessage] = useState("");
 

  async function getPost() {
    const postRes = await axios.get(
      `http://localhost:5000/post${window.location.pathname}`
    );
    if (postRes.data.length) return setPost(postRes.data);
    return setDeletedPostMessage("The post has been deleted");
  }

  useEffect(() => {
    //mounted helps in useEffect errors about memory
    let isCancelled = false;
    if (!isCancelled) {
      getPost();
     // getNotifications();
    return () => {
      isCancelled = true;
    };
  }
  }, [location]);

  const deletePost = async (postId) => {
    await axios.delete(`http://localhost:5000/post/deletepost/${postId}`);
    getPost()
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
        getPost();
      });
  };
  const likePost = async (postId, userName) => {
    const likePost = {
      userName: userName,
    };
    await axios
      .put(`http://localhost:5000/post/likepost/${postId}`, likePost)
      .then((response) => {
        response.data && setNotice(response.data);
        getPost();
      });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const comment = {
        postId: e.target.parentNode.className,
        user: currentUsername,
        comment: NewComment,
      };
      await axios
        .post(
          `http://localhost:5000/post/comment/${e.target.parentNode.className}`,
          comment
        )
        .then((response) => {
          response.data && setNotice(response.data);
          getPost();
          e.target.firstChild.value = "";
        });
    } catch (err) {
      err.response.data.errorMessage && setNotice(err.response.data);
    }
  };

  const divstyle = (color) => {
    return {
      border: `1px solid ${color}`,
      padding: color === "#999" ? "35px" : "0px",
      overflowWrap: `break-word`,
      backgroundColor: "rgb(248, 248, 248)",
      width:"70vw",
      position: "relative",
      boxShadow: ` 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`
    };
  };
  function renderPost() {
    return post.map((post, i) => {
      return (
        <div className={`${post._id}`} style={divstyle("#444")} key={i}>
          {post.name} - {post.post}
          <Toggle buttonName={`Likes:${post.likes.length}`}>
            {post.likes.map((like, i) => {
              return (
                <div key={i}>
                  {like.user === null ? "User is out of the app" : like.user}
                </div>
              );
            })}
          </Toggle>
          <br></br>
          {post.likes.find((element) => element.user === currentUsername.name) ? (
            <button onClick={() => likePost(post._id, currentUsername.name)}>
              Disslike the post
            </button>
          ) : (
            <button onClick={() => likePost(post._id, currentUsername.name)}>
              Like the post
            </button>
          )}
          {post.name === currentUsername.name && (
            <button onClick={() => deletePost(post._id)}>Delete post</button>
          )}
          <form onSubmit={submit}>
            <input
              type="text"
              placeholder="New comment"
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              onClick={(e) => setNewComment("")}
            />
            <input type="submit" />
          </form>
          <br></br>
          {post.comments &&
            post.comments.map((comment, i) => {
              return (
                <div style={divstyle("red")} key={i}>
                  <span>{comment.user}</span> - <span>{comment.comment}</span>-{" "}
                  <span>{comment.date.substring(0, comment.date.length - 8).replace("T", "  ")}</span>
                  {comment.user === currentUsername.name && (
                    <button
                      onClick={() => deleteComment(comment._id, comment.postId)}
                    >
                      Delete comment
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      );
    });
  }

  return (
    <>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      {post.length > 0 ? <ul>{renderPost()}</ul> : <p>{DeletedPostMessage} </p>}
    </>
  );
}

export default Post;
