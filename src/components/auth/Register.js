import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Notice from "../responds/Notice";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [photolink, setPhotolink] = useState("");
  const [notice, setNotice] = useState();

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function register(e) {
    e.preventDefault();

    try {
      const registerData = {
        name,
        email,
        password,
        passwordVerify,
        photolink,
      };

      const postRes = await axios.post("http://localhost:5000/auth/", registerData);
      // await axios.post(
      //   "https://mern-auth-template-tutorial.herokuapp.com/auth/",
      //   registerData
      // );
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
      <h1>Register a new account</h1>
      <form onSubmit={register}>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        /><br></br><br></br>
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
        <input
          type="password"
          placeholder="Verify your password"
          onChange={(e) => setPasswordVerify(e.target.value)}
          value={passwordVerify}
        /><br></br><br></br>
        <input
          type="text"
          placeholder="Photo link"
          onChange={(e) => setPhotolink(e.target.value)}
          value={photolink}
        /><br></br><br></br>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
