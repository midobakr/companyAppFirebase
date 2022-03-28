import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { onValue } from "firebase/database";

import classes from "./inbox.module.css";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

export default function Inbox() {
  let [myInbox, setMyInbox] = useState([]);
  const Firebase = useSelector((store) => store.firebase);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    let listenr = onValue(Firebase.conversations(), (snapshot) => {
      setMyInbox(Object.values(snapshot.val()));
      setloading(false);
    });
    return () => {
      listenr();
    };
  }, [Firebase]);
  if (!myInbox[0] || loading) {
    return <Spinner show margin="auto" />;
  }
  return (
    <div className={classes.container}>
      {myInbox.map((chat) => (
        <div>
          <Link
            to={`/admin/sendMessage/${chat.user_id}/${chat.MangerUnseenMSGS}`}
            className={classes.box}
          >
            <div
              style={{
                overflow: "hidden",
                height: "100%",
                width: "30%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2 style={{ marginTop: "auto" }}>{chat.lastMessage}</h2>
              <p className={classes.date}>
                {new Date(chat.lastUpdatedAt).getDay() === new Date().getDay()
                  ? "today  " +
                    new Date(chat.lastUpdatedAt).getHours() +
                    ":" +
                    new Date(chat.lastUpdatedAt).getMinutes()
                  : new Date(chat.lastUpdatedAt).toLocaleString()}
              </p>
            </div>
            <h1 style={{ color: "red" }}>{chat.MangerUnseenMSGS || ""}</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "10px 0",
                justifyContent: "space-around",
                paddingRight: "10px",
              }}
            >
              <img
                className={classes.icon}
                style={{ borderRadius: "50%" }}
                src={chat.avatar}
                alt="ff"
              />
              <span className={classes.name}>{chat.username}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
