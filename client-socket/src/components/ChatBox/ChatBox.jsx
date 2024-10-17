import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import { Socket } from "socket.io-client";
import styles from "./Style.module.css";

function ChatBox(props) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const { socket, profileName } = props;

  useEffect(() => {
    console.log("chat profileName", profileName);
    console.log("chat userCount", userCount);
  }, [profileName, userCount]);

  useEffect(() => {
    console.log("socketId in chat", socket.id);
    socket.on("userCount", (connectedUsers) => {
      setUserCount(connectedUsers);
    });

    socket.on("updateUserCount", (connectedUsers) => {
      setUserCount(connectedUsers);
    });

    socket.on("receiveMessage", (message) => {
      const newMessage = {
        sender: selectedUser.name, // Use the selected user's name as the sender
        message: message,
      };
      // Add the incoming message to the chat view only
      setChat((prev) => [...prev, newMessage]);
    });

    socket.on("alertMessage", (alertMessage) => {
      // alert(alertMessage);
      console.log(alertMessage);
    });

    socket.on("selectedPrivateUser", (user) => {
      debugger;
      console.log({ user });
      setSelectedUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
      socket.off("updateUserCount");
    };
  }, [socket, selectedUser]);

  const handleSend = () => {
    let privateId = selectedUser.id;
    debugger;
    if (!profileName) {
      alert("Please first enter your name");
      return; // Stop further execution if the profileName is not set
    }
    if (userCount <= 1) {
      alert("No other users to talk");
      return; // Stop further execution if the profileName is not set
    }

    if(!selectedUser.name){
      alert("Please select user first");
      return
    }
    if (message.trim()) {
      console.log({ privateId, message });
      // Emit the message to the server with recipient's privateId
      const newMessage = { sender: "You", message }; // Add sender as "You"

      // Add the message to the chat view immediately without waiting for the server response
      setChat((prev) => [...prev, newMessage]);

      // Emit the message to the server with recipient's privateId
      socket.emit("sendMessage", { message, privateId });

      setMessage("");
    }
  };

  return (
    <>
      <div className={styles.mainBox}>
        <div>
          <h4>Chat-Box</h4>
        </div>
        <div>
          {/* <h5>You are with "{selectedUser}"</h5> */}
          <h5>You are with "{selectedUser?.name || "No user selected"}"</h5>
        </div>
        <div className={styles.chatBoxParent}>
          <div className={styles.chatBox}>
            {chat.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "You" ? styles.myMessage : styles.otherMessage
                }
              >
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
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

export default ChatBox;
