import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitNewPassword } from "../../utils/api";
import { toast } from "react-toastify";

const SubmitNewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const message = await submitNewPassword(token, password.trim());
      setSuccess(message);
      toast.success(message, {style: {background: "#1E3A8A",color: "white"}});
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg p-4" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Set a New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-control mb-3"
        />
        <button type="submit" disabled={loading} className="btn w-100" style={{backgroundColor:"#1E3A8A",color:"white"}}>
          {loading ? "Submitting..." : "Reset Password"}
        </button>
      </form>
      {error && <p style={{color:"red", textAlign:"center"}}>{error}</p>}
      {success && <p style={{color:"green", textAlign:"center"}}>{success}</p>}
    </div>
  );
};

export default SubmitNewPassword;
