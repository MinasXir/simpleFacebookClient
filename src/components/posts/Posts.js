import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";
import AuthContext from "../../context/AuthContext";
import Loader from "../loader/Loader";


function Posts() {
  const [isLoading, setisLoading] = useState(false);
  const { loggedIn } = useContext(AuthContext);
  const { onlineUsers } = useContext(AuthContext);
  const { setPosts } = useContext(AuthContext)
  const { posts } = useContext(AuthContext)
  const { rerenderCheck } = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn) {
      async function getPosts() {
        try {
          setisLoading(true)
          const postData = await axios.get("http://localhost:5000/post");
          await setPosts(postData.data);
          setisLoading(false)
        }
        catch (err) {
          alert(err.response.data.errorMessage)
        }
      }
      getPosts()
    } else return false;
  }, [loggedIn, rerenderCheck, setPosts]);

  const postsContainerStyle = () => {
    return {
      // display: "grid",
      // gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))",
      // gap: "10px",
      width: onlineUsers.length > 1 ? "75vw": "85vw",
      height:"100%",
      marginLeft:"5vw",
      marginTop: "10vh",
    };
  };
  if (loggedIn === true || loggedIn === "admin") {
    return (
      <>
        {isLoading && <Loader />}
        <div style={postsContainerStyle()} >
          <PostForm />
          <br></br>
          <PostList setPosts={setPosts} posts={posts}/>
        </div>
      </>
    );
  } else
    return false;
}

export default Posts;
