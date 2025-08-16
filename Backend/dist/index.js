"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverConfig_1 = __importDefault(require("./config/serverConfig"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const roomhandlers_1 = __importDefault(require("./handlers/roomhandlers"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("A client has connected.");
    (0, roomhandlers_1.default)(socket);
    socket.on("disconnect", () => {
        console.log("A client has disconnected.");
    });
});
server.listen(serverConfig_1.default.PORT, () => {
    console.log(`Server running at Port ${serverConfig_1.default.PORT}`);
});
