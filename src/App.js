import "./App.css";
import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import RoomModal from "./components/Modal/RoomModal";
import InviteModal from "./components/Modal/InviteModal";
import ChangeNameRoomModal from "./components/Modal/ChangeNameRoomModal";
import ChangeNameUserModal from "./components/Modal/ChangeNameUserModal";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatRoom />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <RoomModal />
      <InviteModal />
      <ChangeNameRoomModal />
      <ChangeNameUserModal />
    </>
  );
}

export default App;
