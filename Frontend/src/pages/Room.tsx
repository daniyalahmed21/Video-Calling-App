import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/SocketContext";

const Room = () => {
  const { id } = useParams();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("join-room", { roomId: id });

    const handleRoomJoined = (data: { roomId: string }) => {
      console.log(`Joined room: ${data.roomId}`);
    };

    socket.on("room-joined", handleRoomJoined);

    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket, id]);

  return <div>Room {id}</div>;
};

export default Room;
