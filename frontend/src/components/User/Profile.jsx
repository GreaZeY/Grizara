import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import "./Profile.css";
import { logout, clearErrors, updateProfile, loadUser,updatePassword } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import { useAlert } from "react-alert";
import "./profileChange.scss"
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import CameraAltIcon from '@mui/icons-material/CameraAlt';


const Profile = ({ history }) => {

  const [editMode, setEditMode] = useState(false);
  const [changePassMode, setChangePassMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [mobileNo, setMobileNo] = useState('');
  const [message,setMessage]=useState('')
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { error, isUpdated,loading:Uloading } = useSelector((state) => state.profile);
  
  const dispatch = useDispatch();
  const alert = useAlert();
  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login");
    }
  }, [history, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
      setMobileNo(user.mobileNo)
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success(message);
      dispatch(loadUser());
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, error, alert, history, user, isUpdated, message]);

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  function logoutUser() {
    dispatch(logout());
    alert.success("Logged out Successfully");
  }

  const editProfile = () => {
    setEditMode(true);
  };

  const update = () => {

  if(name===user.name&&email===user.email&&mobileNo===user.mobileNo&&avatarPreview===user.avatar.url){
    alert.error('Nothing has changed.')
  }else{
      const myForm = new FormData();
  
      myForm.set("name", name);
      myForm.set("email", email);
      myForm.set("avatar", avatar);
      myForm.set("mobileNo", mobileNo);
      dispatch(updateProfile(myForm));
      setMessage('Profile Updated Successfully')
  }
  };

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
    setMessage('Password updated successfully')
  };

  return (
    <Fragment>
      {(loading|Uloading) ? (
        <Loader />
      ) : (
        <div >
          {user ? (
            <div className="profileContainer">
              <MetaData title={`${user.name}'s Profile`} />
              <div>
                <h1>My Profile</h1>
                {editMode?
                <div class="profile-pic">
                <label class="-label" for="file">
                  <CameraAltIcon/>
                </label>
                <input 
                id="file" 
                type="file" 
                onChange={updateProfileDataChange}
                 />
                <img src={avatarPreview} alt={user.name} />
              </div>
                :
                <img src={user.avatar ? user.avatar.url : ""} alt={user.name} />
               }
                {editMode ? (
                  <button onClick={update} className="update" style={{background:"rgb(34, 223, 175)"}}>
                    Update
                  </button>
                ) : 
                !changePassMode?
                  <button
                    onClick={editProfile}
                    className="update"
                  >
                    Edit Profile
                  </button>:''
                }

                <button
                  onClick={editMode|changePassMode ? () => {setEditMode(false);setChangePassMode(false)} : logoutUser}
                  className="logout"
                >
                  {editMode|changePassMode ? "Cancel" : "Logout"}
                </button>
              </div>
              <div>
                <div>
                  <h4>Full Name</h4>
                  {editMode?
                  
               
                  <input
                  className="updateInfo"
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               
                  :
                  <p>{user.name}</p>}
                </div>
                <div>
                  <h4>Email</h4>
                  {editMode?
                  <input
                  className="updateInfo"
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                  :
                  <p>{user.email}</p>
                }</div>
                <div>
                  <h4>Mobile No.</h4>
                  {editMode?
                  <input
                  className="updateInfo"
                  type="Number"
                  placeholder="Mobile No."
                  required
                  name="mobileNo"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                />
                :
                    <p>{user.mobileNo ? user.mobileNo : "-"}</p>}
                </div>
                <div>
                  <h4>Joined On</h4>
                  <p>{String(user.createdAt).substr(0, 10)}</p>
                </div>

                <div>
                  <Link to="/orders">My Orders</Link>
                  {
                    changePassMode?
                    <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                className='update'
                style={{margin:0,marginTop:'1vmax',width:'100%',background:'rgb(34, 223, 175)'}}
                  type="submit"
                >Update Password</button>
              </form>
              :''
                    }
                 {     changePassMode ? '' : 
                 !editMode?
                <button
                  onClick={()=>setChangePassMode(true)}
                  className="update"
                  style={{width:'100%',background: 'rgb(68, 68, 68)',margin:0,marginTop:'1.2vmax'}}
                >
                  Change Password
                </button>:''
              }
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Profile;
