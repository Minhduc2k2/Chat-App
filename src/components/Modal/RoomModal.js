import { Form, Input, Modal } from "antd";
import { addDocument } from "../../firebase/service";
import { useAuthContext } from "../../hooks/useAuthContext";
function RoomModal() {
  const { user, showRoomModal, setShowRoomModal } = useAuthContext();
  const [form] = Form.useForm();

  const handleOk = () => {
    addDocument("rooms", { ...form.getFieldsValue(), members: [user.uid] });
    form.resetFields();
    setShowRoomModal(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setShowRoomModal(false);
  };
  return (
    <Modal
      form={form}
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
      </Form>
    </Modal>
  );
}

export default RoomModal;
