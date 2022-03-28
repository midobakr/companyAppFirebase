import { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { onValue, off } from "firebase/database";
import classes from "./send.module.css";

import { SET_UNSEEN_MSGS } from "../../../store/actions/actions";
import Spinner from "../UI/spinner/spinner";
import sendIcon from "./send.png";

function Send() {
  const holder = useRef(null);
  const dispatch = useDispatch();
  const Firebase = useSelector((store) => store.firebase);
  const user = useSelector((store) => store.user);

  const [message, setMessage] = useState("");
  const [myMSG, setMyMSG] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    dispatch({ type: SET_UNSEEN_MSGS, payload: 0 });

    setloading(true);
    let listenr = onValue(
      Firebase.messageContainer(user.id),
      (snapshot) => {
        if (!snapshot.val()) {
          setMyMSG([]);
        } else {
          setMyMSG(snapshot.val().messages);
        }
        setloading(false);
        Firebase.resetEmployeeUnseenMSGS(user.id);
      },
      (e) => {
        setloading(false);
      }
    );
    off(Firebase.EmployeeUnseenMSGS(user.id));
    return () => {
      listenr();
      onValue(Firebase.EmployeeUnseenMSGS(user.id), (snapshot) => {
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
    };
  }, [Firebase, dispatch, user.id]);

  useEffect(() => {
    if (myMSG[0] && holder.current) {
      holder.current.scroll(0, holder.current.scrollHeight);
    }
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
          // MangerUnseenMSGS:5
        };
        updatedMSGs.push(newMessage);
        Firebase.addMessage(user.id, updatedMSGs);
        Firebase.updateConversation(user.id, updatedConversation);
        Firebase.increaseMangerUnseenMSGS(user.id);
        Firebase.increaseAdminsUnseenMSGS();
      }
    }
  };
  let saveInput = (e) => {
    setMessage(e.target.value);
  };

  if (loading) {
    return <Spinner show={loading} margin="100px auto" />;
  }

  return (
    <div className={classes.container}>
      <div ref={holder} className={classes.holder}>
        {myMSG[0]
          ? myMSG.map((conv) => {
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
          : ""}
      </div>
      <div className={classes.buttonContainer}>
        <input
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
  conversation: state.conversation,
  user: state.user,
  socket: state.socket,
});

export default connect(mapStateToprop)(Send);
