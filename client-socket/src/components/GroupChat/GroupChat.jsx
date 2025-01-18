import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import { Socket } from "socket.io-client";
import styles from "./Style.module.css";

function GroupChat(props) {
  const { selectedGroup, profileName, socket } = props;
  const [roomChat, setRoomChat] = useState([]);
  const [roomChatMsg, setRoomChatMsg] = useState("");

  const handleSend = () => {
    let userRoomMessage = {
      roomId: selectedGroup.id,
      roomName: selectedGroup.name,
      userName: profileName,
      userMessage: roomChatMsg,
    };
    socket.emit("roomChat", userRoomMessage);
    setRoomChatMsg('')
  };

  useEffect(() => {
    // Listener for incoming room messages
    socket.on("myRoomChat", (selectedRoomMsg) => {
      console.log("Received chats:", selectedRoomMsg);
    // Only append the latest message
    if (selectedRoomMsg.length > 0) {
      setRoomChat(selectedRoomMsg);

    }else{
      setRoomChat(selectedRoomMsg)
    }
    });

    return () => {
      socket.off("myRoomChat"); // Clean up on unmount
    };
  }, [socket]);

  console.log({ roomChat });

  return (
    <>
      <div className={styles.mainBox}>
        <div>
          <h4>Group Chat</h4>
        </div>
        <div>
          <h5>Group Name:{selectedGroup.name} </h5>
        </div>
        <div className={styles.chatBoxParent}>
          <div className={styles.chatBox}>
            {roomChat.map((msg, index) => (
              <ul key={index}>
                <li>
                  <strong>{msg.userName}</strong>: {msg.message}
                </li>
              </ul>
            ))}
          </div>
        </div>

        <div className={styles.msgBox}>
          <div className={styles.inputBox}>
            <Form.Control
              type="text"
              placeholder="Send Your Message"
              value={roomChatMsg}
              onChange={(e) => setRoomChatMsg(e.target.value)}
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
