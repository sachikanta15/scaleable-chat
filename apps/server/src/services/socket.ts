import { Server } from "socket.io";

import { Redis } from "ioredis";

//in redis we neeed to component that is one publisher and one is subscriber and there we need to pass the url in it for redis where it is spin up 
const pub = new Redis({
    host: 'redis-3aa55844-sachikantaraul9692-bf7d.a.aivencloud.com',
    port: 12096,
    username: 'default',
    password: 'AVNS_JB1bomkYCasCw1jeDzj'
});
const sub = new Redis({
    host: 'redis-3aa55844-sachikantaraul9692-bf7d.a.aivencloud.com',
    port: 12096,
    username: 'default',
    password: 'AVNS_JB1bomkYCasCw1jeDzj'
});



class SocketService {
    private _io: Server;

    constructor() {
        console.log("Initializing Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe('MESSAGES')  //subscribeing to this channel so that when ever any new msg comes it can pull the data
    }

    public initListner() {
        const io = this._io;
        console.log('Initializing Socket Listeners...');

        io.on("connection", (socket) => {
            console.log(`New Socket Connected: ${socket.id}`);

            // Additional logging for disconnect event
            socket.on("disconnect", () => {
                console.log(`Socket Disconnected: ${socket.id}`);
            });

            // Event listener for custom "event:message"
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log(`New Message Received from ${socket.id}: ${message}`);
                // publish this message to redis through MESSAGE channel
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });
        //this under peice of code will responsiable for emiting the message to the client when ever there is any new message
        sub.on("message", (channel, message) => {
            if (channel === 'MESSAGES') {
                io.emit("message", message)
            }
        })

        // Additional logging for server-side errors
        io.on("error", (error) => {
            console.error("Socket.IO Server Error:", error);
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
