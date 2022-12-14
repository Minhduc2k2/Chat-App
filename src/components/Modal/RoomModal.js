import { Form, Input, Modal, Typography } from "antd";
import { useState } from "react";
import { addDocument } from "../../firebase/service";
import { useAuthContext } from "../../hooks/useAuthContext";
function RoomModal() {
  const { user, showRoomModal, setShowRoomModal } = useAuthContext();
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const handleOk = () => {
    setError("");
    if (!form.getFieldValue("name") || !form.getFieldValue("description")) {
      setError("Empty Field!");
      return;
    }
    addDocument("rooms", { ...form.getFieldsValue(), members: [user.uid] });
    form.resetFields();
    setShowRoomModal(false);
  };
  const handleCancel = () => {
    setError("");
    form.resetFields();
    setShowRoomModal(false);
  };
  return (
    <Modal
      title="Create Room"
      visible={showRoomModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name">
          <Input placeholder="Enter Room Name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Enter Room Description" />
        </Form.Item>
        <Typography.Text style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </Typography.Text>
      </Form>
    </Modal>
  );
}

export default RoomModal;
