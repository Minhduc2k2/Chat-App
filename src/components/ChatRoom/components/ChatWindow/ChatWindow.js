import styled from "styled-components";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import ChatGroup from "./ChatGroup";
import ChatUser from "./ChatUser";
const WrapperStyled = styled.div`
  height: 100vh;
  width: 100%;
`;

function ChatWindow() {
  const { selectedUser, isLightmode } = useAuthContext();

  return (
    <WrapperStyled
      style={
        isLightmode === false
          ? { backgroundColor: "#18191a", transition: "all 0.25s ease-in-out" }
          : { transition: "all 0.25s ease-in-out" }
      }
    >
      {selectedUser ? <ChatUser /> : <ChatGroup />}
    </WrapperStyled>
  );
}

export default ChatWindow;
