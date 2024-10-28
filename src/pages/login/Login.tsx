import { useState } from "react";
import axios from "axios";
import "./login.scss";
import { setAuthenticationHeader } from "../../utilities/authenticationHeader";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const nevigate = useNavigate();
  const handleChange = (e: { target: { name: any; value: string } }) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    //post username n password for login authentication
    axios
      .post("http://localhost:3000/login", {
        username: credentials.username,
        password: credentials.password,
      })
      .then((result) => {
        if (result.data.success) {
          const token = result.data.token;
          localStorage.setItem("jsonwebtoken", token);
          //set default auth. header
          setAuthenticationHeader(token);
          nevigate("/");
        } else {
          console.log(result.data.message);
          alert(result.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*const handleShowUser = () => {
    //show a user by username when only have authentication token
    axios
      .get(`http://localhost:3000/dashboard/${credentials.username}`)
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };*/

  return (
    <div className="login">
      <h1>Admin Login</h1>

      <form onSubmit={handleForm}>
        <p>Username</p>
        <input
          type="text"
          onChange={handleChange}
          name="username"
          id="username"
        />
        <p>Password</p>
        <input
          type="password"
          onChange={handleChange}
          name="password"
          id="password"
        />
        <button id="submit" type="submit">
          Login
        </button>
        <p id="notAccount">
          Not have an account?{" "}
          <span onClick={() => nevigate("/signup")}>Sign Up Here</span>
        </p>
        {/* <button id="signup" onClick={() => nevigate("/signup")} type="button">
          Signup
        </button> */}
      </form>
    </div>
  );
};
export default Login;
