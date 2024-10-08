import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./Style.module.css";
import Form from "react-bootstrap/Form";

function Group() {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState([]);

  const handleSet = () => {
    setGroups((prev) => [...prev, name]);
    setName("");
  };

  const handleDelete = (indexToDelete) => {
    setGroups((prev) => prev.filter((_, index) => index !== indexToDelete)); // Remove the item at the given index
  };
  return (
    <>
      <div className={styles.mainBox}>
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
            <Button onClick={handleSet}>Create</Button>
          </div>
        </div>

        <div className={styles.scrollableList}>
          {groups.map((item, index) => (
            <ul key={index}>
              <li>{item} <Button onClick={()=>handleDelete(index)}>Delete</Button></li>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}

export default Group;
