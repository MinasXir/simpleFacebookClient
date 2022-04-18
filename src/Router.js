import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Posts from "./components/posts/Posts";
import Post from "./components/posts/Post";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import UserProfile from "./components/users/UserProfile";
import AuthContext from "./context/AuthContext";
//import OnlineUsers from "./components/posts/OnlineUsers";

function Router() {
  const { loggedIn } = useContext(AuthContext);
  const RegisterLoginStyle = () => {
    return {
      width:"65vw",
      margin:"10% auto",
      display: "grid",
      padding:"20px",
      gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))",
      gap: "10px",
      textAlign:"center",
    };
  };
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/">
          {loggedIn === false ? (<div style={RegisterLoginStyle()}><Register /><Login /></div>) 
        : <><Posts /></>} 
        </Route>
        {loggedIn && (
          <>
          <Route path="/post/:id"><Post /></Route>
          <Route path="/users"><Users /></Route>
          <Route path="/user/:id"><UserProfile /></Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
