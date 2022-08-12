import UserInfor from "./UserInfo";
import RoomList from "./RoomList";
import "./Sidebar.css";
import Mode from "../../../../assets/img/mode-icon.svg";
import { useAuthContext } from "../../../../hooks/useAuthContext";

function Sidebar() {
  const { isLightmode, setIsLightmode } = useAuthContext();
  const handleChangeMode = () => {
    setIsLightmode((pre) => !pre);
  };
  return (
    <div className="sidebar">
      <div>
        <UserInfor />
        <RoomList />
      </div>
      <img
        className="mode"
        src={Mode}
        alt="mode"
        onClick={handleChangeMode}
        style={
          isLightmode === false
            ? { filter: "invert(25%)", transition: "all 0.25s ease-in-out" }
            : { filter: "invert(100%)", transition: "all 0.25s ease-in-out" }
        }
      />
    </div>
  );
}

export default Sidebar;
