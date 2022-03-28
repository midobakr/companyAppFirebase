import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Search from "../../../employee/Components/UI/search/Search";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

import classes from "./registeredUsers.module.css";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wendsday",
  "Thrusday",
  "Friday",
  "Saturday",
];

function RegisteredUsers() {
  let todayDate = new Date().toJSON().split("T")[0];

  let [selectedDate, setSelectedDate] = useState(todayDate);
  let [searchResult, setSearchResult] = useState([]);
  let [registeredUsers, setRegisteredUsers] = useState([]);
  let [loading, setLoading] = useState(false);
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
        setSearchResult(result);
        setRegisteredUsers(result);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [Firebase, selectedDate]);

  const getPreviousDayDate = (num) => {
    const today = new Date(selectedDate);
    const yestarday = new Date(today.setDate(today.getDate() - num));
    return yestarday.toJSON().split("T")[0];
  };
  return (
    <div className={classes.container}>
      <Search action={setResult} fullArray={registeredUsers} />
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
            let today_record = new Date(record.AttendAt);

            return (
              <div className={classes.box}>
                <img
                  className={classes.icon}
                  style={{ borderRadius: "50%" }}
                  src={record.avatar}
                  alt="ff"
                />
                <div className={classes.container3}>
                  <h2 style={{ textAlign: "center", width: "5em" }}>
                    {record.name}
                  </h2>
                  <h2>
                    <span>
                      {today_record.getHours() > 12
                        ? today_record.getHours() -
                          12 +
                          ":" +
                          (today_record.getMinutes() < 10 ? "0" : "") +
                          today_record.getMinutes() +
                          " PM"
                        : today_record.getHours() +
                          ":" +
                          (today_record.getMinutes() < 10 ? "0" : "") +
                          today_record.getMinutes() +
                          " AM"}
                    </span>
                  </h2>

                  <h2>
                    <span>{today_record.getFullYear()}</span>
                    <span>/{today_record.getMonth() + 1}</span>
                    <span>/{today_record.getDate()}</span>
                  </h2>
                </div>
              </div>
            );
          })
        ) : (
          <h3
            className={classes.info}
            style={{ textAlign: "center ", margin: "auto" }}
          >
            there is no Users registered on that day
          </h3>
        )}
      </div>
    </div>
  );
}

export default RegisteredUsers;
