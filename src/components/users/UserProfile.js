import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { useLocation } from "react-router-dom";


function UserProfile() {
  const [user, setUser] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const location = useLocation();
  async function getUserData() {
    setisLoading(true)
    const usersRes = await axios.get(
      `http://localhost:5000/auth/${window.location.pathname}`
    );;
    setUser(usersRes.data);
    setisLoading(false)
  }
  
  useEffect(() => {
    getUserData();
  }, [location]);

  const divstyle = (color) => {
    return {
      border: `1px solid ${color}`,
      padding: "10px",
      marginTop: "10vh",
      marginLeft:"5vw",
      width: "73vw"
    };
  };
  return (
    <>
    {isLoading && <Loader />}
    <div style={divstyle("blue")}>
        {user.length && user.map((us, i) => {
        return (
          <div key={i}>
            <p>{us.name}</p>
            <p>{us.email}</p>
            <img src={us.photolink} alt="listImage" />
          </div>
        );
      })}
    </div>
    </>
  );
}

export default UserProfile;
