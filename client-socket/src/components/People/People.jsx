import React, {useState, useEffect} from 'react'
import styles from './Style.module.css';

function People(props) {
  const {socket} = props;
  const [people, setPeople] = useState([])

  useEffect(()=>{
    socket.on("newUserName", (user) => {
      console.log(user); // user will have { name, id }
      setPeople((prev) => [...prev, user]); // Store the user object with name and id
    });

    socket.on("userLeftNotification", (disconnectedUser) => {
      // alert(${disconnectedUser} has disconnected);
      console.log(`${disconnectedUser} has disconnected`);
      setPeople((prev) => prev.filter((user) => user.name !== disconnectedUser)); // Compare by name
    });
    

     // Cleanup the socket listeners when the component unmounts
     return () => {
      socket.off("newUserName");
      socket.off("userLeftNotification");
    };
  },[socket])

  const handleUserSelect=(item)=>{
    debugger
    socket.emit("startPrivateChat", item)
  }
  return (
    <div className={styles.mainBox}>
        <h5>People</h5>
        <div>
        {people.map((user, index) => (
          <ul key={index}>
            <li onClick={() => handleUserSelect(user)}>{user.name}</li> {/* Render user name */}
          </ul>
        ))}
        </div>    
    </div>
  )
}

export default People  