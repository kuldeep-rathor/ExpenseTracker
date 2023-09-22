import React from "react";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";

const Auth = () => {
  const SignInWithGoogle = async () => {
    const results = await signInWithPopup(auth , provider);
    console.log(results) 
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
