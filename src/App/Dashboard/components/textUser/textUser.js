import { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { onValue, off } from "firebase/database";

import classes from "./textUser.module.css";
import Spinner from "../../../employee/Components/UI/spinner/spinner";

import {
  DEC_UNSEEN_MSGS,
  SET_UNSEEN_MSGS,
} from "../../../store/actions/actions";
import sendIcon from "./send.png";

function Send({ dispatch, action }) {
  const holder = useRef(null);
  const [message, setMessage] = useState("");
  const [myMSG, setMyMSG] = useState([]);
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  let { unSeenMSGS } = useParams();
  const Firebase = useSelector((store) => store.firebase);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (action) {
      action(id);
    }
  }, [action, id]);
  useEffect(() => {
    dispatch({ type: DEC_UNSEEN_MSGS, payload: unSeenMSGS || 0 });
    setLoading(true);

    let listener = onValue(Firebase.messageContainer(id), (snapshot) => {
      if (!snapshot.val()) {
        setMyMSG([]);
      } else {
        setMyMSG(snapshot.val().messages);
      }
      Firebase.resetMangerUnseenMSGS(id, user.id);
      setLoading(false);
    });
    off(Firebase.MangerUnseenMSGS(user.id));
    return () => {
      listener();
      onValue(Firebase.MangerUnseenMSGS(user.id), (snapshot) => {
        let UnseenMSGS = snapshot.val();
        document.querySelector("#audio").play();

        dispatch({
          type: SET_UNSEEN_MSGS,
          payload: UnseenMSGS,
        });
      });
    };
  }, [Firebase, dispatch, id, user.id, unSeenMSGS]);
  useEffect(() => {
    holder.current.scroll(0, holder.current.scrollHeight);
  });

  let send = (e) => {
    if (e.keyCode === 13 || e.type === "click") {
      let cleanMessage = message.replace(/ +/g, "");
      if (cleanMessage) {
        const newMessage = {
          from: user.id,
          avatar: user.avatar,
          content: message,
          name: user.username,
          date: Date.now(),
        };
        setMessage("");
        let updatedMSGs = myMSG;
        let updatedConversation = {
          lastMessage: message,
          lastUpdatedAt: Date.now(),
        };
        updatedMSGs.push(newMessage);
        Firebase.addMessage(id, updatedMSGs);
        Firebase.updateConversation(id, updatedConversation);
        Firebase.increaseEmployeeUnseenMSGS(id);
      }
    }
  };
  let saveInput = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className={classes.container}>
      <div ref={holder} className={classes.holder}>
        {loading ? (
          <Spinner show margin="150px auto" />
        ) : myMSG[0] ? (
          myMSG.map((conv) => {
            return (
              <div
                className={classes.box}
                style={
                  conv.from === user.id
                    ? {
                        marginRight: "auto",
                        marginLeft: 0,
                        backgroundColor: "#1A92DC",
                      }
                    : {}
                }
              >
                <p
                  style={{
                    paddingBottom: "5px",
                    borderBottom: "1px solid black",
                  }}
                >
                  {conv.name}
                </p>
                <p className={classes.content}>{conv.content}</p>
                <p className={classes.date}>
                  {new Date(conv.date).toLocaleString()}
                </p>
              </div>
            );
          })
        ) : (
          <h1 style={{ textAlign: "center" }}>Empty</h1>
        )}
      </div>
      <div className={classes.buttonContainer}>
        <input
          maxlength="50"
          className={classes.input}
          type="text"
          onKeyUp={send}
          value={message}
          onChange={saveInput}
        />
        <span className={classes.send} onClick={send}>
          <img src={sendIcon} alt=""></img>
        </span>
      </div>
    </div>
  );
}
const mapStateToprop = (state) => ({
  myChat: state.myChat,
  myID: state.user._id,
  user: state.user,
  socket: state.socket,
});

export default connect(mapStateToprop)(Send);
