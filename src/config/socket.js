import { io } from "socket.io-client";

let socket;
let socketDetails = { status: "disconnected" };

function socketConnection(token) {
  return new Promise((resolve, reject) => {
    socket = io.connect(`http://localhost:3001?token=${token}`, {
      transports: ["websocket"],
      forceNew: true,
      jsonp: true,
    });

    socket.on("connect", () => {
      console.log("socket connected");
      socketDetails.status = "connected";
      resolve(socket);
    });

    socket.on("disconnect", (reason, details) => {
      console.log("socket disconnected", reason, details);
      socketDetails.status = "disconnected";
    });

    socket.on("connect_error", (error) => {
      console.log("socket connect error", error);
      socket.disconnect();
      reject("Error in Socket Connection");
    });
  });
}

export async function getSocketInstance(token) {
  if (socket && socket.connected) {
    return socket;
  } else {
    return await socketConnection(token);
  }
}

export async function socketDisconnect() {
  if (socket && socket.connected) {
    await socket.disconnect();
  }
}
