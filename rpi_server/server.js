const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// --- Basic Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { // Allow connections from your React app
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// --- Database (MongoDB with Mongoose) ---
// This is for persistence, but we'll use an in-memory object for live data for speed.
mongoose.connect('mongodb://localhost:27017/circuit_map')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// --- In-Memory State Management ---
// For real-time speed, we'll keep the live user list in memory.
// Format: { userId: { id, x, y }, ... }
const activeUsers = {};

// --- Real-Time Logic (Socket.IO) ---
io.on('connection', (socket) => {
  // 1. Create a new user when a client connects
  const userId = 'User-' + Math.floor(Math.random() * 1000);
  console.log(`New client connected with assigned ID: ${userId}`);
  activeUsers[userId] = { id: userId, x: 50 + Math.random() * 300, y: 50 + Math.random() * 300 };

  // 2. Send the assigned ID back to the newly connected client
  socket.emit('assignedID', userId);

  // 3. Broadcast the full, updated list of users to EVERYONE
  io.sockets.emit('mapState', Object.values(activeUsers));

  // 4. Handle location updates from a client
  socket.on('locationUpdate', (data) => {
    if (activeUsers[data.id]) {
      activeUsers[data.id].x = data.x;
      activeUsers[data.id].y = data.y;
      // Broadcast the new state to everyone after an update
      io.sockets.emit('mapState', Object.values(activeUsers));
    }
  });

  // 5. Handle a client disconnecting
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${userId}`);
    delete activeUsers[userId];
    // Broadcast the updated list to everyone
    io.sockets.emit('mapState', Object.values(activeUsers));
  });
});

// --- Server Start ---
const PORT = 3001; // Use a port like 3001 to avoid conflict with React's default 3000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Waiting for clients to connect...');
});
