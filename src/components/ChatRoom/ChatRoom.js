import "./ChatRoom.css";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import Sidebar from "./components/Sidebar/Sidebar";

function ChatRoom() {
  return (
    <div className="chatroom">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatRoom;
