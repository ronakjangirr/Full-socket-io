import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./Style.module.css";
import Form from "react-bootstrap/Form";

function Group({ sendGroupName, socket }) {
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // Track which group the user has joined

  const handleSet = () => {
    if (name.trim()) {
      socket.emit("newGroup", name);
      setName(""); // Clear input field after group creation
    }
  };

  useEffect(() => {
    socket.on("groupCreated", (groupList) => {
      console.log({ groupList });
      setRooms(groupList); // Update the group list
    });

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      socket.off("groupCreated");
    };
  }, [socket, rooms]); // Add `socket` as the dependency

  const handleDelete = (deleteSelectedGroup) => {
    console.log({ deleteSelectedGroup });
    socket.emit("deleteGroup", deleteSelectedGroup);
    if (selectedGroup?.id === deleteSelectedGroup) {
      setSelectedGroup(null); // Clear the selected group
      sendGroupName(null); // Also inform the parent component to clear the GroupChat
    }
  };

  const handleSelectGroup = (roomName, roomId) => {
    const group = { name: roomName, id: roomId };
    setSelectedGroup(group); // Send the whole group object to the parent
    sendGroupName(group);
  };

  console.log({selectedGroup})

  const handleJoin = (roomName, roomId) => {
    // if (selectedGroup?.id === roomId) {
    //   alert(`You are already in this Room: ${roomName}`);
    // } else {
      debugger
      socket.emit("joinGroup", { id: roomId, roomName });

    //   handleSelectGroup(roomName, roomId); // Update selected group
    // }
  };

  const handleLeave = (roomId) => {
    if (selectedGroup === roomId) {
      socket.emit("leaveRoom", roomId);
      setSelectedGroup(null); // Clear the selected group
      alert(`Left Room: ${rooms.find((room) => room.id === roomId).name}`);
    } else {
      alert("You are not part of this Room");
    }
  };

  return (
    <>
      <div className={styles.mainBox}>
        <h5>Group</h5>
        <div className={styles.childFirst}>
          <div>
            <Form.Control
              type="text"
              placeholder="Create a Group"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update the input value
            />
          </div>

          <div>
            <Button onClick={handleSet}>Create</Button>
          </div>
        </div>

        <div className={styles.scrollableList}>
          {rooms.length === 0 ? (
            <p>No group created</p>
          ) : (
            rooms.map((room) => (
              <ul key={room.id}>
                <li>
                  {room.name}
                  <Button onClick={() => handleSelectGroup(room.name, room.id)}>
                    Select
                  </Button>
                  <Button onClick={() => handleJoin(room.name, room.id)}>
                    Join
                  </Button>
                  <Button onClick={() => handleLeave(room.id)}>X</Button>
                  <Button onClick={() => handleDelete(room.id)}>Delete</Button>
                </li>
              </ul>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Group;
