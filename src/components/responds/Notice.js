import React from "react";
import styles from "./Notice.module.css";

export default function Notice({ clearNotice, message }) {
  setTimeout(clearNotice, 2000);

  const noticeStyle = () => {
    return {
      position: `fixed`,
      top: `0%`,
      left: `0%`,
      padding: `20px`,
      backgroundColor:"#000",
      zIndex:"4",
      fontWeight:"bold"
    };
  };
  return (
    <div className={styles.notice} style={noticeStyle()}>
      <span style={{ color: message.errorMessage ? "rgb(207, 34, 34)" : "rgb(2, 238, 80)" }}>
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
