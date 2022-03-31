import React from "react";

export default function Loader() {
  const loaderStyle = () => {
    return {
      position: `fixed`,
      top: `0%`,
      left: `0%`,
      padding: `0px`,
      backgroundColor: "#444",
      width:"100vw",
      height:"100vh",
      zIndex: "5",
      display:"flex",
      justifyContent: "center",
      alignItems: "center",
      color:"#fff",
    };
  };
  return (
    <div style={loaderStyle()}><h5>LOADING</h5></div>
  );
}
