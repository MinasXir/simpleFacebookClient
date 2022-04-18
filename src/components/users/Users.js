import axios from "axios";
import React, { useEffect, useState } from "react";
import UsersList from "./UsersList";
import { useHistory } from "react-router-dom";
import Notice from "../responds/Notice";
import Loader from "../loader/Loader";

function Users() {
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState();
  const [isLoading, setisLoading] = useState(false);

  const history = useHistory();

  async function getUsers() {
    setisLoading(true)
    const usersRes = await axios.get("http://localhost:5000/auth/users");
    setUsers(usersRes.data);
    setisLoading(false)
  }
  async function deleteUser(x) {
    try {
      await axios
        .delete(`http://localhost:5000/auth/deleteuser/${x}`)
        .then((response) => {
          getUsers();
          response.data && setNotice(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  function goToUserProfile(x) {
    history.push(`/user/${x}`);
  }

  return (
    <>
      {isLoading && <Loader />}
      {notice && (
        <Notice message={notice} clearNotice={() => setNotice(undefined)} />
      )}
      <br></br>
      <div style={{
        border: `solid 2px #ccc`,
        height: "100%",
        marginTop: "10vh",
        marginLeft: "5vw",
        width: "74vw",
        overflowY: "auto",
        overflowWrap: `break-word`,
        padding: "5px",}}>
      <UsersList
        users={users}
        deleteUser={deleteUser}
        userProfile={goToUserProfile}
      />
      </div>
    </>
  );
}

export default Users;
