
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { IRoomParams } from "../interfaces/iRoomParams";
import { ICallParams } from "../interfaces/ICallParams";

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
      // Optional: Emit an error to the client
      socket.emit('room-not-found', { roomId });
      return;
    }

    // A user might rejoin, but we only want to handle them as a new user if they're not already in the room list
    if (!rooms[roomId].includes(userId)) {
      // Get all existing users in the room
      const existingUsers = rooms[roomId];
      
      // Add the new user to the room list
      rooms[roomId].push(userId);
      socket.join(roomId);

      // Tell the NEWLY JOINED user who is ALREADY in the room
      socket.emit("get-users", { roomId, participants: existingUsers, userId });

      // Broadcast to ALL OTHER users in the room that a NEW user has joined
      socket.to(roomId).emit("user-joined", { roomId, userId });

      console.log(`User ${userId} joined room ${roomId}`);
    }
  };

  // Handle WebRTC signaling data
  const handleSignal = ({ to, from, signal }: ICallParams) => {
    // Forward the signal to the intended recipient
    socket.to(to).emit("signal", { from, signal });
    console.log(`Signal from ${from} forwarded to ${to}`);
  };

  // Handle a user leaving a room
  const handleDisconnect = () => {
    // Find the room the user was in
    for (const roomId in rooms) {
      const userIndex = rooms[roomId].indexOf(socket.id);
      if (userIndex !== -1) {
        // Remove the user from the room list
        rooms[roomId].splice(userIndex, 1);
        console.log(`User ${socket.id} left room ${roomId}`);
        // Broadcast to all other users that this user has left
        socket.to(roomId).emit('user-disconnected', { userId: socket.id });
        break; // Stop after finding the user
      }
    }
  };

  socket.on("create-room", handleCreateRoom);
  socket.on("join-room", handleJoinRoom);
  socket.on("signal", handleSignal);
  socket.on("disconnect", handleDisconnect);
};

export default RoomHandler;