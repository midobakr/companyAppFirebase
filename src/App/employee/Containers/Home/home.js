import { useEffect, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { onValue } from "firebase/database";

import Register from "../../Components/register/register";
import RegisterOut from "../../Components/logOut/logOut";
import History from "../../Components/history/history";
import Profile from "../../Components/Profile/profile";
import Send from "../../Components/Send/send";
import classes from "./home.module.css";
import { SET_UNSEEN_MSGS } from "../../../store/actions/actions";
import SideBar from "../../Components/SideSar/sidebar";

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const Firebase = useSelector((state) => state.firebase);

  useEffect(() => {
    let listenr = onValue(Firebase.EmployeeUnseenMSGS(user.id), (snapshot) => {
      let UnseenMSGS = snapshot.val();
      if (!UnseenMSGS) {
        return false;
      }
      dispatch({
        type: SET_UNSEEN_MSGS,
        payload: UnseenMSGS,
      });
      document.querySelector("#audio").play();
    });
    return () => {
      listenr();
    };
  }, [Firebase, dispatch, user.id]);

  return (
    <Fragment>
      <Switch>
        <Route path="/">
          <div className={classes.container}>
            <div className={classes.body}>
              <SideBar username={user.username} avatar={user.avatar} />

              <Route exact path="/notification">
                {/* <Notification notification={user.notification}/> */}
              </Route>
              <Route exact path="/">
                <Profile user={user} />
              </Route>
              <Route path="/myhistory">
                <History />
              </Route>
              <Route path="/Register">
                <Register />
              </Route>
              <Route path="/leave">
                <RegisterOut />
              </Route>
              <Route path="/send">
                <Send />
              </Route>
            </div>
          </div>
          {/* <Route  path='/'><Redirect to='/' /></Route> */}
        </Route>
      </Switch>
    </Fragment>
  );
}

export default Home;
