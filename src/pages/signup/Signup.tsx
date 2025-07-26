import { useState, useCallback } from "react";
import "./signup.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setAuthenticationHeader } from "../../utilities/authenticationHeader";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: string;
  profilePic: File | null;
  terms: boolean;
  recaptcha: boolean;
}

interface Errors {
  [key: string]: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    profilePic: null,
    terms: false,
    recaptcha: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    username: false,
    email: false,
  });
  const [timeouts, setTimeouts] = useState<{ [key: string]: NodeJS.Timeout | null }>({
    email: null,
    username: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // --- Validators ---
  const validators: { [key: string]: (value: any) => string | true } = {
    firstName: (value: string) =>
      /^([A-Za-z.]+\s?)+$/.test(value.trim()) && value.trim().length >= 2
        ? true
        : "First name must be at least 2 characters and can contain letters, spaces, and dots.",
    lastName: (value: string) =>
      /^([A-Za-z.]+\s?)+$/.test(value.trim()) && value.trim().length >= 2
        ? true
        : "Last name must be at least 2 characters and can contain letters, spaces, and dots.",
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? true
        : "Invalid email format!",
    username: (value: string) =>
      /^[a-zA-Z][a-zA-Z0-9._]{3,19}$/.test(value)
        ? true
        : "Username must start with a letter, be 4-20 characters, and can contain letters, numbers, dot or underscore.",
    password: (value: string) =>
      value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^A-Za-z0-9]/.test(value)
        ? true
        : "Password must have 8+ characters, uppercase, lowercase, number, and special character.",
    confirmPassword: (value: string) =>
      value === formData.password
        ? true
        : "Passwords do not match.",
    gender: (value: string) =>
      ["male", "female", "other"].includes(value)
        ? true
        : "Please select a gender.",
    profilePic: (value: File | null) =>
      value && value.size < 2 * 1024 * 1024 // 2MB
        ? true
        : "Profile picture is required and must be less than 2MB.",
    terms: (value: boolean) =>
      value ? true : "You must agree to the terms and conditions.",
    recaptcha: (value: boolean) =>
      value ? true : "Please verify that you are not a robot.",
  };

  // --- Availability check (debounced) ---
  const checkAvailability = useCallback(
    async (field: string, value: string) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/admin/check-${field}/${value}`
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
        setErrors((prev) => ({
          ...prev,
          [field]: "Error checking availability.",
        }));
      }
    },
    [BASE_URL]
  );

  // --- Input change handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    let val: any = value;
    if (type === "checkbox") val = checked;
    // If it's a file input, use the first file
    if (type === "file") val = files && files[0];
    //if filesize is greater that 1 MB, set error
    if (type === "file" && files && files[0] && files[0].size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePic: "Profile picture must be less than 1MB.",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        profilePic: "",
      }));
    }

    // Validate field
    if (validators[name]) {
      const validationResult = validators[name](val);
      setErrors((prev) => ({
        ...prev,
        [name]: validationResult === true ? "" : validationResult,
        ...(name === "password" && {
          confirmPassword:
            formData.confirmPassword && val !== formData.confirmPassword
              ? "Passwords do not match."
              : "",
        }),
      }));

      // Check availability for email/username
      if (
        validationResult === true &&
        (name === "email" || name === "username")
      ) {
        if (timeouts[name]) clearTimeout(timeouts[name]!);
        const newTimeout = setTimeout(() => {
          checkAvailability(name, val);
        }, 500);
        setTimeouts((prev) => ({
          ...prev,
          [name]: newTimeout,
        }));
      } else if (name === "email" || name === "username") {
        setAvailability((prev) => ({
          ...prev,
          [name]: false,
        }));
      }
    }

    // For profile picture preview
    if (name === "profilePic" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  // --- Submit handler ---
  const isErrors = Object.values(errors).some((value) => value !== "");
  const isFormValid =
    Object.keys(validators).every((key) => {
      const result = validators[key](formData[key as keyof FormData]);
      return result === true;
    }) && !isErrors;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate all fields before submit
    const newErrors: Errors = {};
    Object.keys(validators).forEach((key) => {
      const result = validators[key](formData[key as keyof FormData]);
      if (result !== true) newErrors[key] = result as string;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare form data for file upload
        const data = new FormData();
        // 
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "profilePic" && value) {
            data.append('avatar', value as File);
          } else if (key !== "confirmPassword") {
            data.append(key, value as string);
          }
        });

        await axios.post(`${BASE_URL}/api/admin/signup`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Signup successful!");
        // Auto login after signup
        const { data: loginData } = await axios.post(`${BASE_URL}/api/admin/login`, {
          username: formData.username,
          password: formData.password,
        });
        localStorage.setItem("jsonwebtoken", loginData.token);
        localStorage.setItem("adminUser", JSON.stringify(loginData.adminUser));
        setAuthenticationHeader(loginData.token);
        navigate("/");
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
          "An error occurred during signup. Please try again."
        );
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="signup-container">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
        <fieldset className="signup-fieldset">
          <legend>Personal Info</legend>
          <div className="form-row">
            <div className="personal-info">
              <div className="form-group profile-pic-group">
                <label htmlFor="profilePic">Profile Picture</label>
                <div className="profile-pic-upload">
                  <input
                    type="file"
                    name="profilePic"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {profilePreview && (
                    <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
                  )}
                </div>
                {errors.profilePic && <p className="error">{errors.profilePic}</p>}
              </div>
              <div className="form-group">

                <div className="name-fields">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                  />
                  {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div className="name-fields">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                  />
                  {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className="signup-fieldset">
          <legend>Account Info</legend>
          <div className="account-info-row">
            <div >
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
              {availability.email && !errors.email && (
                <p className="success">Email is available.</p>
              )}
            </div>
            <div >
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="error">{errors.username}</p>}
              {availability.username && !errors.username && (
                <p className="success">Username is available.</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label="Show/Hide password"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label="Show/Hide confirm password"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="signup-fieldset">
          <legend>Other Info</legend>
          <div className="form-row">
            <div className=" gender-field">
              <label>Gender</label>
              <div className="gender-options">
                {["male", "female", "other"].map((gender) => (
                  <label key={gender} className="gender-label">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      required
                    />
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                ))}
              </div>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>
            <div className=" terms-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
                I agree to the <Link to="terms" target="_blank" rel="noopener noreferrer">terms and conditions</Link>.
              </label>
              {errors.terms && <p className="error">{errors.terms}</p>}
              <label className="recaptcha-label">
                <input
                  type="checkbox"
                  name="recaptcha"
                  checked={formData.recaptcha}
                  onChange={handleChange}
                  required
                />
                I'm not a robot
              </label>
              {errors.recaptcha && <p className="error">{errors.recaptcha}</p>}
            </div>
          </div>
        </fieldset>

        <button type="submit" disabled={!isFormValid || submitting}>
          {submitting ? "Registering..." : "Sign Up"}
        </button>
        <button type="button" className="secondary-btn" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
