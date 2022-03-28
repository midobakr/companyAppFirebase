import { createContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as Ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  getDatabase,
  ref,
  set,
  update,
  push,
  get,
  query,
  orderByChild,
  equalTo,
  startAt,
  endAt,
  runTransaction,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";

class firebase_app {
  constructor() {
    const app = initializeApp({
      apiKey: "AIzaSyB0BVzK2e-4DYPAB4wlGBhcOUMCZU94-cM",
      authDomain: "my-company-2021.firebaseapp.com",
      projectId: "my-company-2021",
      storageBucket: "my-company-2021.appspot.com",
      messagingSenderId: "703084266171",
      appId: "1:703084266171:web:c1705153cf89251b7f1f9e",
      databaseURL:
        "https://my-company-2021-default-rtdb.europe-west1.firebasedatabase.app",
    });
    this.auth = getAuth(app);
    this.db = getDatabase(app);
    this.storage = getStorage(app);
    this.FacebookProvider = new FacebookAuthProvider();
    this.FacebookProvider.addScope("user_friends");
  }
  //Authintication

  doCreateUserWithEmailAndPassword = async (
    email,
    password,
    username,
    isAdmin
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      await updateProfile(res.user, { displayName: username });

      if (isAdmin) {
        await set(this.admin(res.user.uid), {
          id: res.user.uid,
          email,
          username,
          isAdmin,
          unseenMSGS: 0,
          dateOfEmployment: Date.now(),
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/my-company-2021.appspot.com/o/images%2Findex.png?alt=media&token=a10aa558-8323-4401-a5d1-572958a32bf0",
        });
      } else {
        await set(this.user(res.user.uid), {
          id: res.user.uid,
          email,
          username,
          isAdmin,
          dateOfEmployment: Date.now(),
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/my-company-2021.appspot.com/o/images%2Findex.png?alt=media&token=a10aa558-8323-4401-a5d1-572958a32bf0",
        });

        await set(this.conversation(res.user.uid), {
          lastMessage: "",
          lastUpdatedAt: null,
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/my-company-2021.appspot.com/o/images%2Findex.png?alt=media&token=a10aa558-8323-4401-a5d1-572958a32bf0",
          EmployeeUnseenMSGS: 0,
          MangerUnseenMSGS: 0,
          user_id: res.user.uid,
          username,
        });
      }
      return true;
    } catch (e) {
      return e;
    }
  };
  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignInAnonymously = async (As) => {
    try {
      let res = await signInAnonymously(this.auth);
      if (As === "admin") {
        await set(this.admin(res.user.uid), {
          id: res.user.uid,
          email: res.user.uid + "@Anonymously",
          username: res.user.uid,
          isAdmin: true,
          unseenMSGS: 0,
          dateOfEmployment: Date.now(),
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/my-company-2021.appspot.com/o/images%2Findex.png?alt=media&token=a10aa558-8323-4401-a5d1-572958a32bf0",
        });
      } else if (As === "employee") {
        await set(this.user(res.user.uid), {
          id: res.user.uid,
          email: res.user.uid + "@Anonymously",
          username: res.user.uid,
          isAdmin: false,
          dateOfEmployment: Date.now(),
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/my-company-2021.appspot.com/o/images%2Findex.png?alt=media&token=a10aa558-8323-4401-a5d1-572958a32bf0",
        });
      }
      window.location.pathname = "/";
      return;
    } catch (e) {}
  };

  doSignInWithFacebook = () =>
    signInWithPopup(this.auth, this.FacebookProvider).then(async (result) => {
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      let imgURL = await fetch(
        `${result.user.photoURL}?redirect=false&access_token=${accessToken}`
      ).then(async (img) => {
        const res = await img.json();
        return res.data.url;
      });
      let ref = this.user(result.user.uid);
      return set(ref, {
        id: result.user.uid,
        userName: result.user.displayName,
        email: result.user.email,
        photoURL: imgURL,
        role: "admin",
      });
    });

  doSendPasswordResetEmail = (email) =>
    sendPasswordResetEmail(this.auth, email);

  doUpdatePassword = (new_password) =>
    updatePassword(this.auth.currentUser, new_password);

  doSignOut = () => signOut(this.auth);

  //Database
  //Admin
  getAdmin = (uid) => get(this.admin(uid));
  getKey = (path) => push(ref(this.db, path));

  admin = (adminId) => ref(this.db, `admins/${adminId}`);
  admins = () => ref(this.db, `admins`);
  getUsers = () => get(this.users());
  getRegisteredUsers = (date) => {
    const Query = query(this.records(), orderByChild("AttendAt"));
    let firstDay = new Date(date).setHours(0, 0, 0);
    let lastDay = new Date(date).setHours(23, 59, 59);
    const Query2 = query(Query, startAt(firstDay));
    const Query3 = query(Query2, endAt(lastDay));
    return get(Query3);
  };

  //User
  user = (userId) => ref(this.db, `users/${userId}`);
  users = () => ref(this.db, "users");
  record = (id) => ref(this.db, `records/${id}`);
  records = () => ref(this.db, "records");

  conversation = (id) => ref(this.db, `conversations/${id}`);
  conversations = () => {
    const q = query(
      ref(this.db, "conversations"),
      orderByChild("lastUpdatedAt")
    );
    return query(q, startAt(0));
  };

  resetEmployeeUnseenMSGS = (id) =>
    runTransaction(
      ref(this.db, `conversations/${id}/EmployeeUnseenMSGS`),
      () => 0
    );
  resetMangerUnseenMSGS = (id, adminID) =>
    runTransaction(
      ref(this.db, `conversations/${id}/MangerUnseenMSGS`),
      (unseenMSGS) => {
        runTransaction(
          this.MangerUnseenMSGS(adminID),
          (adminMSGS) => adminMSGS - unseenMSGS
        );
        return 0;
      }
    );
  EmployeeUnseenMSGS = (id) =>
    ref(this.db, `conversations/${id}/EmployeeUnseenMSGS`);
  MangerUnseenMSGS = (id) => ref(this.db, `admins/${id}/unseenMSGS`);

  increaseEmployeeUnseenMSGS = (id) =>
    runTransaction(
      ref(this.db, `conversations/${id}/EmployeeUnseenMSGS`),
      (unSeenMsgs) => unSeenMsgs + 1
    );
  increaseMangerUnseenMSGS = (id) =>
    runTransaction(
      ref(this.db, `conversations/${id}/MangerUnseenMSGS`),
      (unSeenMsgs) => unSeenMsgs + 1
    );
  increaseAdminsUnseenMSGS = () =>
    runTransaction(this.admins(), (users) => {
      for (let user in users) {
        let unseenMSGS = users[user].unseenMSGS;
        users[user].unseenMSGS = unseenMSGS + 1;
      }
      return users;
    });

  messageContainer = (id) => ref(this.db, `messageContainers/${id}`);
  messageContainers = () => ref(this.db, "messageContainers");

  getUser = (uid) => get(this.user(uid));

  getMessages = (uid) => get(this.messageContainer(uid));
  addMessage = (uid, messages) =>
    set(this.messageContainer(uid), {
      messages,
    });
  updateConversation = (uid, data) => update(this.conversation(uid), data);
  addRecord = (ref, data) => set(ref, data);
  getHistory = (uid, year, month) => {
    const Query = query(this.records(), orderByChild("orderkey"));
    if (year) {
      let firstMounth = +new Date(year, month, 1);
      let lastMounth = +new Date(year, +month + 1, 1);
      const Query2 = query(Query, startAt(uid + firstMounth));
      const Query3 = query(Query2, endAt(uid + lastMounth));
      return get(Query3);
    } else {
      return get(Query);
    }
  };

  getRecord = (uid) => {
    let firstDay = new Date().setHours(0, 0, 0);
    let lastDay = new Date().setHours(23, 59, 59);
    const Query = query(this.records(), orderByChild("orderkey"));
    const Query2 = query(Query, startAt(uid + firstDay));
    const Query3 = query(Query2, endAt(uid + lastDay));

    return get(Query3);
  };
  updateRecord = (id) => update(this.record(id), { LeftAt: Date.now() });

  checkUsername = (username) => {
    const userQuery = query(this.users(), orderByChild("username"));
    const usernameQuery = query(userQuery, equalTo(username));
    return get(usernameQuery).then((snapshot) => {
      return !!snapshot.val();
    });
  };
  updateProfilePicture = async (uid, file) => {
    try {
      const res = await uploadBytes(this.storageRef(uid + ".jpg"), file);
      const url = await getDownloadURL(res.ref);

      await update(this.user(uid), {
        avatar: url,
      });
      await update(this.conversation(uid), {
        avatar: url,
      });
      window.location.reload();
    } catch (e) {
      return e;
    }
  };

  //Storage
  storageRef = (path) => Ref(this.storage, `images/${path}`);
}

const firebaseContext = createContext();
export { firebaseContext, firebase_app };
