import { useState } from "react";
import { requestPasswordReset } from "../../utils/api";

const ResetPassword = ({setResetPassword}) => {
  const [email, setEmail] = useState("");
	const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
	const [resetMessage, setResetMessage] = useState("");
  
  const handleResetPassword = async(e) =>{
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);

    try{
      const message=await requestPasswordReset(email.trim());
      setResetMessage(message)
    } catch (error) {
      setError(error.message||"Failed to send reset email. Please check your email address");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4" style={{ color: "#111827" }}>Reset Your Password</h2>
				<form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: "#111827" }}>Email Address</label>
					  <input
						  type="email"
						  placeholder="Enter your email address"
						  value={email}
						  onChange={(e) => setEmail(e.target.value)}
						  required
              className="form-control"
              style={{ borderColor: "#D1D5DB" }}
					  />
          </div>
				
					<button type="submit" className="btn w-100"
            style={{backgroundColor: "#1E3A8A",color: "white",border: "none"}} disabled={loading}>{loading? "Submitting" : "Send Reset Email"}
          </button>
				</form>

        <p className="mt-3 text-center" style={{ color: "#374151" }}>
				  <button className="btn btn-link p-0"
          style={{ color: "#3B82F6" }} onClick={() => setResetPassword(false)}>Back to Login
          </button>
        </p>
        
        {error && <p className="text-center mt-2" style={{ color: "#EF4444" }}>{error}</p>}

				{resetMessage && <p className="text-center mt-2" style={{ color: "#10B981" }}>{resetMessage}</p>}
    </div>
  )
}

export default ResetPassword