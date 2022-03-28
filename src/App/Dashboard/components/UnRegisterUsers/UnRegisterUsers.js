import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Search from "../../../employee/Components/UI/search/Search";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

import classes from "./UnRegisterUsers.module.css";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wendsday",
  "Thrusday",
  "Friday",
  "Saturday",
];

function UnRegisteredUsers() {
  let todayDate = new Date().toJSON().split("T")[0];

  let [selectedDate, setSelectedDate] = useState(todayDate);
  let [searchResult, setSearchResult] = useState([]);

  let [loading, setLoading] = useState(false);

  let [allUsers, setAllUsers] = useState([]);
  let [registeredUsers, setRegisteredUsers] = useState([]);
  let [unRegisteredUsers, setUnRegisteredUsers] = useState([]);

  let Firebase = useSelector((store) => store.firebase);

  function setResult(result) {
    setSearchResult(result);
  }

  useEffect(() => {
    setLoading(true);
    Firebase.getRegisteredUsers(selectedDate)
      .then((records) => {
        let result = [];
        if (records.val()) {
          result = Object.values(records.val());
        }

        setRegisteredUsers(result);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [selectedDate, Firebase]);

  useEffect(() => {
    setLoading(true);
    Firebase.getUsers()
      .then((users) => {
        setAllUsers(Object.values(users.val()));
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [Firebase]);

  const getPreviousDayDate = (num) => {
    const today = new Date(selectedDate);
    const yestarday = new Date(today.setDate(today.getDate() - num));
    return yestarday.toJSON().split("T")[0];
  };

  useEffect(() => {
    const allRegisteredUsersId = registeredUsers.map(
      (record) => record.user_id
    );

    let unRegisteredUsersArray = allUsers.filter(
      (user) => !allRegisteredUsersId.includes(user.id)
    );

    unRegisteredUsersArray = unRegisteredUsersArray.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    setUnRegisteredUsers(unRegisteredUsersArray);
    setSearchResult(unRegisteredUsersArray);
  }, [allUsers, registeredUsers]);

  return (
    <div className={classes.container}>
      <Search action={setResult} fullArray={unRegisteredUsers} />
      <div className={classes.container2}>
        <h3
          className={classes.label}
          style={{
            cursor: "pointer",
            visibility: todayDate === selectedDate ? "hidden" : "visible",
          }}
          onClick={() => {
            setSelectedDate(getPreviousDayDate(-1));
          }}
        >
          Next Day
        </h3>
        <div style={{ display: "inline-block", position: "relative" }}>
          <div className={classes.theDay}>
            {days[new Date(selectedDate).getDay()]}
          </div>
          <input
            max={todayDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            type="Date"
            Value={selectedDate}
            className={classes.dateInput}
          />
        </div>

        <h3
          className={classes.label}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedDate(getPreviousDayDate(1));
          }}
        >
          Previous Day
        </h3>
      </div>

      <div className={classes.recordsContainer}>
        {loading ? (
          <Spinner show margin="100px auto" />
        ) : searchResult[0] ? (
          searchResult.map((record) => {
            return (
              <div className={classes.box}>
                <div className={classes.name}>{record.username}</div>
                <img
                  className={classes.icon}
                  style={{ borderRadius: "50%" }}
                  src={record.avatar}
                  alt="ff"
                />
              </div>
            );
          })
        ) : (
          <h2 style={{ textAlign: "center ", margin: "auto" }}>
            there is no Users unRegistered on that day
          </h2>
        )}
      </div>
    </div>
  );
}

export default UnRegisteredUsers;
