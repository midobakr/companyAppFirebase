import { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import Timer from "../UI/timer/timer";
import Spinner from "../UI/spinner/spinner";
import classes from "./attend.module.css";

function Attend(props) {
  let today_record = null;
  let user = useSelector((state) => state.user);
  let Firebase = useSelector((state) => state.firebase);
  let [Attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Firebase.getRecord(user.id)
      .then((record) => {
        if (record.val()) {
          let Record = Object.values(record.val())[0];
          setAttendance(Record);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [Firebase, user.id]);

  let register = () => {
    setLoading(true);

    const recordKey = Firebase.getKey("records");
    const myrecord = {
      user_id: user.id,
      name: user.username,
      avatar: user.avatar,
      AttendAt: Date.now(),
      orderkey: user.id + Date.now(),
    };
    Firebase.addRecord(recordKey, myrecord)
      .then((s) => {
        setAttendance(myrecord);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  if (Attendance) {
    today_record = new Date(Attendance.AttendAt);
  }
  if (loading && Attendance) {
    <Spinner show margin="auto" />;
  }
  return (
    <div className={classes.container}>
      {Attendance ? (
        <div>
          <h1 style={{ textAlign: "center" }}>you already registered today</h1>
          <div className={classes.box}>
            <div style={{ textAlign: "center" }}>
              <img
                style={{
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  border: "2px solid #1A92DC",
                }}
                src={`${user.avatar}`}
                alt="profile "
              />
            </div>
            <h2 style={{ textAlign: "center" }}>{Attendance.name}</h2>
            <h2>
              <span>
                {today_record.getHours() > 12
                  ? today_record.getHours() -
                    12 +
                    ":" +
                    today_record.getMinutes() +
                    " PM"
                  : today_record.getHours() +
                    ":" +
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
      ) : (
        <Fragment>
          <h1 style={{ textAlign: "center" }}>
            <Timer normalMode />
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              flex: "1 0 0",
            }}
          >
            <Spinner show={loading} margin="125px auto" />
            <button
              onClick={register}
              style={{ width: "50%", margin: 0, border: 0 }}
            >
              Regiester
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default Attend;
