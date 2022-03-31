import React from "react";
import Router from "./Router";
import axios from "axios";
import OnlineUsers from "./components/onlineUsers/OnlineUsers";
import { AuthContextProvider } from "./context/AuthContext";

axios.defaults.withCredentials = true;

function App() {

  return (
    <AuthContextProvider>
      <Router />
      <OnlineUsers />
    </AuthContextProvider>
  );
}

export default App;
