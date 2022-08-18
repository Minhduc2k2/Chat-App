import Facebook from "../../assets/img/facebook.svg";
import Google from "../../assets/img/google.svg";
import firebase, { projectAuth, projectFirestore } from "../../firebase/config";
import { generateKeywords } from "../../firebase/service";
import "./Login.css";

const fbprovider = new firebase.auth.FacebookAuthProvider();

function Login() {
  const handleFbLogin = async () => {
    const { additionalUserInfo, user } = await projectAuth.signInWithPopup(
      fbprovider
    );
    // TODO: Khi la nguoi dung moi thi them vo FireStore
    if (additionalUserInfo?.isNewUser) {
      // addDocument("users", {
      //   displayName: user.displayName,
      //   email: user.email,
      //   uid: user.uid,
      //   photoURL: user.photoURL,
      //   online: true,
      //   providerId: additionalUserInfo.providerId,
      //   keywords: generateKeywords(user.displayName),
      // });
      projectFirestore
        .collection("users")
        .doc(user.uid)
        .set({
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          online: true,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.displayName),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } else {
      projectFirestore
        .collection("users")
        .doc(user.uid)
        .update({ online: true });
    }
  };

  return (
    <div className="loginform">
      <div className="flex-div">
        <div className="name-content">
          <h1 className="logo">Messenger</h1>
          <p>Connect with friends and the world around you</p>
        </div>
        <form className="form">
          <input type="text" placeholder="Email or Phone Number" required />
          <input type="password" placeholder="Password" required />
          <button className="login">Log In</button>
          <div className="social-group">
            <button className="social-button" onClick={handleFbLogin}>
              <span>Facebook</span>
              <img src={Facebook} alt="Facebook" />
            </button>
            <button className="social-button">
              <span>Google &nbsp;</span>
              <img src={Google} alt="Google" />
            </button>
          </div>
          {/* <a href="https://www.facebook.com/">Forgot Password ?</a> */}
          <hr />
          <button className="create-account">Create New Account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
