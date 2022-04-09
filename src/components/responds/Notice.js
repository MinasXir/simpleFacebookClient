import React from "react";
import styles from "./Notice.Module.css";

export default function Notice({ clearNotice, message }) {
  setTimeout(clearNotice, 2000);

  const noticeStyle = () => {
    return {
      position: `fixed`,
      top: `2%`,
      left: `5%`,
      padding: `15px`,
      borderRadius: `5px`,
      border:"1px solid #777",
      backgroundColor:"#fff",
      color: `rgb(255, 255, 255)`,
      zIndex:"3"
    };
  };
  return (
    <div className={styles.notice} style={noticeStyle()}>
      <span style={{ color: message.errorMessage ? "red" : "#555",}}>
        {message.errorMessage
          ? message.errorMessage
          : message.message
          ? message.message
          :!message.message && !message.message 
          ? message: null}
      </span>
    </div>
  );
}
