import { useState, useContext } from "react";
import { loginUser } from "../../utils/api";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify"
import Register from "./Register";
import ResetPassword from "./ResetPassword";
import AuthContext from "./AuthContext"

const Login = () => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [resetPasword, setResetPassword] = useState(false);
  
  const {login} = useContext(AuthContext);// useContext allows components to get the individual values they need from all the values made available

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");  // clearing old error before new attempt

    try{
      const data=await loginUser (email.trim(), password.trim()); 
      login(data);//save full user info for your later use
      toast.success("You’re in!", {style: {background: "#1E3A8A",color: "white"}})
      navigate("/");
      
    } catch (error){
      setError(error.message||"Failed to log in. Please check your email and password.") 
    } finally {
      setLoading(false);
    }
  }
  const handleClose = () => navigate("/");

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#E5E7EB" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderColor: "#D1D5DB" }}>
      <div className="d-flex justify-content-end"> 
        <button type="button" className="btn-close"
        aria-label="Close" onClick={handleClose}></button>
      </div>
     
      {register? (
        <Register setRegister={setRegister}/>
      ) : resetPasword? (
        <ResetPassword setResetPassword={setResetPassword} />
      ):(
        <>
      <h2 className="text-center mb-4" style={{ color: "#111827" }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{ color: "#111827" }}>Email Address</label>
          <input type="email" name="email" id="email" placeholder="Enter your email address" value={email} onChange={(e)=>setEmail(e.target.value)} required className="form-control" style={{ borderColor: "#D1D5DB" }}/>
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{ color: "#111827" }}  >Password</label>
          <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}required className="form-control" style={{ borderColor: "#D1D5DB" }}/>
        </div>

        <button type="submit" className="btn w-100" disabled={loading}style={{backgroundColor: "#1E3A8A",color: "white",border: "none"}} >Login</button>
      </form> 
      
      <p className="mt-3 mb-1 text-center" style={{ color: "#374151" }}>Forgot your password? {" "}
        <button onClick={()=>setResetPassword(true)} className="btn btn-link p-0" style={{ color: "#3B82F6" }}>Reset Password
        </button>
      </p>

      <p className="text-center" style={{ color: "#374151" }}>
        Not Registered? {" "}
        <button onClick={()=>setRegister(true)} className="btn btn-link p-0" style={{ color: "#3B82F6" }}> Create an Account
        </button>
      </p>

      {error && (
        <p className="text-center mt-2" style={{ color: "#EF4444" }}>{error}
        </p>)}
      </>
      )}
    </div>
    </div>
  )
}

export default Login