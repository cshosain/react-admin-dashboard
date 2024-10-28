// Signup.jsx
import { useEffect, useState } from "react";
import "./signup.scss"; // Import the SCSS file
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [displayError, setDisplayError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
  });
  useEffect(() => {
    setDisplayError("");
  }, [formData.email, formData.username]);

  const nevigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleErrorMsg = (error: string) => {
    console.log(error);
    if (error.includes("duplicate")) {
      if (error.includes("email")) {
        return "The email is already taken!";
      } else if (error.includes("username")) {
        return "The username is already taken!";
      } else return "Try another email and/or username.";
    } else return "Something went wrong!";
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to backend
    axios
      .post("http://localhost:3000/signup", {
        ...formData,
      })
      .then((response) => {
        console.log(response.data);
        alert("Signup has been successfull");
      })
      .catch((error) => {
        const displayError = handleErrorMsg(error.response.data.message);
        setDisplayError(displayError);
      });
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="gender-field">
            <label>Gender:</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div>
              <input
                type="radio"
                id="other"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          {displayError && <p style={{ color: "red" }}>{displayError}</p>}
        </div>
        <button type="submit">Sign Up</button>
        <button onClick={() => nevigate("/login")} type="button">
          Back to login
        </button>
      </form>
    </div>
  );
};

export default Signup;
