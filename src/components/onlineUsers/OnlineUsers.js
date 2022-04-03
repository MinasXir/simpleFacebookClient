import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import ChatBox from "./ChatBox";
function OnlineUsers() {
  const { loggedIn } = useContext(AuthContext);
  const { onlineUsers } = useContext(AuthContext);
  const { currentUsername } = useContext(AuthContext);
  const { chatMessage } = useContext(AuthContext);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [chatMessages, setchatMessages] = useState([]);

  useEffect(() => {
    if (chatMessage) {
      setchatMessages([...chatMessages, chatMessage]);
      check(chatMessage.from);
    } else return false;
  }, [chatMessage]);

  const check = (user) => {
    if (chatBoxes.find((item) => item.user === user)) return false;
    else return setChatBoxes([...chatBoxes, { user }]);
  };
  const divstyle = (onlineList) => {
    return {
      border: onlineList && onlineUsers.length > 1 ? `1px solid black` : "none",
      position: "fixed",
      right: onlineList && "7px",
      left: !onlineList && "-2px",
      bottom: !onlineList && "0px",
      top: onlineList && "10vh",
      zIndex: "0",
      height: onlineList ? "100%" : "auto",
      width: onlineList ? "10vw"  : "auto",
      display: onlineUsers.length > 0 ? "block" : "none",
      padding: onlineList ? "10px" : "0",
      transition:"all 1s ease"
    };
  };

  function renderOnlineUsers() {
    return onlineUsers
      .filter((user) => user !== currentUsername.name)
      .map((user, i) => {
        return (
          <div
            key={i}
            style={{display: "flex", marginBottom:"5px" ,alignItems:"center", cursor:"pointer"}}
            onClick={() => check(user)}
          >
            <div
              className="circle"
              style={{
                height: `10px`,
                width: `10px`,
                backgroundColor: `green`,
                borderRadius: `50%`,
                marginRight: "5px",
              }}
            ></div>
            {user.length > 12 ? `${user.substring(0, 10)}..` : user}
          </div>
        );
      });
  }

  if (loggedIn === true || loggedIn === "admin")
    return (
      <>
        <div style={divstyle("onlineList")}>
          {onlineUsers.length > 1 && <><div>Active users</div><hr></hr></>}
          {renderOnlineUsers()}
        </div>
        {chatBoxes.length ? (
          <div style={divstyle()}>
            {chatBoxes
              .filter((item) => item.vissible !== false)
              .map(({ user }, i) => (
                <ChatBox
                  chatBoxes={chatBoxes}
                  setChatBoxes={setChatBoxes}
                  key={i}
                  user={user}
                  chatMessages={chatMessages}
                  setchatMessages={setchatMessages}
                />
              ))}
          </div>
        ) : null}
      </>
    );
  else return false;
}

export default OnlineUsers;
