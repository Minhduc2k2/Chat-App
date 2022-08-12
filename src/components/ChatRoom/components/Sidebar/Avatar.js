import "./Avatar.css";

function Avatar({ src }) {
  return (
    <div className="avatar">
      <img src={src} alt="User Avatar" />
    </div>
  );
}

export default Avatar;
