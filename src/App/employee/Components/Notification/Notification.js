import { useEffect } from "react";
import { connect } from "react-redux";
import classes from "./Notification.module.css";
import getAsync from "../../store/actions/getAsync";
import { SET_NOTIFICATION } from "../../store/actions/actions";
function Notification({ notification, dispatch }) {
  useEffect(() => {
    dispatch(getAsync("/user/getNotification", SET_NOTIFICATION));
  }, [dispatch]);
  return (
    <div className={classes.container}>
      {notification
        ? notification.map((note, index) => (
            <div key={index} className={classes.box}>
              <span>{note.msg}</span>
              <span>{new Date(note.date).toLocaleString()}</span>
            </div>
          ))
        : ""}
    </div>
  );
}
const mapStateToprop = (state) => ({
  notification: state.notification,
});

export default connect(mapStateToprop)(Notification);
