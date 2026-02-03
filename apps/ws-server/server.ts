// server.ts
import {prismaClient} from "@repo/db/client";

const server = Bun.serve({
  port: 3002,
  async fetch(req, server) {
    const url = new URL(req.url);
    
    // HTTP endpoint to create user
    if (url.pathname === "/create-user" && req.method === "GET") {
      const createUser = await prismaClient.user.create({
        data: {
          username: Math.random().toString(),
          password: Math.random().toString(),
        }
      });
      
      return Response.json({
        message: "User created",
        user: createUser
      });
    }
    
    // WebSocket upgrade
    if (server.upgrade(req)) {
      return;
    }
    
    return new Response("WebSocket server running");
  },
  websocket: {
    async open(ws) {
      console.log("✅ Client connected");
      
      const createUser = await prismaClient.user.create({
        data: {
          username: Math.random().toString(),
          password: Math.random().toString(),
        }
      });

      ws.send(JSON.stringify(createUser));
    },
    message(ws, message) {
      console.log("📨 Received:", message);
      
      if (message === "ping") {
        ws.send("pong");
      }
    },
    close(ws) {
      console.log("❌ Client disconnected");
    },
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);