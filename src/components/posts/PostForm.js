import axios from "axios";
import React, { useState, useContext, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import Notice from "../responds/Notice";

function PostForm() {
  const { currentUsername } = useContext(AuthContext);
  const { sessionSocket } = useContext(AuthContext);
  const [notice, setNotice] = useState();
  const { posts } = useContext(AuthContext);
  const { setPosts } = useContext(AuthContext);
  const { onlineUsers } = useContext(AuthContext);

  const inputPost = useRef(null);
  async function savePost(e) {
    e.preventDefault();
    try {
      const sendPost = {
        post: inputPost.current.innerText,
        name: currentUsername.name,
      };
      await axios
        .post("http://localhost:5000/post/", sendPost)
        .then((response) => {
          response.data && setNotice(response.data);
          //add the response object post to the posts array at index 0
          //and rerender locally postList in order to avoid the getPosts
          if (response.data.post) {
            setPosts([response.data.post].concat(posts));
            sessionSocket.emit("new-post", sendPost.name);
            inputPost.current.innerText = "";
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      <form
        onSubmit={savePost}
        style={{
          display: "flex",
        }}
      >
        <div
          ref={inputPost}
          contentEditable="true"
          style={{
            width: "80%",
            height: "7vh",
            overflowY: "auto",
            border: `1px solid`,
            borderImageSlice: "1",
            borderImageSource: `linear-gradient(to left, #444, #111)`,
          }}
        ></div>
        <input
          style={{
            width: "20%",
            background: "#000",
            color: "#fff",
            border: "none",
          }}
          type="submit"
          value="NEW POST"
        />
      </form>
    </div>
  );
}

export default PostForm;
