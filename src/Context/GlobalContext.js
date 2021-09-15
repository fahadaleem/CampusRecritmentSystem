import React from "react";
import { useState, useContext, createContext, useEffect } from "react";
import { useHistory } from "react-router";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getDatabase,
  ref,
  set,
  child,
  get,
} from "../firebase";

import Swal from "sweetalert2";

const GlobalContext = createContext();

//create a provider

const GlobalProvider = ({ children }) => {
  const [user, setuser] = useState("");
  const [error, seterror] = useState(null);

  const history = useHistory();

  const HandleLoginUser = (userData) => {
    const auth = getAuth();

    const dbref = ref(getDatabase());

    //generate key from the login details

    const userId = HandleGenerateUniqueKey(
      userData.accountType,
      userData.email
    );

    //get the user data from firebase

    get(child(dbref, `user/${userId}`))
      .then((snapshot) => {
        //if user avaailable then login

        if (snapshot.exists()) {
          console.log(snapshot.val());

          console.log("userData", userData);

          signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then((userCredential) => {
        
              Swal.fire({
                icon: "success",
                title: "Login Successful",
              }).then(error => {

              setuser({...userData})
              localStorage.setItem("user", JSON.stringify(userData));
              history.push("/StudentDashboard");
        
            });

          })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.Message;
              seterror(errorMessage);
            });
        } else {
          //if no data is available

          Swal.fire({
            icon: "error",
            title: "no data available",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //create a function that replace email dot with dash
  const HandleGenerateUniqueKey = (accountType, email) => {
    const emailKey = email.replace(".", "-");
    return accountType + "-" + emailKey;
  };

  //SignUpFunction

  const handleSignupUser = (userDetails) => {
    const auth = getAuth();

    createUserWithEmailAndPassword(
      auth,
      userDetails.email,
      userDetails.password
    )
      .then((userCredential) => {
        const key = HandleGenerateUniqueKey(
          userDetails.accountType,
          userDetails.email
        );

        const db = getDatabase();
        set(ref(db, "users/" + key), {
          ...userDetails,
          key: key,
        });
        // Signed in
        const user = userCredential.user;
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "You can now login",
        }).then((resp) => history.push("/login"));
        // ...
      })
      // if there is an error show error message
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        seterror(errorMessage);
        // ..
      });
  };


  const handleLogout = ()=>{
    const auth = getAuth();
    auth.signOut().then(()=>{
      setuser({});
      history.push("/login");
    })
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setuser(user);
    }
  } , [])

  return (
    <GlobalContext.Provider
      value={{
        HandleLoginUser: HandleLoginUser,
        handleSignupUser: handleSignupUser,
        handleLogout: handleLogout,
        error,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider};