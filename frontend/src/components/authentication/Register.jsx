import { useState, useContext } from "react";
import { registerUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";

const Register = ({setRegister}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate=useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setError("");
    setLoading(true);

    try{
      const response = await registerUser(username.trim(), email.trim(), password.trim());
      
      // Use the context login to save user + tokens in state & localStorage
      login({
        user_id: response.user_id,
        username: response.username,
        access_token: response.access_token,
      });
      
      navigate("/")
      toast.success("You’re in!")
    } catch (error){
      setError(error.message|| "Failed to register. Please try again.")
    } finally {
      setLoading(false);
  }
}

  return (
   <div>
    <h2 className="text-center mb-4" style={{ color: "#111827" }}> Create an Account</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label" style={{ color: "#111827" }}>Username
        </label>
        <input type="text" name="username" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" required className="form-control" style={{ borderColor: "#D1D5DB" }}/>
      </div>

      <div>
        <label htmlFor="email" className="form-label" style={{ color: "#111827" }}>Email Address
        </label>
        <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email address" required className="form-control" style={{ borderColor: "#D1D5DB" }}/>
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label" style={{ color: "#111827" }}>Password
        </label>
        <input type="password" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" required className="form-control" style={{ borderColor: "#D1D5DB" }}/>
      </div>

      <button type="submit" className="btn w-100" disabled={loading}  style={{backgroundColor: "#1E3A8A",color: "white",border: "none"}}> {loading? "Submitting":"Register" }
      </button>
    
      <p className="mt-3 text-center" style={{ color: "#374151" }}>Already have an account? {" "}
        <button type="button" className="btn btn-link p-0"
        style={{ color: "#3B82F6" }}onClick={()=>setRegister(false)}>Login
        </button>
      </p>

      {error && (
        <p className="text-center mt-2" style={{ color: "#EF4444" }}>{error}
        </p>
      )}
    </form>
   </div>
  )
}

export default Register