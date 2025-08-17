import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import IRoomParams from "../interfaces/iRoomParams";

// Keep rooms as a shared in-memory map
const rooms: Record<string, string[]> = {};

const RoomHandler = (socket: Socket) => {

  // Create a new room
  const handleCreateRoom = () => {
    const roomId = uuidv4();
    rooms[roomId] = [];             
    socket.join(roomId);            
    socket.emit("room-created", { roomId });
    console.log(`Room created with id ${roomId}`);
  };

  // Join an existing room
  const handleJoinRoom = ({ roomId, userId }: IRoomParams) => {
    if (!rooms[roomId]) {
      console.warn(`Room ${roomId} does not exist`);
      return;
    }

    if (!rooms[roomId].includes(userId)) {
      rooms[roomId].push(userId);
      socket.join(roomId);
      socket.emit("get-users",rooms)
      console.log(`User ${userId} joined room ${roomId}`);
      socket.emit("room-joined", { roomId, userId });
    }
  };

  socket.on("create-room", handleCreateRoom);
  socket.on("join-room", handleJoinRoom);
};

export default RoomHandler;
