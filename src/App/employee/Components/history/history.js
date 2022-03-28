import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./history.module.css";
import HistoryTable from "../historyTable/historyTable";
import Spinner from "../UI/spinner/spinner";
const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function History(props) {
  let today = new Date();
  const [fullYear, setFullYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const Firebase = useSelector((state) => state.firebase);
  const user = useSelector((state) => state.user);
  const [history, setHistory] = useState([]);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setloading(true);
    Firebase.getHistory(user.id, fullYear, currentMonth)
      .then((records) => {
        let result = [];
        if (records.val()) {
          result = Object.values(records.val());
        }
        setHistory(result);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
      });
  }, [Firebase, user.id, fullYear, currentMonth]);

  const getPrevMonth = () => {
    let prevMonth = currentMonth - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      setFullYear(fullYear - 1);
    }
    setCurrentMonth(prevMonth);
  };

  const getNextMonth = () => {
    let nextMonth = currentMonth + 1;
    if (nextMonth > 11) {
      nextMonth = 0;
      setFullYear(fullYear + 1);
    }
    setCurrentMonth(nextMonth);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.label} style={{ textAlign: "center" }}>
        {fullYear} - {Months[currentMonth]}
      </h1>
      <div className={classes.controllerContainer}>
        <h3
          className={classes.controller}
          style={{
            cursor: "pointer",
            visibility:
              today.getMonth() === currentMonth &&
              today.getFullYear() === fullYear
                ? "hidden"
                : "visible",
          }}
          onClick={getNextMonth}
        >
          next month
        </h3>
        <div
          style={{ textAlign: "center", display: "flex", alignItems: "center" }}
        >
          <Spinner show={loading} size="5px" margin="auto" />
        </div>

        <h3
          className={classes.controller}
          style={{ cursor: "pointer" }}
          onClick={getPrevMonth}
        >
          previous month
        </h3>
      </div>
      <HistoryTable history={history} />
    </div>
  );
}

export default History;
