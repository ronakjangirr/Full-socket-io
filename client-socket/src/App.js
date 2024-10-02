import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Button, Form, Container, Row, Col, ListGroup } from "react-bootstrap";
import { io } from "socket.io-client";

function App() {
  // Memoize the socket connection so it only happens once. To optimize the socket connection in your React component, you can use the useMemo hook to ensure the socket instance is only created once, avoiding unnecessary re-connections each time the component re-renders.
  const socket = useMemo(() => io("http://localhost:8080"), []); // when you send the message it will "user connected id-123" the your message "Hello" then again "user connected id-124" so in this user is disconnect and build id again. so to stop this and wants to see the message like hi, hello, good we use useMemo. so it will only create new connection when we refresh the page again.
  const [socketID, setSocketId] = useState("");
  const [message, setMessage] = useState(""); // State to hold the message input
  const [listMessages, setListMessages] = useState([]); // State to hold the message input
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      // connect is pre-defined keyword
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (message) => {
      // welcome is also predefined it is listing the emit event which is comes from backend.
      console.log(message);
    });

    // socket.on("broadcast",(broadcastMessage)=>{       // Example- 1
    //   console.log(broadcastMessage)
    // })

    // socket.on("io-to-all",(data)=>{             // Example- 1
    //   console.log(data)
    // })

    socket.on("io-to-except-sender", (data) => {
      // Example- 2
      console.log(data);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setListMessages((listMessages) => [...listMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update message state
  };

  const handleRoomChange = (e) => {
    setRoomName(e.target.value); // Update room name state
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // socket.emit("sendMessage", message); // Example - 1 Emit the message to the server

      socket.emit("sendMessage", { message, roomName }); // Example - 2 Emit the message to the server with particular roomName
      // console.log("Message sent:", message);
      setMessage(""); // Clear the input after sending
    }
  };
  return (
    <>
      <Button>Jai Bajrang Bali</Button>
      <Container>
        <h4>Your Unique Room Id - {socketID}</h4>
        <Row className="justify-content-md-center mt-5">
          <Col md={6}>
            <h1 className="text-center mb-4">Send a Message</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your message"
                  value={message}
                  onChange={handleMessageChange}
                />
              </Form.Group>
              <Form.Group controlId="formMessage">
                <Form.Label>Room Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your message"
                  value={roomName}
                  onChange={handleRoomChange}
                />
              </Form.Group>
              <Button className="mt-3" variant="primary" type="submit" block>
                Send Message
              </Button>
            </Form>

            <h2 className="mt-5">Messages:</h2>
            <ListGroup>
              {listMessages.map((msg, index) => (
                <ListGroup.Item key={index}>{msg.message}</ListGroup.Item> // Display each message
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
