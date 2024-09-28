import Single from "../../components/single/Single";
import { singleUser } from "../../data";
import "./user.scss";

const User = () => {
  //fetch the data and send to single component
  //fetch the specific user data by the user id given from url and fetch single user details

  return (
    <div className="user">
      <Single {...singleUser} />
    </div>
  );
};

export default User;
