import axios from "axios";
import "./logout.scss";
import { useNavigate } from "react-router-dom";

type Props = {
  logoutBtn: boolean;
  setLogoutBtn: (bool: boolean) => void;
};
const Logout = (props: Props) => {
  const nevigate = useNavigate();
  const handleLogout = () => {
    var result = confirm("Want to Logout?");
    if (result) {
      localStorage.removeItem("jsonwebtoken");
      nevigate("/login");
      delete axios.defaults.headers.common["Authorization"];
    }
  };
  return (
    <div
      onMouseEnter={() => props.setLogoutBtn(true)}
      onMouseLeave={() => props.setLogoutBtn(false)}
      className="logout"
    >
      <div className="internal">
        <button onClick={handleLogout} type="button">
          Logout
        </button>
      </div>
    </div>
  );
};
export default Logout;
