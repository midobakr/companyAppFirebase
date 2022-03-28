import { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onValue } from "firebase/database";

import classes from "./home.module.css";
import SideBar from "../../components/SideSar/sidebar";
import AllUsers from "../../components/allUsers/allUsers";
import Inbox from "../../components/inbox/inbox";
import Profile from "../../../employee/Components/Profile/profile";
import GetUser from "../../components/getUser/getUser";
import RegisterUsers from "../../components/registeredUsers/registeredUsers";
import UnRegisterUsers from "../../components/UnRegisterUsers/UnRegisterUsers";
import SendMessage from "../../components/SendMessage/SendMessage";

import { SET_UNSEEN_MSGS } from "../../../store/actions/actions";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Firebase = useSelector((state) => state.firebase);
  useEffect(() => {
    let listenr = onValue(Firebase.MangerUnseenMSGS(user.id), (snapshot) => {
      let UnseenMSGS = snapshot.val();
      document
        .querySelector("#audio")
        .play()
        .catch((e) => e);

      dispatch({
        type: SET_UNSEEN_MSGS,
        payload: UnseenMSGS,
      });
    });
    return () => {
      listenr();
    };
  }, [Firebase, dispatch, user.id]);

  if (!user.id) {
    return <Spinner show margin="auto" />;
  }
  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <SideBar username={user.username} avatar={user.avatar} />
        <Switch>
          <Route exact path="/">
            <Profile user={user} />
          </Route>
          <Route path="/admin/allEmployees">
            <AllUsers />
          </Route>
          <Route path="/admin/employee/:id/">
            <GetUser />
          </Route>
          <Route path="/admin/registeredUsers">
            <RegisterUsers />
          </Route>
          <Route path="/admin/AbsentEmployees">
            <UnRegisterUsers />
          </Route>
          <Route path="/admin/recievedRequests">
            <Inbox />
          </Route>
          <Route path="/admin/sendMessage">
            <SendMessage />
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Home;
