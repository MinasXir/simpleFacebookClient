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
  const { filteredResultNotificationsComments } = useContext(AuthContext);
  const { filteredResultNotificationsLikes } = useContext(AuthContext);

  //updates posts useEfFect component when the Link is clicked in case we already in posts page but we need to get latests post and scroll up.
  const { changeStateToRerender } = useContext(AuthContext);

  const NavBarStyle = () => {
    return {
      display: `${loggedIn === true || loggedIn === "admin" ? "flex" : "none"}`,
      justifyContent: "space-evenly",
      alignItems: "center",
      height: "8vh",
      width: "100vw",
      position: "sticky",
      color: `#fff`,
      top: "0",
      backgroundColor: "#444",
      zIndex: "1",
      boxShadow: `0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)`
    };
  };

  const NotificationLikeStyle = (alreadeySeenLike) => {
    return {
      display: `block`,
      border: `1px solid black`,
      color: `#000`,
      width: `15vw`,
      padding: `10px`,
      margin: `10px 0px 10px 0px`,
      opacity: `${alreadeySeenLike === false ? "1" : "0.4"}`,
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
    <div style={NavBarStyle()}>
      {(loggedIn === true || loggedIn === "admin") && (
        <>
          <Link onClick={changeStateToRerender} to="/">
            Posts
          </Link>
          <Link to="/users">Users</Link>
          <div style={{display:"flex"}}>
          <Toggle
          buttonName={`likes:${filteredResultNotificationsLikes.length ? 
              filteredResultNotificationsLikes.length : 0}`}
          >
            <h3>Likes</h3>
            {notifications &&
              filteredResultNotificationsLikes.map((notification, i) => {
                return (
                  <div key={i}>
                    {notification.post.substring(0, 22)}
                    {notification.likes.map((like, i) => {
                      return (
                        <Link
                          style={NotificationLikeStyle(like.seen)}
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
          <Toggle buttonName={`comments:${filteredResultNotificationsComments.length ? filteredResultNotificationsComments.length : 0}`}
          >
            <h3>Comments</h3>
            {notifications &&
              filteredResultNotificationsComments.map((notification, i) => {
                return (
                  <div key={i}>
                    {notification.post.substring(0, 22)}
                    {notification.comments.map((comment, i) => {
                      return (
                        <Link
                          style={NotificationLikeStyle(comment.seen)}
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
          <div>
          <Link to={`/user/${currentUsername.userProfileId}`}><span style={{backgroundColor:"#fff", color:"#000", borderRadius:"5px", padding:"5px", marginRight:"5px"}}>{currentUsername.name}</span></Link>
          <LogOutBtn />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
