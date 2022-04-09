import axios from "axios";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { io } from "socket.io-client";

function LogOutBtn({ NavBarItemStyle}) {
  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function logOut() {
    await axios.get("http://localhost:5000/auth/logout");
    sessionStorage.removeItem('token')
    await getLoggedIn();
   io("http://localhost:5000/", {
      auth: {
        token: sessionStorage.getItem("token"),
      },
        transports: ['websocket'],
        forceNode: true,
    })
    history.push("/");
  }

  return <div style={NavBarItemStyle()} onClick={logOut}>Log out</div>;
}

export default LogOutBtn;
