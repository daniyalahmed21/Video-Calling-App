import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const CreateRoom = () => {
  const {socket} = useContext(SocketContext); 

  const initRoom = () => {
    if (socket) {
      socket.emit("create-room");
    } else {
      console.error("Socket not connected. Cannot create room.");
    }
  };

  return <button onClick={initRoom}>Create a new room</button>;
};

export default CreateRoom;
