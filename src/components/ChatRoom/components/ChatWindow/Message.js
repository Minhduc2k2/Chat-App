import { Avatar, Typography } from "antd";
import styled from "styled-components";
import { formatRelative } from "date-fns/esm";
import { useAuthContext } from "../../../../hooks/useAuthContext";

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }
  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }
  .content {
    margin-left: 30px;
    display: inline-block;
    white-space: initial;
    width: 500px;
    padding: 12px;
    border-radius: 18px;
  }
`;

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  userid_inmess,
}) {
  const { user, isLightmode } = useAuthContext();
  return (
    <WrapperStyled
      style={user.uid === userid_inmess ? { textAlign: "right" } : null}
    >
      <div>
        {user.uid !== userid_inmess && (
          <>
            <Avatar size="small" src={photoURL}>
              {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography.Text
              className="author"
              style={isLightmode === false ? { color: "#fff" } : null}
            >
              {displayName}
            </Typography.Text>
          </>
        )}
        <Typography.Text className="date">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text
          className="content"
          style={
            user.uid === userid_inmess
              ? { textAlign: "left", backgroundColor: "#fc3d63", color: "#fff" }
              : { backgroundColor: "#e4e6eb" }
          }
        >
          {text}
        </Typography.Text>
      </div>
    </WrapperStyled>
  );
}
