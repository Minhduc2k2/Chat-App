import "./ChatRoom.css";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import OnlineUsers from "./components/OnlineUsers/OnlineUsers";
import Sidebar from "./components/Sidebar/Sidebar";

function ChatRoom() {
  return (
    <div className="chatroom">
      <Sidebar />
      <ChatWindow />
      <OnlineUsers />
    </div>
  );
}

export default ChatRoom;
