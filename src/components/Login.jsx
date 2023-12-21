import { React, useState } from "react";
import Modal from './Modal'

import {  useNavigate } from "react-router-dom";
import Loading from "./Loading";

const BACKEND = 'http://localhost:5000'

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(BACKEND+"/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        setLoading(false);
        setError(null);
        const user = await response.json();
        console.log("Login successful");
        localStorage.setItem("user", JSON.stringify(user.user));
        navigate('/');
        window.location.reload();
      } else {
        setError("Incorrect Username/Password");
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setLoading(false);
      setError("Server Error");

    }
  };

  return (
    <>
      {loading ? (
        <Loading/>
      ) : (
        <>
        {error&&<Modal content={error}/>}
          <div className="home-container">
            <img src={"/assets/logo.png"} alt="logo" />
            <h2 className="title">LeetLadders</h2>
          </div>
          <div className="form">
            <div className="input">
              <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn" onClick={(e)=>handleSubmit(e)}> Sign In</button>
            </div>
            <div className="bottom-content">
                New here ? <span onClick={()=>navigate('/signup')}>Sign Up</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
