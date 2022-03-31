import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";


function UsersList({ users, userProfile, deleteUser }) {
  const { loggedIn } = useContext(AuthContext);

  function renderUsers() {
    return users.map((user, i) => {
      return (
        <div key={i}>
          <span>{user.name}</span> - <span>{user.email} </span>
          <span>
            <img src={user.photolink} alt="listImage" width="50" height="60" />{" "}
          </span>
          {loggedIn === "admin" ? <button onClick={() => deleteUser(user.userProfileId)}>
            Delete user
          </button>:null}
          <button onClick={() => userProfile(user.userProfileId)}>
            User Profile
          </button>
        </div>
      );
    });
  }

  return <>{renderUsers()}</>;
}

export default UsersList;
