import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Button, Form, Container, Row, Col, ListGroup } from "react-bootstrap";
import { io } from "socket.io-client";

function App() {
  // Memoize the socket connection so it only happens once. To optimize the socket connection in your React component, you can use the useMemo hook to ensure the socket instance is only created once, avoiding unnecessary re-connections each time the component re-renders.
  // Socket.IO Connection: The useMemo hook is used to ensure that the socket connection is established only once, preventing re-connections on every render.
  // The server URL is "http://localhost:8080", which means the app connects to a server running on localhost at port 8080.
  const socket = useMemo(() => io("http://localhost:8080"), []); // when you send the message it will "user connected id-123" the your message "Hello" then again "user connected id-124" so in this user is disconnect and build id again. so to stop this and wants to see the message like hi, hello, good we use useMemo. so it will only create new connection when we refresh the page again.

  const [socketID, setSocketId] = useState("");     // socketID: Stores the unique socket ID assigned by the server when a user connects.
  const [message, setMessage] = useState("");       // message: Stores the message input from the user.
  const [listMessages, setListMessages] = useState([]); // listMessages: An array to store all received messages.
  const [room, setRoom] = useState("");                 // room: Represents the room name to which the message will be sent.
  const [roomName, setRoomName] = useState("");         // roomName: Represents the room the user is trying to join.


  // When the component mounts, the socket listens for various events like:
  useEffect(() => {
    // "connect": connect is pre-defined keyword. This event triggers when the socket successfully connects to the server, setting the socketID.
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("socket connected successfully", socket.id);
    });

    // "welcome": Logs any welcome message sent from the server (could be a greeting or acknowledgment). welcome is also predefined it is listing the emit event which is comes from backend.
    socket.on("welcome", (message) => {
      console.log(message);
    });

    // The server can broadcast a message to all connected clients except the one that sent the message by using socket.broadcast.emit(...).
    // In the client-side code, if this event is uncommented, it will log any broadcastMessage received from the server to the console.
    // socket.on("broadcast",(broadcastMessage)=>{       // Example- 1
    //   console.log(broadcastMessage)
    // })


    // This event logs messages that are emitted from the server to all connected clients, including the one that sent the message.
    // socket.on("io-to-all",(data)=>{             // Example- 1
    //   console.log(data)
    // })

    // Example- 2 -  "io-to-except-sender": Logs messages that are broadcast to everyone except the sender.
    socket.on("io-to-except-sender", (data) => {
      console.log(data);
    });

    // "receive-message": Updates the listMessages state when a message is received, appending it to the current list of messages.
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
    setRoom(e.target.value); // Update room name state
  };

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value); // Update room name state
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // socket.emit("sendMessage", message); // Example - 1 Emit the message to the server

      socket.emit("sendMessage", { message, room }); // Example - 2 Emit the message to the server with particular roomName
      // console.log("Message sent:", message);
      setMessage(""); // Clear the input after sending
    }
  };

  const handleJoinRoom=(e)=>{
    e.preventDefault();

    // Users can join a specific room by emitting the join-room event with the roomName. After joining, the room name input is cleared.
    socket.emit("join-room", roomName);
    setRoomName("");
  }
  return (
    <>
      {/* <Button>Jai Bajrang Bali</Button> */}
      <Container>
        <h4>Your Unique Room Id - {socketID}</h4>
        <Form onSubmit={handleJoinRoom}>
              <Form.Group controlId="formMessage">
                <Form.Label>Room Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your message"
                  value={roomName}
                  onChange={handleRoomNameChange}
                />
              </Form.Group>
              <Button className="mt-3" variant="primary" type="submit" block>
                Join
              </Button>
            </Form>
            {/* //===========================// */}
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
                <Form.Label>Room</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your message"
                  value={room}
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
