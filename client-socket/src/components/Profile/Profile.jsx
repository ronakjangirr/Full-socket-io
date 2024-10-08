import React, { useState } from "react";
import styles from "../Profile/Style.module.css";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

function Profile() {
    const [name, setName] = useState(""); // To hold the input value
    const [displayName, setDisplayName] = useState(""); // To display the name
  
    const handleSubmit = () => {
      setDisplayName(name); // Set the display name when the button is clicked
      setName("")
    };

  return (
    <div className={styles.mainBox}>

      <Form.Label>{displayName ? `Hello, ${displayName}` : "Set Your Name"}</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update the input value
      />      
      <Button onClick={handleSubmit}>Done</Button>
    </div>
  );
}

export default Profile;
