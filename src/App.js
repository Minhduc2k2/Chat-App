import "./App.css";
import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import RoomModal from "./components/Modal/RoomModal";
import InviteModal from "./components/Modal/InviteModal";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatRoom />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <RoomModal />
      <InviteModal />
    </>
  );
}

export default App;
