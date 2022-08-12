import { useEffect, useMemo, useState } from "react";
import { Form, Modal, Select, Spin, Avatar } from "antd";
import { debounce } from "lodash";
import { projectFirestore } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  currentMembers,
  ...props
}) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      fetchOptions(value, currentMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, currentMembers]);

  useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([]);
    };
  }, []);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

async function fetchUserList(search, currentMembers) {
  return projectFirestore
    .collection("users")
    .where("keywords", "array-contains", search.trim())
    .orderBy("displayName")
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !currentMembers.includes(opt.value));
    });
}

export default function InviteMemberModal() {
  const { showInviteModal, setShowInviteModal, selectedRoomID, selectedRoom } =
    useAuthContext();
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = async () => {
    //TODO: Update members in current room
    await projectFirestore
      .collection("rooms")
      .doc(selectedRoomID)
      .update({
        members: [...selectedRoom.members, ...value.map((v) => v.value)],
      });
    //TODO: reset form value
    form.resetFields();
    setValue([]);
    setShowInviteModal(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();
    setValue([]);
    setShowInviteModal(false);
  };

  return (
    <div>
      <Modal
        title="Invite Members"
        visible={showInviteModal}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            name="search-user"
            label="Members Name"
            value={value}
            placeholder="Enter member name"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            currentMembers={selectedRoom?.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
