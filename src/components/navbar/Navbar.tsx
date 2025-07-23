import { useContext, useState } from "react";
import "./navbar.scss";
import { ThemeContext } from "../../utilities/context";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useLocalStorage from "../../utilities/useLocalStorage";
import Logout from "../Logout/Logout";

const Navbar = () => {
  const { theme, handleSetScreen } = useContext(ThemeContext);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const { getItem } = useLocalStorage("screen");

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.svg" alt="LOGO" />
        <span>Hosainadm</span>
      </div>
      <div className="icons">
        <div className="dark-mode-switch">
          <DarkModeSwitch
            style={{ width: "25px", height: "80%" }}
            checked={theme !== "light"}
            onChange={
              theme === "light"
                ? () => handleSetScreen(getItem())
                : () => handleSetScreen(getItem())
            }
            size={120}
          />
        </div>
        <img
          style={{ filter: theme === "light" ? "invert(1)" : "invert(0)" }}
          src="/search.svg"
          alt=""
          className="icon"
        />
        <img
          style={{ filter: theme === "light" ? "invert(1)" : "invert(0)" }}
          src="/app.svg"
          alt=""
          className="icon"
        />
        <img
          style={{ filter: theme === "light" ? "invert(1)" : "invert(0)" }}
          src="/expand.svg"
          alt=""
          className="icon"
        />
        <div className="notification">
          <img
            style={{ filter: theme === "light" ? "invert(1)" : "invert(0)" }}
            src="/notifications.svg"
            alt=""
          />
          <span>1</span>
        </div>
        <div
          onMouseMove={() => setLogoutBtn(true)}
          onMouseLeave={() => setLogoutBtn(false)}
          className="user"
        >
          <img
            src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
            alt=""
          />
          {logoutBtn && (
            <Logout logoutBtn={logoutBtn} setLogoutBtn={setLogoutBtn} />
          )}
          <span>Has</span>
        </div>
        <img
          style={{ filter: theme === "light" ? "invert(1)" : "invert(0)" }}
          src="/settings.svg"
          alt=""
          className="icon"
        />
      </div>
    </div>
  );
};
export default Navbar;
