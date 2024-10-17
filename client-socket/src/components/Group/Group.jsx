import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./Style.module.css";
import Form from "react-bootstrap/Form";

function Group({ sendGroupName, socket }) {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState([]);

  const handleSet = () => {
    if (name.trim()) {
      socket.emit("newGroup", name);
      setName(""); // Clear input field after group creation
    }
  };

  useEffect(() => {
    socket.on("groupCreated", (groupList) => {
      console.log(groupList);
      setGroups(groupList); // Update the group list
    });

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      socket.off("groupCreated");
    };
  }, [socket]); // Add `socket` as the dependency

  const handleDelete = (deleteSelectedGroup) => {
      console.log(deleteSelectedGroup)

      socket.emit("deleteGroup", deleteSelectedGroup)

      // setGroups((prev) => prev.filter((_, index) => index !== indexToDelete)); // Remove the item at the given index
  };

  const handleSelectGroup = (groupName) => {
    debugger
    sendGroupName(groupName);
  };

  const handleJoin=()=>{

  }

  const handleLeave=()=>{

  }
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
          {groups.length === 0 ? (
            <p>No group created</p>
          ) : (
            groups.map((group) => (
              <ul key={group.id}>
                <li onClick={() => handleSelectGroup(group.name)}>
                  {group.name}
                  <Button onClick={handleJoin}>Join</Button>
                  <Button onClick={handleLeave}>X</Button>
                  <Button onClick={() => handleDelete(group.id)}>Delete</Button>
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
