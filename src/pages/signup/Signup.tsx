import { useState, useCallback } from "react";
import "./signup.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthenticationHeader } from "../../utilities/authenticationHeader";

interface FormData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
}

interface Errors {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface Credentials {
  username: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [errors, setErrors] = useState<Errors>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    username: false,
    email: false,
  });
  const [timeouts, setTimeouts] = useState<{ [key: string]: NodeJS.Timeout | null }>({
    email: null,
    username: null,
  });


  const navigate = useNavigate();

  // Validation functions with proper TypeScript types
  const validators: { [key: string]: (value: string) => string | true } = {
    firstName: (value) =>
      /^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(value) || "First name cannot contain numbers or symbols.",
    lastName: (value) =>
      /^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(value) || "Last name cannot contain numbers or symbols.",
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email format!",
    username: (value) =>
      /^[a-zA-Z0-9._]+$/.test(value) || "Invalid username format!",
    password: (value) =>
      (value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value)) ||
      "Password must have 8+ characters, uppercase, lowercase, and a number.",
  };


  // Check availability (debounced API call)
  const checkAvailability = useCallback(
    async (field: string, value: string) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/check-${field}/${value}`
        );
        setAvailability((prev) => ({
          ...prev,
          [field]: !response.data.exists,
        }));
        setErrors((prev) => ({
          ...prev,
          [field]: response.data.exists ? `${field.charAt(0).toUpperCase() + field.slice(1)} already taken!` : "",
        }));
      } catch (error) {
        console.error(error);
      }
    },
    []
  );


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (validators[name]) {
      const validationResult = validators[name](value);

      setErrors((prev) => ({
        ...prev,
        [name]: validationResult === true ? "" : validationResult, // Keep error if invalid
      }));
      console.log(value)
      // Only check availability if validation passes
      if (validationResult === true && (name === "email" || name === "username")) {

        // Clear the previous timeout if it exists
        if (timeouts[name]) clearTimeout(timeouts[name]!);

        // Set a new timeout for checking availability
        const newTimeout = setTimeout(() => {
          checkAvailability(name, value);
          console.log("Availability checked for:", name);
        }, 500);

        setTimeouts((prev) => ({
          ...prev,
          [name]: newTimeout,
        }));
      } else {
        // If invalid, reset availability status
        console.log('CLEAR availability')
        setAvailability((prev) => ({
          ...prev,
          [name]: false,
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  const isErrors = Object.values(errors).some((value) => value !== "");

  //function for autometic login after signup
  const login = async (credentials: Credentials) => {
    try {
      const { data } = await axios.post("http://localhost:3000/login", credentials);

      localStorage.setItem("jsonwebtoken", data.token);
      setAuthenticationHeader(data.token);
      navigate("/");

    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Autemetic login error:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isErrors) {
      try {
        console.log(formData)
        await axios.post("http://localhost:3000/signup", formData);
        alert("Signup successful!");
        //autometic login after successfully signup
        login({ username: formData.username, password: formData.password })
      } catch (error) {
        alert("An error occurred during signup.");
      }
    } else {
      console.log("Validation errors exist!");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {(["firstName", "lastName", "email", "username", "password"] as const).map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").trim()}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
            {errors[field] && <p className="error">{errors[field]}</p>}
            {availability[field] && !errors[field] && (
              <p className="success">{field.charAt(0).toUpperCase() + field.slice(1)} is available.</p>
            )}
          </div>
        ))}

        <div className="gender-field">
          <label>Gender</label>
          {["male", "female", "other"].map((gender) => (
            <div key={gender}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={handleChange}
                required
              />
              <label htmlFor={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</label>
            </div>
          ))}
        </div>

        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
