import React, { useState, useContext, useEffect } from "react";
import Radio from "../../Component/Radio/Radio";
import "./SignIn.css";
import signIn from "../../images/book-img.svg";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FcGoogle } from "react-icons/fc";
import TextField from "@mui/material/TextField";
import { login } from "../../Api/DoctorApi";
import Navbar from "../../Component/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../features/user";
import { GoogleLogin } from "react-google-login";
import swal from "sweetalert";
import FacebookLogin from "react-facebook-login";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function SignIn() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingf, setLoadingf] = useState(false);
  const [value, setValue] = useState();
  const [open, setOpen] = React.useState(false);
  const [forget_p_text, setforget_p_text] = useState("");
  const [disablebtn, setDisableBtn] = useState(true);
  const [forgotEmail, setForgotEmail] = useState();
  const [hide, setHide] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setValue(event.target.value);
    setDisableBtn(false);
  };

  const loginDoctor = async () => {
    if (!email) {
      return setError("Please provide a valid email address.");
    }
    if (!password) {
      return setError("Password field cant be empty.");
    }
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        setLoading(false);
        let currentUser = localStorage.getItem("user");
        dispatch(LOGIN(JSON.parse(currentUser)));
        navigate("/doctorDashboard");
      } else {
        setError(response.message, "fffff");
        setLoading(false);
      }
    } catch (e) {
      setError(e.message, "rrrrrr");
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <Navbar />
      <div className="container">
        <img src={signIn} alt="login" className="SignIn-Img" />

        <div className="loginContainer">
          <h2 className="title">Login</h2>

          <p
            style={{
              color: "red",
              marginTop: 5,
              textAlign: "center",
              fontSize: 20,
              paddingBottom: 10,
            }}
          >
            {error ? error : ""}
          </p>

          <TextField
            value={email}
            type="email"
            className="text-field"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Email Address"
            variant="outlined"
          />

          <TextField
            value={password}
            type="password"
            className="text-field"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Password"
            variant="outlined"
          />

          <div className="passForgotContainer">
            <p onClick={handleOpen}>forgot Password</p>

            <Button
              onClick={loginDoctor}
              className="sigInBtn"
              variant="contained"
            >
              Login
            </Button>
          </div>

          <p className="dont-have-account">
            Don't have account?{" "}
            <Link to="/SignUp" className="sign-up">
              Contact Claron support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
