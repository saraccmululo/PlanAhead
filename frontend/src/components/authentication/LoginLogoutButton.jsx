import { useNavigate } from "react-router-dom";
import { useContext} from "react";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";

const LoginLogoutButton = () => {
  const navigate = useNavigate();
  const {user, isLoggedIn, logout} = useContext(AuthContext);

  const handleLogin =()=>{
    navigate("/login")
  }

  const handleLogout =()=>{
      logout();
      toast.success("Logged out. See you later", {style: {
      background: "#1E3A8A",color: "white",
    }})
      navigate("/");
    }

  return (
    <>
    {isLoggedIn && <span className="user-name" >Hi, {user.username}</span>}
   <button className='btn btn-primary btn-auth' style={{ backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' }} onClick={isLoggedIn? handleLogout : handleLogin}>{isLoggedIn? "Logout" : "Login" }</button>
  </>
  )}

export default LoginLogoutButton