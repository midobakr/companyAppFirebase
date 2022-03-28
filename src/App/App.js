import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import Spinner from "./employee/Components/UI/spinner/spinner";
import Employee from "./employee/Containers/Home/home";
import Admin from "./Dashboard/containers/Home/home";
import Login from "./employee/Components/Auth/Login/login";
import Signup from "./employee/Components/Auth/SignUp/signup";
import Guest from "./employee/Components/Auth/guest/guest";

import { SET_USER } from "./store/actions/actions";

import "./App.css";

function App({ loading, token, status, set_token, getStatus }) {
  const Firebase = useSelector((store) => store.firebase);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  let Components = [];

  useEffect(() => {
    onAuthStateChanged(Firebase.auth, async (user) => {
      if (user) {
        let User = await Firebase.getUser(user.uid);

        if (!User.val()) {
          User = await Firebase.getAdmin(user.uid);
        }
        dispatch({ type: SET_USER, payload: User.val() });
      } else {
        dispatch({ type: SET_USER, payload: null });
      }
    });
  }, [Firebase, dispatch]);

  if (user === "loading") {
    return <Spinner show />;
  }

  if (user) {
    if (user.isAdmin === true) {
      Components = [
        <Route key={1} path="/">
          <Admin />
        </Route>,
      ];
    } else if (user.isAdmin === false) {
      Components = [
        <Route key={1} path="/">
          <Employee />
        </Route>,
      ];
    }
  } else {
    Components = [
      <Route
        key={2}
        path="/signup"
        render={(props) => <Signup {...props} />}
      ></Route>,
      <Route key={3} path="/guest" render={(props) => <Guest />}></Route>,
      <Route key={1} path="/" render={(props) => <Login {...props} />}></Route>,
    ];
  }

  return (
    <div className="App">
      <Switch>{Components.map((C) => C)}</Switch>
    </div>
  );
}

export default App;
