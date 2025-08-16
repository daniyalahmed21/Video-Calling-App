import { Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';

const RoomHandler = (socket:Socket ) =>{
    const createRoom = () =>{
        const roomId = uuidv4(); 
        socket.join(roomId)
        socket.emit('room-created',{roomId})
        console.log(`Room created with id ${roomId}`)
    }

    const joinRoom = ({roomId,userId}:{roomId:string,userId:string}) => {
        console.log(`user joined with roomId ${roomId} and userId ${userId}`)
    }

    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}

export default RoomHandler