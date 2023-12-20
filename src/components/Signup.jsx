import { React,useState } from "react";
import Modal from './Modal'
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";
import { FaSmileBeam } from "react-icons/fa";
import { TbMoodSadFilled } from "react-icons/tb";

const BACKEND = process.env.REACT_APP_BACKEND

const MIN_PASSWORD_LENGTH = 8;

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordStatus(false);
      return "Weak - Password should be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordStatus(false);
      return "Weak - Password should contain at least 1 uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      setPasswordStatus(false);
      return "Weak - Password should contain at least 1 lowercase letter";
    }

    if (!/\d/.test(password)) {
      setPasswordStatus(false);
      return "Weak - Password should contain at least 1 number";
    }

    if (!/\W/.test(password)) {
      setPasswordStatus(false);
      return "Weak - Password should contain at least 1 alphanumeric character";
    }
    setPasswordStatus(true);
    return "Strong - Good job!";
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if(setPasswordStatus){
        setError(passwordCheck)
      }
      const response = await fetch(BACKEND + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 409) {
        setLoading(false);
        setError("Username already exists");
        return;
      }

      if (response.ok) {
        setLoading(false);
        setError(null);
        const user = await response.json();
        console.log("Signup successful");
        localStorage.setItem("user", JSON.stringify(user.user));
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      setError("Server Error");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && <Modal content={error} />}
          <div className="home-container">
            <img src={"/assets/logo.png"} alt="logo" />
            <h2 className="title">LeetLadders</h2>
          </div>
          <div className="form">
            <div className="input">
              <input
                type="text"
                value={username}
                placeholder="A unique username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordCheck(checkPasswordStrength(e.target.value));
                }}
              />
              <div className={`password-strength ${passwordStatus?"green-text":"red-text"}`} >{passwordStatus!=null?(passwordStatus?<FaSmileBeam/>:<TbMoodSadFilled/>):("")}{passwordCheck}</div>
              <button className="btn" onClick={(e) => handleSubmit(e)}>
                Sign Up
              </button>
            </div>
            <div className="bottom-content">
              Already a user ?{" "}
              <span onClick={() => navigate("/login")}>Sign In</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
