import { useEffect } from "react";
import { projectAuth, projectFirestore } from "../../../../firebase/config";
import { updateDocument } from "../../../../firebase/service";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import Avatar from "./Avatar";

function UserInfor() {
  const {
    user,
    setSelectedRoomID,
    setSelectedRoom,
    setSelectedUser,
    setShowRoomModal,
    setShowInviteModal,
  } = useAuthContext();
  useEffect(() => {
    let ref = projectFirestore.collection("users");

    const unsub = ref.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(data, snapshot, snapshot.docs);
    });

    return () => unsub();
  }, []);
  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    setSelectedRoomID("");
    setSelectedRoom(null);
    setShowRoomModal(false);
    setShowInviteModal(false);
    setSelectedUser(null);
    //! Không hiểu sao phải logout trước mới update online được, update trước bị lỗi :>
    await projectAuth.signOut();
    await updateDocument("users", { online: false }, user.uid);
  };
  return (
    <div className="userinfo">
      <div className="info">
        <Avatar src={user.photoURL} alt="User Avatar" />
        <span>{user.displayName}</span>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserInfor;
