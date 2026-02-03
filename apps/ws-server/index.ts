// import {prismaClient} from "@repo/db/client";

// const ws = new WebSocket("ws://localhost:3002");

// ws.onopen = async () => {
//     console.log("connected to server");

//     const createUser = await prismaClient.user.create({
//         data:{
//             username: Math.random().toString(),
//             password: Math.random().toString(),
//         }
//     })

//     ws.send("Hello from client");
//     ws.send(JSON.stringify(createUser));

// };


// ws.onmessage = (event) => {
//     const message = event.data;

//     if(message === "ping"){
//         ws.send("pong")
//     }
    
//     console.log("Hey thankyou for messaging")
// }

// ws.onclose = () => {
//     console.log("Disconnected from server");
// };

// ws.onerror = (error) => {
//     console.error("WebSocket error:", error);
// };