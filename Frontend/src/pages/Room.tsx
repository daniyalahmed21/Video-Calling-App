import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/SocketContext";
import { useUserMedia } from "../hooks/useUserMedia";
import UserFeedPlayer from "../components/userFeedPlayer"

const Room = () => {
  const { id } = useParams();
  const context = useContext(SocketContext);
  const { stream } = useUserMedia();
  if (!context) {
    throw new Error("Room must be used within a SocketProvider");
  }
  const { socket, userId } = context;

  useEffect(() => {
    if (!socket || !id || !userId) return;

    socket.emit("join-room", { roomId: id, userId: userId });

    const handleRoomJoined = (data: { roomId: string; userId: string }) => {
      console.log(`User ${data.userId} joined room ${data.roomId}`);
    };

    const fetchParticipants = (data: any) => {
      console.log(data);
    };

    socket.on("room-joined", handleRoomJoined);
    socket.on("get-users", fetchParticipants);
    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket, id, userId]);

  return (
    <div>
      Room {id}
      <UserFeedPlayer stream={stream}/>
    </div>
  );
};

export default Room;
