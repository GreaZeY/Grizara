import React, { Fragment, useRef, useState, useEffect } from "react";
import "./Login.css";
import Loader from "../Loader/Loader";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction.js";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import ForgotPassword from "./ForgotPassword";

const LoginAndSignUp = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo:""
  });

  const { name, email, password, mobileNo } = user;

  const [avatar, setAvatar] = useState(undefined);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [forgotPass,setForgotPass]=useState(false)

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("mobileNo", mobileNo);
    myForm.set("password", password);
    if(avatar){
        myForm.set("avatar", avatar);
    }
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
            if(reader.result){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
            }
        }
      };
      if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]);
      }
      
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
          //Registering with existing email
        if(error==="Duplicate email Entered."){
            alert.error(`A user is already registered with this email`)
            }else{
                alert.error(error);
            }
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      document.title="Login"
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
      document.title="Register"
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  return (
    <Fragment >
      {loading ? (
        <Loader />
      ) :  
        (<Fragment  >
          <div className="LoginSignUpContainer" >
          {forgotPass?
          <div className="forgotComp">
            <button
        onClick={()=>{setForgotPass(false)}}
        >
        <ArrowBackIcon/>
        </button>
        <ForgotPassword/>  
        </div>
                :
            <div className="LoginSignUpBox">
                <MetaData title="Login"/>
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div >
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <p className="forgot" onClick={()=>setForgotPass(true)}>Forgot Password?</p>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpMobileNo">
                  <LocalPhoneIcon />
                  <input
                    type="Number"
                    placeholder="Mobile no."
                    required
                    name="mobileNo"
                    value={mobileNo}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>}
          </div>
        </Fragment>)
      }
    </Fragment>
  );
};

export default LoginAndSignUp;