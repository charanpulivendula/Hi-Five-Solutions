# Dashboard WebSocket Project

## Overview
This project is a real-time cricket dashboard simulation using WebSockets with **React (frontend)** and **Node.js (backend)**, powered by **Socket.IO**. The frontend displays the  score and wickets status in real time, while the backend simulates dynamic cricket data and emits updates to connected clients.

---

https://github.com/user-attachments/assets/ff0b41cc-207a-4b49-8c80-4bd6437b8b2b




## 1. How WebSockets Work

### WebSockets provide full-duplex communication between a client and a server.
- Unlike HTTP, WebSockets maintain a persistent connection, allowing real-time data exchange.
- A WebSocket connection is initiated by an HTTP handshake, then upgraded to a TCP-based connection.
- The server can push updates to the client without requiring the client to request data repeatedly.
- Data is exchanged using **frames**, reducing overhead compared to HTTP polling or long polling.

### Steps in a WebSocket Connection:
1. The client requests an upgrade from HTTP to WebSocket via a **handshake**.
2. If the server accepts, the protocol is switched from HTTP to WebSocket.
3. The persistent WebSocket connection is established.
4. Both client and server can now send and receive messages asynchronously.
5. The connection remains open until explicitly closed by either party.

---

## 2. Advantages of Socket.IO Over WebSockets

**Socket.IO** is a library built on top of WebSockets, providing additional features:
- **Automatic Reconnection:** Handles connection drops and attempts reconnections automatically.
- **Fallback Mechanisms:** If WebSockets aren’t supported, it falls back to long polling.
- **Room & Namespace Support:** Allows communication within groups (rooms) or specific channels (namespaces).
- **Event-Based Communication:** Uses event listeners to send and receive data efficiently.
- **Cross-Origin Resource Sharing (CORS) Support:** Allows connections across different domains easily.
- **Broadcasting:** Enables sending messages to multiple clients efficiently.

### Why Use Socket.IO Instead of Raw WebSockets?
- Simplifies implementation in both **client** and **server**.
- Provides additional **features** for handling unreliable network conditions.
- Works well with **middleware** for authentication and validation.
- Offers **better scalability** with built-in support for Redis and multi-node deployment.

---

## 3. Bidirectional Communication with Socket.IO

Socket.IO allows real-time, event-driven bidirectional communication between client and server.

### Key Concepts:
1. **Client emits an event** → Server receives it.
2. **Server processes the event** → Server emits an update.
3. **Client listens for updates** → UI updates in real time.

### Example Workflow in the Dashboard Project:
- The server generates random data (score and wickets status) and **emits** it every second.
- The React frontend **listens** to these updates and updates the UI dynamically.
- The client can also **emit** events to start/stop data streaming.

### Code Implementation:
#### **Client (React)**
```js
useEffect(() => {
  if (streaming) {
    socket.on("cricketData", (data) => {
      setSpeed(data.score);
      setBrake(data.wickets);
    });
  } else {
    socket.off("cricketData");
  }

  return () => socket.off("cricketData"); // Cleanup on unmount
}, [streaming]);
```

#### **Server (Node.js)**
```js
io.on("connection", (socket) => {
  console.log("New client connected");
  
  let interval;
  let score = 0;
  let wickets = 0;
  let scoreInterval = null;
  let wicketInterval = null;
  socket.on("startStreaming", () => {
    if (!scoreInterval) {
      scoreInterval = setInterval(() => {
        score = (wickets >= 10) ? 0 : score + Math.floor(Math.random() * 6);
        socket.emit("cricketData", { score, wickets });
      }, 500); 
    }
  
    if (!wicketInterval) {
      wicketInterval = setInterval(() => {
        wickets = wickets >= 10 ? 0 : wickets + Math.round(Math.random());
        socket.emit("cricketData", { score, wickets });
      }, 2000); 
    }
  });

  socket.on("stopStreaming", () => {
    clearInterval(interval);
    interval = null;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
```

---

## 4. Things to Keep in Mind (React + Node.js)

### **Client-Side (React)**
- **Only connect in `useEffect`** to avoid multiple connections.
- **Clean up the connection on unmount** using `return () => socket.off("cricketData");`.
- **Use dependency arrays correctly** (`[streaming]`) to control when socket events attach.
- **Avoid memory leaks** by properly disconnecting the socket when the component unmounts.

### **Server-Side (Node.js + Express)**
- **Enable CORS** to allow frontend communication:
  ```js
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  ```
- **Use `setInterval` carefully** and ensure it stops when the client disconnects.
- **Limit connections** to prevent overload (explained in the next section).

---

## 5. Installation & Running Commands

### **Install Dependencies**
Run the following commands in the respective directories:

#### **Backend (Node.js)**
```sh
cd backend
npm install express socket.io cors
node server.js
```

#### **Frontend (React)**
```sh
cd frontend
npm install react socket.io-client @mui/material @emotion/react @emotion/styled
npm run dev
```

---

## 6. Cons of Socket.IO & Managing Connections

### **Potential Downsides of Socket.IO**
1. **Performance Overhead**: Adds additional layers over WebSockets.
2. **Less Efficient Than Pure WebSockets**: Can be slower due to fallbacks and event management.
3. **Limited Browser Support for WebSockets**: Older browsers might rely on polling fallback.
4. **Scalability Issues**: High load requires Redis adapter for scaling across multiple nodes.

### **Controlling Connections & Managing Load**
- **Limit Maximum Clients**: Prevent too many open connections.
- **Authenticate Clients**: Use middleware to validate users before allowing WebSocket connections.
- **Use Namespaces**: Keep separate streams of data instead of broadcasting everything to all clients.
- **Close Idle Connections**: Automatically disconnect inactive users to free up resources.

#### Example: **Authenticating Clients Before Connecting**
```js
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (validateToken(token)) {
    next(); // Allow connection
  } else {
    next(new Error("Unauthorized"));
  }
});
```

#### Example: **Limiting Connections per IP**
```js
const clients = {};
io.on("connection", (socket) => {
  const ip = socket.handshake.address;
  if (!clients[ip]) clients[ip] = 0;
  clients[ip]++;

  if (clients[ip] > 5) {
    socket.disconnect(); // Block multiple connections from the same IP
  }
});
```

---

## Conclusion
By using **Socket.IO** in this project, we achieved real-time updates for the dashboard, ensuring low latency and efficient communication. While Socket.IO simplifies WebSocket usage, it's important to manage connections properly and be mindful of potential performance concerns.


### Happy Coding! 🎉

