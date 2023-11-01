import React, { useState, useEffect } from "react";
import "./Login.css";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Login = (data) => {
  const [isSignUp, setIsSignUp] = useState(false);
  useEffect(() => {
    document.title = "Login | SignUp";
  }, []);

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  return (
    <div className="LOGIN">
      <h2>
        <a
          href="/"
          style={{
            color: "rgb(45, 45, 45)",
            background: "transparent",
            border: "0.4mm solid rgb(50, 50, 50)",
            borderRadius: "7mm",
            padding: "10px 15px",
            fontSize: "medium",
            fontFamily: "poppins",
            fontWeight: 400,
          }}
        >
          Back to Home page
        </a>
      </h2>
      <div
        className={`container ${isSignUp ? "right-panel-active" : ""}`}
        id="container"
      >
        <div
          className={`form-container ${
            isSignUp ? "sign-up-container" : "sign-in-container"
          }`}
        >
          {isSignUp ? (
            <SignupForm
              serverRoute={data.serverRoute}
              clientRoute={data.clientRoute}
            />
          ) : (
            <LoginForm
              serverRoute={data.serverRoute}
              clientRoute={data.clientRoute}
            />
          )}
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <button
                className="ghost"
                id="signIn"
                style={{ background: "white" }}
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello!</h1>
              <p>Need an account?</p>
              <button
                className="ghost"
                id="signUp"
                style={{ background: "white" }}
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
