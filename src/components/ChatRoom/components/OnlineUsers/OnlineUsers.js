import { addDocument } from "../../../../firebase/service";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import Avatar from "../Sidebar/Avatar";
import "./OnlineUsers.css";
function OnlineUsers() {
  const { user, setSelectedUser, selectedUser, isLightmode } = useAuthContext();
  const { document: users } = useCollection("users");
  const { document: nicknames } = useCollection("nicknames");

  //TODO: Add nickname
  const handleAddNickName = (u) => {
    const haveNickname = nicknames?.find(
      (nickname) =>
        (u.uid === nickname.uid_A || u.uid === nickname.uid_B) &&
        (user.uid === nickname.uid_A || user.uid === nickname.uid_B)
    );

    if (!haveNickname) {
      addDocument("nicknames", {
        uid_A: user.uid,
        uid_B: u.uid,
        displayName_A: user.displayName,
        displayName_B: u.displayName,
      });
    }
  };
  const handleChooseUser = (u) => {
    setSelectedUser(u);
    handleAddNickName(u);
    console.log(u);
  };
  return (
    <div
      className="user-list"
      style={
        isLightmode === false
          ? {
              backgroundColor: "#18191a",
              color: "#fff",
              transition: "all 0.25s ease-in-out",
            }
          : { transition: "all 0.25s ease-in-out" }
      }
    >
      <h2
        style={
          isLightmode === false
            ? { color: "#fff", transition: "all 0.25s ease-in-out" }
            : { transition: "all 0.25s ease-in-out" }
        }
      >
        All users
      </h2>
      {users &&
        users
          .filter((u) => u.uid !== user.uid)
          .map((u) => (
            <div
              key={u.uid}
              className="user-list-item"
              onClick={() => handleChooseUser(u)}
              style={
                u.uid === selectedUser?.uid
                  ? isLightmode === false
                    ? { backgroundColor: "#ccc" }
                    : { backgroundColor: "#f5f5f5" }
                  : null
              }
            >
              <div className="user-list-info">
                <Avatar src={u.photoURL} />
                <span>{u.displayName}</span>
              </div>
              {u.online && <span className="online-user"></span>}
            </div>
          ))}
    </div>
  );
}

export default OnlineUsers;
