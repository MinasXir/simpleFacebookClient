import React, { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

const ChatBox = ({
  user,
  chatBoxes,
  setChatBoxes,
  chatMessages,
  setchatMessages,
}) => {
  const { sessionSocket } = useContext(AuthContext);
  const { chatMessage } = useContext(AuthContext);

  const [checkIfOpen, setcheckIfOpen] = useState(false)

  const elem = useRef(null);
  const inputChatMessage = useRef(null);

  useEffect(() => {
    if (chatMessage) {
      //scroll down on new chat message
      elem.current.children[1].children[0].addEventListener(
        "DOMNodeInserted",
        (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        }
      );
    } else return false;
  }, [chatMessage]);

  function renderMessages(user) {
    return chatMessages.filter((item) => item.from === user || item.user === user).map((item, i) => {
        //render only to the corect user box(super sos)
          return (
            <div style={{ backgroundColor: item.from ? "rgb(187, 187, 187" : "#1B74E4", padding: "10px", margin: "5px", borderRadius: "3px", color: item.from ? "#000" : "#fff"}} key={i}>
              {item.from ? `${item.from}:` : null}
              {item.message}
            </div>
          );
        //  else return false
      });
  }
  const contentStyle = () => {
    return {
      height: `30px`,
      width: "80px",
      overflow: "hidden",
      transition: "all 0.2s ease-in-out",
    };
  };

  function toggleAccordiom() {
    if (elem.current.style.height !== `30px`) {
      elem.current.style.height = `30px`;
      elem.current.style.width = `80px`;
      setcheckIfOpen(!checkIfOpen)
    } else {
      elem.current.style.height = `75vh`;
      elem.current.style.width = "325px";
      setcheckIfOpen(!checkIfOpen)
    }
  }
  function sendMessage(e, user) {
    e.preventDefault();
    const messageToSend = { user, message: inputChatMessage.current.innerText };
    sessionSocket.emit("send-message", messageToSend);
    setchatMessages([...chatMessages, messageToSend]);
    inputChatMessage.current.innerText = ""
  }

  function closeChatbox(user) {
    //update chatboxes array by removing the current clicked
    setChatBoxes(chatBoxes.filter((chatBox) => chatBox.user !== user));
  }

  return (
    <div className={user} style={{
      marginLeft: "10px",
      border: "2px solid #bbb",
      padding: "5px",
      backgroundColor: "#ddd",
      display: "inline-block",
    }}>
      <div
        className="accordion-content-parent"
        ref={elem}
        style={contentStyle()}
      >
        <div
          style={{
            height: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          className="accordion-user"
          onClick={() => toggleAccordiom()}
        >
          <h5>{!checkIfOpen && user.length > 7 ? `${user.substring(0, 7)}..` : user}</h5>
          <h5 onClick={() => closeChatbox(user)}>X</h5>
        </div>
        <div>
          <div
            style={{
              border: `solid 2px #ccc`,
              height: "60vh",
              overflowY: "auto",
              overflowWrap: `break-word`,
              margin: "0",
              backgroundColor:"rgb(247, 247, 247)",
              padding: "5px",
            }}
          >
            {renderMessages(user)}
          </div>
          <br></br>
          <form onSubmit={(e) => sendMessage(e, user)} style={{ paddingLeft: "10px", display: "flex", width: "300px",}}>
            <div
              ref={inputChatMessage}
              contentEditable="true"
              style={{ width: "265px", border: "2px solid #000" }}
            >
            </div>
            <button  type="submit">SEND</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
