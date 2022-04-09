import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import LogOutBtn from "../auth/LogOutBtn";
import Toggle from "../toggle/Toggle";
import axios from "axios";
function Navbar() {
  const { loggedIn } = useContext(AuthContext);
  const { currentUsername } = useContext(AuthContext);
  const { notifications } = useContext(AuthContext);
  const { NotificationsComments } = useContext(AuthContext);
  const { NotificationsLikes } = useContext(AuthContext);

  //updates posts useEfFect component when the Link is clicked in case we already in posts page but we need to get latests post and scroll up.
  const { changeStateToRerender } = useContext(AuthContext);

  const NavBarStyle = () => {
    return {
      display: `${loggedIn === true || loggedIn === "admin" ? "flex" : "none"}`,
      justifyContent: "space-around",
      alignItems: "center",
      height: "8vh",
      width: "100vw",
      position: "sticky",
      top: "0",
      backgroundColor: "rgb(248, 248, 248)",
      zIndex: "1",
    };
  };

  const NavBarItemStyle = (adminName) => {
    return {
      backgroundColor: "#fff",
      color: adminName ? "#2672ff" : "#000",
      borderRadius: "5px",
      padding: "5px",
      display:"flex",
      justifyContent: "center",
      alignItems: "center",
      cursor:"pointer"
    };
  };

  const NotificationLikeStyle = (item) => {
    return {
      display: `block`,
      border: `1px solid black`,
      color: `#333`,
      width: `15vw`,
      padding: `10px`,
      margin: `10px 0px 10px 0px`,
      opacity: item.seen === true ? "0.3" : "1"
    };
  };

  async function readNotification(postId, userWhoLikedThePost) {
    await axios.put(`http://localhost:5000/post/readNotification/${postId}`, {
      user: userWhoLikedThePost,
    });
  }
  async function readNotificationComment(postId, userWhoLikedThePost) {
    await axios.put(
      `http://localhost:5000/post/readNotificationComment/${postId}`,
      {
        user: userWhoLikedThePost,
      }
    );
  }

  return (
    <>
      {(loggedIn === true || loggedIn === "admin") && (
        <div style={NavBarStyle()}>
          <Link
            style={NavBarItemStyle()}
            onClick={changeStateToRerender}
            to="/"
          >
            Posts
          </Link>
          <Link style={NavBarItemStyle()} to="/users">
            Users
          </Link>
          <div style={{ display: "flex", justifyContent:"space-between", width:'90px' }}>
            <Toggle
              buttonName={<ul style={NavBarItemStyle()}><li>👍</li><li>{
                NotificationsLikes.length ? NotificationsLikes.length : 0
              }</li></ul>}>
              <h3>Likes</h3>
              {notifications &&
                NotificationsLikes.map((notification, i) => {
                  return (
                    <div key={i}>
                      {notification.post.substring(0, 22)}
                      {notification.likes
                        .slice(0)
                        .reverse()
                        .map((like, i) => {
                          return (
                            <Link
                              style={NotificationLikeStyle(like)}
                              onClick={() =>
                                readNotification(like.postId, like.user)
                              }
                              to={`/post/${like.postId}`}
                              key={i}
                            >
                              {like.user} liked.
                            </Link>
                          );
                        })}
                      <hr></hr>
                    </div>
                  );
                })}
            </Toggle>
            <Toggle
              buttonName={<ul style={NavBarItemStyle()}> <li>💬</li><li>{
                NotificationsComments.length ? NotificationsComments.length : 0
              }</li></ul>}
            >
              <h3>Comments</h3>
              {notifications &&
                NotificationsComments.map((notification, i) => {
                  return (
                    <div key={i}>
                      {notification.post.substring(0, 22)}
                      {notification.comments
                        .slice(0)
                        .reverse()
                        .map((comment, i) => {
                          return (
                            <Link
                              style={NotificationLikeStyle(comment)}
                              onClick={() =>
                                readNotificationComment(
                                  comment.postId,
                                  comment.user
                                )
                              }
                              to={`/post/${comment.postId}`}
                              key={i}
                            >
                              {comment.user} commented.
                            </Link>
                          );
                        })}
                      <hr></hr>
                    </div>
                  );
                })}
            </Toggle>
          </div>
          <div style={{ display: "flex", justifyContent:"space-between", width:'130px' }}>
          <Link to={`/user/${currentUsername.userProfileId}`}>
            <span
              style={NavBarItemStyle("adminName")}
            >
              {currentUsername.name}
            </span>
          </Link>
          <LogOutBtn NavBarItemStyle={NavBarItemStyle} />
        </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
