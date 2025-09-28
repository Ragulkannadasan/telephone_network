import { io } from 'socket.io-client';

// IMPORTANT: Replace 'RASPBERRY_PI_IP' with the actual IP address of your Raspberry Pi.
const SERVER_URL = 'http://RASPBERRY_PI_IP:3001';

// Create and export the socket connection.
export const socket = io(SERVER_URL, {
  transports: ['websocket'], // Force websocket connection
});
