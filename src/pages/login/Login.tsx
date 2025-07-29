import { useState } from "react";
import axios from "axios";
import "./login.scss";
import { setAuthenticationHeader } from "../../utilities/authenticationHeader";
import { useNavigate } from "react-router-dom";
import keySvg from "../../assets/key-svg.svg" // Assuming you have a key SVG in your assets
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg(""); // Reset error message on input change
  };

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(""); // Clear previous errors

    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/login`, credentials);

      if (data.success) {
        localStorage.setItem("jsonwebtoken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.adminUser));
        setAuthenticationHeader(data.token);
        navigate("/");
      } else {
        setErrorMsg("Wrong crerdentials!");
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        {/* key svg */}
        <img src={keySvg} alt="" />
        <h1>Admin</h1>
        <hr />

        <form onSubmit={handleFormSubmission}>
          <p>Username</p>
          <input type="text" onChange={handleInputChange} name="username" id="username" required />

          <p>Password</p>
          <input type="password" onChange={handleInputChange} name="password" id="password" required />

          {errorMsg && <p id="errorMsg">{errorMsg}</p>}

          <button id="submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p id="notAccount">
            Not have an account? <span onClick={() => navigate("/signup")}>Sign Up Here</span>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Login;
