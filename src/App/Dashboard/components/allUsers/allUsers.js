import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Search from "../../../employee/Components/UI/search/Search";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

import classes from "./allUsers.module.css";

function AllUsers() {
  let [MyUsers, setMyUsers] = useState([]);
  let [allUsers, setAllUsers] = useState([]);
  let Firebase = useSelector((state) => state.firebase);

  useEffect(() => {
    Firebase.getUsers().then((users) => {
      setMyUsers(Object.values(users.val()));
      setAllUsers(Object.values(users.val()));
    });
  }, [Firebase]);

  function setResult(result) {
    setMyUsers(result);
  }
  if (!allUsers[0]) {
    return <Spinner show margin="auto" />;
  }

  return (
    <div className={classes.container}>
      <Search action={setResult} fullArray={allUsers} />
      <div className={classes.recordsContainer}>
        {MyUsers?.map((user) => (
          <Link to={`/admin/employee/${user.id}`} className={classes.box}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: "10px",
              }}
            >
              {user.username}
            </div>
            <img
              className={classes.icon}
              style={{ borderRadius: "50%" }}
              src={user.avatar}
              alt="ff"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
