import * as Actions from "../actions/actions";
import { firebase_app } from "../../firebase";
let initialState = {
  firebase: new firebase_app(),
  user: "loading",
  status: "",
  logIn: false,
  token: "",
  backdrop: false,
  loading: false,
  errors: "",
  Attendance: null,
  history: [],
  conversation: {},
  notification: [],
  socket: "",
  unseenMSGS: 0,

  allUsers: [],
  registeredUsers: [],
  myInbox: [],
  myChat: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Actions.LOG_IN:
      localStorage.setItem("token", action.payload);
      return { ...state, token: action.payload };

    case Actions.SET_STATUS:
      return { ...state, status: action.payload, loading: false };

    case Actions.SET_UNSEEN_MSGS:
      return { ...state, unseenMSGS: action.payload };

    case Actions.INC_UNSEEN_MSGS:
      return { ...state, unseenMSGS: state.unseenMSGS + 1 };

    case Actions.DEC_UNSEEN_MSGS:
      return { ...state, unseenMSGS: state.unseenMSGS - action.payload };

    case Actions.SET_TOKEN:
      localStorage.setItem("token", action.payload);
      return { ...state, token: action.payload };
    case "SET_DISPATCH":
      return { ...state, socket: action.payload };

    case Actions.REMOVE_TOKEN:
      return initialState;

    case Actions.GET_DATA:
      return { ...state, backdrop: true, loading: true, errors: "" };

    case Actions.SET_ERRORS:
      if (action.payload.msg === "invalid token") {
        localStorage.removeItem("token");
        return { ...state, loading: false, errors: action.payload, token: "" };
      }

      return { ...state, loading: false, errors: action.payload };

    case Actions.SET_USER:
      return {
        ...state,
        user: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_HISTORY:
      return {
        ...state,
        history: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_CONVERSATION:
      return {
        ...state,
        conversation: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_REGISTEREDUSERS:
      return {
        ...state,
        registeredUsers: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_MYINBOX:
      return {
        ...state,
        myInbox: action.payload,
        backdrop: false,
        loading: false,
      };

    case Actions.SET_MYCHAT:
      return {
        ...state,
        myChat: action.payload,
        backdrop: false,
        loading: false,
      };

    default:
      return state;
  }
}

export default reducer;
