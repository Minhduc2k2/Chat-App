import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { addDocument } from "../../../../firebase/service";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import Message from "./Message";
import Pen from "../../../../assets/img/pen.svg";

const WrapperStyled = styled.div`
  height: 100vh;
  width: 100%;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-item: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 12px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

function ChatWindow() {
  const {
    user,
    selectedRoomID,
    setShowInviteModal,
    setShowChangeNameRoomModal,
    setSelectedRoom,
    isLightmode,
  } = useAuthContext();
  const [inputValue, setInputValue] = useState("");
  const { document: rooms } = useCollection("rooms", [
    "members",
    "array-contains",
    user.uid,
  ]);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const [form] = Form.useForm();

  //TODO: Get Selected Room
  const selectedRoom = useMemo(
    () =>
      rooms?.find((room) => room.id === selectedRoomID) ?? {
        name: "",
        description: "",
        members: ["abc"],
      },
    [rooms, selectedRoomID]
  );
  setSelectedRoom(selectedRoom);

  //TODO: Get Users in Selected Room
  const { document: users } = useCollection("users");
  const users_inRoom = users?.filter((user) =>
    selectedRoom.members.includes(user.uid)
  );
  // const { document: users_inRoom } = useCollection("users", [
  //   "uid",
  //   "in",
  //   selectedRoom.members,
  // ]);
  //TODO: Handle Event
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSendMessage = () => {
    addDocument("messages", {
      text: inputValue,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      roomID: selectedRoomID,
    });

    form.resetFields(["message"]);

    //!Focus input again when send message
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  //TODO: Get messages form collection
  const { document: messages } = useCollection("messages");
  const messages_inRoom = messages?.filter(
    (message) => selectedRoomID === message.roomID
  );

  //TODO: Auto Scroll to bottom after go into selected room
  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, []);

  //TODO: Auto Scroll to bottom after send message
  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled
      style={
        isLightmode === false
          ? { backgroundColor: "#18191a", transition: "all 0.25s ease-in-out" }
          : { transition: "all 0.25s ease-in-out" }
      }
    >
      {selectedRoomID ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <div style={{ display: "flex" }}>
                <p
                  className="header__title"
                  style={isLightmode === false ? { color: "#fff" } : null}
                >
                  {selectedRoom.name}
                </p>
                <img
                  src={Pen}
                  alt="Pen"
                  style={{ marginLeft: "12px", cursor: "pointer" }}
                  onClick={() => setShowChangeNameRoomModal(true)}
                />
              </div>
              <span
                className="header__description"
                style={isLightmode === false ? { color: "#ccc" } : null}
              >
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              {/* Render lần đầu sẽ là undefined, kế tiếp là mảng rỗng, cuối cùng mới có user */}
              <Avatar.Group size="small" maxCount={2}>
                {users_inRoom?.map((user) => (
                  <Tooltip title={user.displayName} key={user.uid}>
                    <Avatar src={user.photoURL} />
                  </Tooltip>
                ))}
              </Avatar.Group>
              {users_inRoom && users_inRoom.length > 0 && (
                <Button
                  icon={<UserAddOutlined />}
                  style={
                    isLightmode === false
                      ? {
                          border: "none",
                          backgroundColor: "transparent",
                          marginLeft: "10px",
                          color: "lightblue",
                        }
                      : {
                          border: "none",
                          backgroundColor: "transparent",
                          marginLeft: "10px",
                        }
                  }
                  onClick={() => setShowInviteModal(true)}
                >
                  Invite
                </Button>
              )}
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages_inRoom &&
                messages_inRoom.map((mes) => (
                  <Message
                    key={mes.id}
                    text={mes.text}
                    photoURL={mes.photoURL}
                    displayName={mes.displayName}
                    createdAt={mes.createdAt}
                    userid_inmess={mes.uid}
                  />
                ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  placeholder="Text some thing here"
                  bordered={false}
                  autoComplete="off"
                  spellCheck="false"
                  onChange={handleInputChange}
                  onPressEnter={handleSendMessage}
                  ref={inputRef}
                  style={isLightmode === false ? { color: "#fff" } : null}
                />
              </Form.Item>
              <Button type="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Choose one room, please"
          type="info"
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}

export default ChatWindow;
