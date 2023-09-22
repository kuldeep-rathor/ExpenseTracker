import React from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 

const Auth = () => {
  const  navigate = useNavigate()
  const SignInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    // console.log(results)
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate ("/expense-tracker")
  };
  return (
    <div className="login-page">
      <p> Sign In With Google to Continue </p>
      <button className="login-with-google-btn" onClick={SignInWithGoogle}>
        {" "}
        Sign In With Google
      </button>
    </div>
  );
};

export default Auth;
