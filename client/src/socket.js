import { io } from "socket.io-client";

export function connectSocket(token) {
  const socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket"], // important
  });
  return socket;
}
