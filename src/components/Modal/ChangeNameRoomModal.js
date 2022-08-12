import { Form, Input, Modal, Typography } from "antd";
import { useState } from "react";
import { updateDocument } from "../../firebase/service";
import { useAuthContext } from "../../hooks/useAuthContext";

function ChangeNameRoomModal() {
  const {
    selectedRoomID,
    showShowChangeNameRoomModal,
    setShowChangeNameRoomModal,
  } = useAuthContext();
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleOk = () => {
    setError("");
    if (!form.getFieldValue("name") || !form.getFieldValue("description")) {
      setError("Empty Field!");
      return;
    }
    updateDocument("rooms", { ...form.getFieldsValue() }, selectedRoomID);
    form.resetFields();
    setShowChangeNameRoomModal(false);
  };
  const handleCancel = () => {
    setError("");
    form.resetFields();
    setShowChangeNameRoomModal(false);
  };
  return (
    <Modal
      title="Change Room Name"
      visible={showShowChangeNameRoomModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>

        <Typography.Text style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </Typography.Text>
      </Form>
    </Modal>
  );
}

export default ChangeNameRoomModal;
