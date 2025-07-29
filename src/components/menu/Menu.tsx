import { Link } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../data";
import { useContext } from "react";
import { ThemeContext } from "../../utilities/context";

// receive setShowMenu as a prop to control the menu visibility
type Props = { setShowMenu: (showMenu: boolean) => void };
const Menu = ({ setShowMenu }: Props) => {
  const { theme } = useContext(ThemeContext);
  // const [mouseEnter, setMouseEnter] = useState(false);

  // const [manageId, setManageId] = useState([
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  // ]);
  // const handleMouseEnter = (idIndex: number) => {
  //   setManageId([...manageId, (manageId[idIndex] = true)]);
  //   console.log(idIndex);
  //   console.log(manageId);
  // };
  // const handleMouseLeave = (idIndex: number) => {
  //   setManageId([...manageId, (manageId[idIndex] = false)]);
  // };

  return (
    <div
      style={{ color: theme !== "light" ? "white" : "black" }}
      className="menu"
    >
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link
              // style={{
              //   backgroundColor: manageId[listItem.id] ? "white" : "#384256",
              // }}
              // onMouseEnter={() => handleMouseEnter(listItem.id - 1)}
              // onMouseLeave={() => handleMouseLeave(listItem.id - 1)}
              to={listItem.url}
              className="listItem"
              key={listItem.id}
            >
              <img
                style={{
                  filter: theme !== "light" ? "invert(0)" : "invert(1)",
                }}
                src={"/" + listItem.icon}
                alt=""
                onClick={() => setShowMenu(false)}
              />
              <span className="listItemTitle">{listItem.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Menu;
