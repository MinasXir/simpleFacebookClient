import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Notice from "../responds/Notice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState();

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function login(e) {
    e.preventDefault();

    try {
      const loginData = {
        email,
        password,
      };

      const postRes =  await axios.post("http://localhost:5000/auth/login", loginData);
      sessionStorage.setItem("token", postRes.data)
      await getLoggedIn();
      history.push("/");
    } catch (err) {
      err.response.data.errorMessage && setNotice(err.response.data);
    }
  }

  return (
    <div>
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      <h1>Log in to your account</h1>
      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        /><br></br><br></br>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        /><br></br><br></br>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

export default Login;
