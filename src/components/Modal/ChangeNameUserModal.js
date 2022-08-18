import { Form, Input, Modal, Typography, Avatar } from "antd";
import { useState } from "react";
import { updateDocument } from "../../firebase/service";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

function ChangeNameUserModal() {
  const {
    user,
    selectedUser,
    selectedNickNameID,
    showChangeNameUserModal,
    setShowChangeNameUserModal,
  } = useAuthContext();
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleOk = () => {
    setError("");
    if (
      !form.getFieldValue("displayName_B") ||
      !form.getFieldValue("displayName_A")
    ) {
      setError("Empty Field!");
      return;
    }
    updateDocument(
      "nicknames",
      { ...form.getFieldsValue() },
      selectedNickNameID
    );
    setShowChangeNameUserModal(false);
    form.resetFields();
  };
  const handleCancel = () => {
    setError("");
    setShowChangeNameUserModal(false);
    form.resetFields();
  };
  const { document: nicknames } = useCollection("nicknames");
  const nicknames_withUser = nicknames?.find(
    (nickname) =>
      (user?.uid === nickname.uid_A || user?.uid === nickname.uid_B) &&
      (selectedUser?.uid === nickname.uid_A ||
        selectedUser?.uid === nickname.uid_B)
  );

  return (
    <Modal
      title="Set User Nickname"
      visible={showChangeNameUserModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="vertical" form={form}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={selectedUser?.photoURL} style={{ marginRight: "4px" }} />
          <Form.Item
            label={selectedUser?.displayName}
            //   name="displayName_B"
            name={
              nicknames_withUser?.uid_A === user?.uid
                ? "displayName_B"
                : "displayName_A"
            }
            initialValue={
              nicknames_withUser?.uid_A === user?.uid
                ? nicknames_withUser?.displayName_B
                : nicknames_withUser?.displayName_A
            }
          >
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user?.photoURL} style={{ marginRight: "4px" }} />
          <Form.Item
            label={user?.displayName}
            name={
              nicknames_withUser?.uid_A === user?.uid
                ? "displayName_A"
                : "displayName_B"
            }
            initialValue={
              nicknames_withUser?.uid_A === user?.uid
                ? nicknames_withUser?.displayName_A
                : nicknames_withUser?.displayName_B
            }
          >
            <Input />
          </Form.Item>
        </div>

        <Typography.Text style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </Typography.Text>
      </Form>
    </Modal>
  );
}

export default ChangeNameUserModal;
