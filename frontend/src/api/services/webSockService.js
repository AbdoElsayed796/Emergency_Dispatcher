// src/websocket/socket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectVehicleSocket = (onVehicleUpdate) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe("/topic/vehicles", (msg) => {
        const vehicle = JSON.parse(msg.body);
        onVehicleUpdate(vehicle);
      });
    }
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.deactivate();
};
