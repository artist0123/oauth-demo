import "./App.css";
import { useState, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "300px",
    height: "200px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
};

const clientId =
  "672012102057-m7sa35vejdb466i9iof1051pej4vo4a0.apps.googleusercontent.com";

Modal.setAppElement(document.getElementById("root"));

function App() {
  const [token, setTokenObj] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logo, setLogo] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/userinfo.profile",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const onSuccess = async (res) => {
    const prf = await res.profileObj;
    console.log("success:", res);
    setProfile(prf);
    setLogo(prf.imageUrl);
    setName(prf.name);
    setEmail(prf.email);
    setTokenObj(res.tokenObj);
  };
  const onFailure = (err) => {
    console.log("failed:", err);
  };

  const logOut = () => {
    setProfile(null);
    setLogo("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    setName("");
    setEmail("");
    setTokenObj(null);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!profile ? (
          <div>
            <p>Please login to see your profile :D</p>
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          </div>
        ) : (
          <div>
            <Modal
              shouldCloseOnOverlayClick={true}
              shouldCloseOnEsc={true}
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyles}
            >
              <button onClick={closeModal}>close</button>
              <h6>
                access_token: <code>{token.access_token}</code>
              </h6>
              <h6>
                scope: <code>{token.scope}</code>
              </h6>
              <h6>See more data in console</h6>
            </Modal>
            <h3>
              Hello <span>{name}</span>
            </h3>
            <h5>{email}</h5>
            <button
              style={{
                backgroundColor: "transparent",
                border: "0",
                textDecoration: "underline",
              }}
              onClick={openModal}
              className="App-link"
              target="_blank"
            >
              Show OAuth Data
            </button>
            <div style={{ marginTop: "2rem" }}>
              <GoogleLogout
                clientId={clientId}
                buttonText="Log Out"
                onLogoutSuccess={logOut}
              />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
