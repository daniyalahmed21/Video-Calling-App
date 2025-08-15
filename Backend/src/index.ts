import express from "express";
import serverConfig from "./config/serverConfig";
import http from "http";
import { Server } from "socket.io";
import cors from "cors"
const app = express();

const server = http.createServer(app);

app.use(cors())
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Server connected");
  socket.on("disconnect", () => {
    console.log("Server disconnected");
  });
});

app.listen(serverConfig.PORT, () => {
  console.log(`Server running at Port ${serverConfig.PORT}`);
});
