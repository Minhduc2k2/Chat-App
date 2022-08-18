import { Button, Form, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Pen from "../../../../assets/img/pen.svg";
import { addDocument } from "../../../../firebase/service";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import Avatar from "../Sidebar/Avatar";
import Message from "./Message";

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

function ChatUser() {
  const {
    user,
    selectedUser,
    setSelectedNickNameID,
    setShowChangeNameUserModal,
    isLightmode,
  } = useAuthContext();
  const [inputValue, setInputValue] = useState("");
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const [form] = Form.useForm();

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
      uid_receive: selectedUser.uid,
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
  const messages_withUser = messages?.filter(
    (message) =>
      (user.uid === message.uid || user.uid === message.uid_receive) &&
      (selectedUser?.uid === message.uid ||
        selectedUser?.uid === message.uid_receive)
  );

  //TODO: Get nicknames form collection
  const { document: nicknames } = useCollection("nicknames");
  const nicknames_withUser = nicknames?.find(
    (nickname) =>
      (user.uid === nickname.uid_A || user.uid === nickname.uid_B) &&
      (selectedUser?.uid === nickname.uid_A ||
        selectedUser?.uid === nickname.uid_B)
  );

  //TODO: Set SelectedNickName ID

  setSelectedNickNameID(nicknames_withUser?.id);

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
    <div style={{ height: "100vh", width: "100%" }}>
      {selectedUser ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  userSelect: "none",
                }}
              >
                <Avatar src={selectedUser.photoURL} />
                <span
                  className="header__title"
                  style={isLightmode === false ? { color: "#fff" } : null}
                >
                  {nicknames_withUser?.uid_A === user.uid
                    ? nicknames_withUser?.displayName_B
                    : nicknames_withUser?.displayName_A}
                </span>
                <img
                  src={Pen}
                  alt="Pen"
                  style={
                    isLightmode === false
                      ? {
                          filter: "invert(100%)",
                          marginLeft: "12px",
                          cursor: "pointer",
                        }
                      : { marginLeft: "12px", cursor: "pointer" }
                  }
                  onClick={() => {
                    setShowChangeNameUserModal(true);
                  }}
                />
              </div>
            </div>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages_withUser &&
                messages_withUser.map((mes) => (
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
      ) : null}
    </div>
  );
}

export default ChatUser;
