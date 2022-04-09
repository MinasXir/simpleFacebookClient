import React, { useState } from "react";

export default function Toggle({ children, buttonName }) {
  const [isOpen, setIsOpen] = useState(false);

  const FixedDivForCloseOutsideToggleClick = () => {
    return {
      display: `${!isOpen ? "none" : "block"}`,
      position: `fixed`,
      width: "100%",
      height: "100%",
      left: "0",
      top: "0",
      zIndex: "2",
    };
  };

  const ChildStyle = () => {
    return {
      display: `${isOpen === false ? "none" : "block"}`,
      position: `absolute`,
      borderRadius: `5px`,
      overflowY: "auto",
      padding: `10px`,
      backgroundColor: "#fff",
      fontSize: `1em`,
      zIndex: "2",
      border: "1px solid #8888",
      boxShadow: ` 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
      maxWidth: "35vw",
      maxHeight: "70vh",
      overflowWrap: `break-word`,
    };
  };

  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          !children.length ? setIsOpen(isOpen) : setIsOpen(!isOpen);
        }}
      >
        {buttonName}
      </div>
      <div
        style={FixedDivForCloseOutsideToggleClick()}
        onClick={() => setIsOpen(!isOpen)}
      ></div>
      <div style={ChildStyle()}>{children}</div>
    </div>
  );
}
