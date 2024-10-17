import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import { Socket } from "socket.io-client";
import styles from "./Style.module.css";

function GroupChat(props) {
    const {selectedGroup}= props;
    const [groupChat, setGroupChat] = useState([]);
    const [message, setMessage] = useState('');

    const handleSend=()=>{

    }
  return (
    <>
      <div className={styles.mainBox}>
        <div>
          <h4>Group Chat</h4>
        </div>
        <div>
          <h5>Group Name:{selectedGroup} </h5>
        </div>
        <div className={styles.chatBoxParent}>
          <div className={styles.chatBox}>
            {groupChat.map((msg, index) => (
              <ul>
                  <li>{msg}</li>
              </ul>
            ))}
          </div>
        </div>

        <div className={styles.msgBox}>
          <div className={styles.inputBox}>
            <Form.Control
              type="text"
              placeholder="Send Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupChat;
