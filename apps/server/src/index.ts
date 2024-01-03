import express, { Express, Request, Response } from "express";
import http from "http";
import SocketService from "./services/socket";

const socketService = new SocketService();
const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    res.send("Hello from server");
});

socketService.initListner();  // Initialize listeners first

socketService.io.attach(server);  // Attach Socket.IO to the server

server.listen(port, () => {
    console.log(`[server]:server is running at port ${port}`);
});
