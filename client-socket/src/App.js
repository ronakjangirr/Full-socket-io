import React, { useState, useEffect, useMemo } from "react";
import styles from './Style.module.css';
import { Button, Form, Container, Row, Col, ListGroup } from "react-bootstrap";
import { io } from "socket.io-client";
import Profile from "./components/Profile/Profile";
import Group from "./components/Group/Group";
import People from "./components/People/People";

function App() {
 
  return (
    <>
    {/* <h1>Jai Bajrang Bali</h1> */}
    <div className={styles.boxSize}>
    <Profile/>
    <Group/>
    <People/>
    </div> 
    </>
  );
}

export default App;
