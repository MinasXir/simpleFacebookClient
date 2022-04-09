import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Notice from "../components/responds/Notice";
const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [currentUsername, setCurrentUsername] = useState({});
  const [posts, setPosts] = useState([]);
  const [sessionSocket, setSessionSocket] = useState();
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rerenderCheck, setRerenderCheck] = useState(false);
  const [chatMessage, setchatMessage] = useState(null);
  const [notice, setNotice] = useState();
  const [NotificationsLikes, setNotificationsLikes] = useState([]);
  const [NotificationsComments, setNotificationsComments] = useState([]);

  async function getNotifications() {
    const notifications = await axios.get(
      "http://localhost:5000/auth/notifications"
    );
    setNotifications(notifications.data);
    setNotificationsLikes(notifications.data.postLikesNotSeen);
    setNotificationsComments(notifications.data.postCommentsNotSeen);
  }

  function changeStateToRerender() {
    setRerenderCheck(!rerenderCheck);
    window.scrollTo(0, 0);
    getNotifications();
  }

  function handleSocketUsers(userName) {
    const socket = io("http://localhost:5000/", {
      transports: ["websocket"],
      forceNode: true,
      auth: {
        token: sessionStorage.getItem("token"),
      },
    });
    socket.emit("new-user", userName);
    setSessionSocket(socket);
    socket.on("users-list-connected", (users) => {
      setOnlineUsers(users);
    });
    socket.on("post-like-notification", (messageAndPost) => {
      setNotice(messageAndPost.message);
      setNotificationsLikes(NotificationsLikes => [messageAndPost.post , ...NotificationsLikes])
      setPosts(posts => posts.map(
        post => post._id === messageAndPost.post._id ? { ...post, likes: messageAndPost.post.likes } : post
      ))
    });
    socket.on("post-dislike-notification", (personWhoDisLikedYourPost) => {
      setPosts(posts => posts.map(
        post => post._id === personWhoDisLikedYourPost.post._id ? { ...post, likes: personWhoDisLikedYourPost.post.likes } : post
      ))
      if (personWhoDisLikedYourPost !== currentUsername.name)
        setNotice(personWhoDisLikedYourPost.message);
    });
    socket.on("post-comment-notification", (messageAndPost) => {
      setNotificationsComments(NotificationsComments => [messageAndPost.post, ...NotificationsComments])
      setPosts(posts => posts.map(
        post => post._id === messageAndPost.post._id ? { ...post, comments: messageAndPost.post.comments } : post
      ))
      if (messageAndPost.name !== currentUsername.name) 
        setNotice(messageAndPost.message);
    });
    socket.on("message", (message) => {
      setchatMessage(message)
    });
    socket.on("newPost", (postAndUser) => {
      setPosts(postAndUser.posts)
      setNotice(postAndUser.message);
    });
  }

  //for click on posts route , passing it on context api props
  async function getLoggedIn() {
    const loggedInRes = await axios.get("http://localhost:5000/auth/loggedIn");
    setLoggedIn(loggedInRes.data.userIs);
    if (loggedInRes.data.name) {
      setCurrentUsername(loggedInRes.data);
      if (sessionStorage.getItem("token"))
       handleSocketUsers(loggedInRes.data.name);
       getNotifications();
    } else return false;
  }

  useEffect(() => {
    const loggedInRes = async () => {
      const loggedInRes = await axios.get(
        "http://localhost:5000/auth/loggedIn"
      );
      setLoggedIn(loggedInRes.data.userIs);
      if (loggedInRes.data.name)
        setCurrentUsername(loggedInRes.data);
        handleSocketUsers(loggedInRes.data.name);
      getNotifications();
    };
    loggedInRes();
  }, []);

  return (
    <>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      <AuthContext.Provider
        value={{
          loggedIn,
          currentUsername,
           posts,
          setPosts,
          sessionSocket,
          onlineUsers,
          notifications,
          getLoggedIn,
          rerenderCheck,
          changeStateToRerender,
          NotificationsLikes,
          NotificationsComments,
          chatMessage
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </>
  );
}

export default AuthContext;
export { AuthContextProvider };
