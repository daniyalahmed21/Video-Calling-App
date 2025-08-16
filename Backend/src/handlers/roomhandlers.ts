import { Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid';

const RoomHandler = (socket:Socket ) =>{
    const createRoom = () =>{
        const roomId = uuidv4(); 
        socket.join(roomId)
        socket.emit('room-created',{roomId})
        console.log(`Room created with id ${roomId}`)
    }

    const joinRoom = ({roomId}:{roomId:string}) => {
        console.log("Room joined",roomId)
    }

    socket.on("create-room",createRoom)
    socket.on("join-room",joinRoom)
}

export default RoomHandler