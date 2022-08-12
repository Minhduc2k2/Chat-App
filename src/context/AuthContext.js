import { useEffect, useState } from "react";
import { createContext } from "react";
import { projectAuth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShowChangeNameRoomModal, setShowChangeNameRoomModal] =
    useState(false);
  const [selectedRoomID, setSelectedRoomID] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLightmode, setIsLightmode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        navigate("/");
      } else {
        navigate("/login");
      }
      setIsPending(false);
    });

    return () => unsub();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        showRoomModal,
        setShowRoomModal,
        showInviteModal,
        setShowInviteModal,
        showShowChangeNameRoomModal,
        setShowChangeNameRoomModal,
        selectedRoomID,
        setSelectedRoomID,
        selectedRoom,
        setSelectedRoom,
        isLightmode,
        setIsLightmode,
      }}
    >
      {isPending ? <Spin /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
