import React, { useState, useEffect, useMemo } from "react";
import styles from "./Style.module.css";
import { io } from "socket.io-client";
import Profile from "./components/Profile/Profile";
import Group from "./components/Group/Group";
import People from "./components/People/People";
import ChatBox from "./components/ChatBox/ChatBox";
import GroupChat from "./components/GroupChat/GroupChat";

function App() {
  const socket = useMemo(() => io("http://localhost:8080"), []);
  const [profileName, setProfileName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  // Note - We can't use "socket.to(room).emit("sendMessage", message)" from client side it is only send by server side only.

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Socket id ${socket.id}`);
      console.log("Socket Connected");
    });

    socket.on("newUserName", (name) => {
      const newUserAlert = `${name.name} has joined the chat`;
      // alert(newUserAlert);
      console.log({ newUserAlert });
    });
    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleEmitName = (name) => {
    console.log("App name", name);
    setProfileName(name);
  };

  const handleGroupName = (group) => {
    console.log({ group });
    setSelectedGroup(group);
  };

  useEffect(() => {
    console.log({ selectedGroup });
  }, [selectedGroup]);
  return (
    <>
      {/* <h1>Jai Bajrang Bali</h1> */}
      <div className={styles.boxSize}>
        <div>
          <Profile socket={socket} sendProfile={handleEmitName} />
          <Group sendGroupName={handleGroupName} socket={socket} />
          <People socket={socket} />
        </div>
        <div>
          <ChatBox socket={socket} profileName={profileName} />
        </div>
        <div>
          {selectedGroup && (
            <GroupChat socket={socket} selectedGroup={selectedGroup} profileName={profileName}/>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
