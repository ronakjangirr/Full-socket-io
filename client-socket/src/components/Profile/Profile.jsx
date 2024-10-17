import React, { useState } from "react";
import styles from "../Profile/Style.module.css";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

function Profile({socket, sendProfile}) {
  // const {socket} =props;
  const [name, setName] = useState(""); // To hold the input value
  const [displayName, setDisplayName] = useState(""); // To display the name

  const handleSubmit = () => {
    setDisplayName(name); // Set the display name when the button is clicked
    sendProfile(name)
    socket.emit("userName", name);
    setName("");
  };

  return (
    <div className={styles.mainBox}>
      <h5>
        {displayName ? `Hello, ${displayName}` : "Set Your Name"}
      </h5>
      <div className={styles.childFirst}>
        <div>
          <Form.Control
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update the input value
          />
        </div>
        <div>
          <Button onClick={handleSubmit}>Done</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
