import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { ThemeContext } from "../../utilities/context";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useLocalStorage from "../../utilities/useLocalStorage";
import Logout from "../Logout/Logout";

type AdminUser = {
  avatar: object;
  avatarUrl?: string;
  firstName: string;

  // add other properties if needed
};
const Navbar = () => {
  const { theme, handleSetScreen } = useContext(ThemeContext);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const { getItem } = useLocalStorage("screen");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  useEffect(() => {
    //get adminUser from localStorage
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      setAdmin(JSON.parse(adminUser));
    }
  }, []);

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
        <div className="user">

          <div className="profile" onClick={() => setLogoutBtn(!logoutBtn)} onMouseEnter={(e) => {
            e.stopPropagation();
            setLogoutBtn(true)
          }}>
            <img
              src={admin ? admin.avatarUrl : ""} alt="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            />
            {logoutBtn && (
              <Logout logoutBtn={logoutBtn} setLogoutBtn={setLogoutBtn} />
            )}
            <span>{admin ? admin.firstName : "HAS"}</span>
          </div>
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
