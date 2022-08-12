import { Collapse, Typography } from "antd";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useCollection } from "../../../../hooks/useCollection";
import styled from "styled-components";
const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header {
      display: flex;
      cursor: pointer;
      user-select: none;
      margin-top: 20px;
      margin-left: 20px;
    }
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white !important;
  cursor: pointer;
  user-select: none;

  &:hover {
    filter: brightness(80%);
  }
`;

//? Room Object
// {
//   id
//   name,
//   description,
//   members:[uid1,uid2,...]
// }
function RoomList() {
  const { user, setShowRoomModal, setSelectedRoomID } = useAuthContext();
  const { document } = useCollection("rooms", [
    "members",
    "array-contains",
    user.uid,
  ]);
  const handleAddRoom = () => {
    setShowRoomModal(true);
  };
  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Room List" key="1">
        {document?.map((room) => (
          <LinkStyled key={room.id} onClick={() => setSelectedRoomID(room.id)}>
            {room.name}
          </LinkStyled>
        ))}
        <button className="add-room" onClick={handleAddRoom}>
          ✖️Add Room
        </button>
      </PanelStyled>
    </Collapse>
  );
}

export default RoomList;
