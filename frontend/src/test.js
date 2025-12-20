import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Define some vehicles
const vehicles = [
  { id: 1, type: "AMBULANCE", status: "ON_DUTY" },
  { id: 2, type: "FIRE", status: "ON_DUTY" },
  { id: 3, type: "POLICE", status: "ON_DUTY" },
  { id: 4, type: "AMBULANCE", status: "ON_DUTY" },
  { id: 5, type: "FIRE", status: "ON_DUTY" },
];

// Set a base location
const BASE_LAT = 20;
const BASE_LNG = 10;

// Utility to get a random offset
const randomOffset = () => (Math.random() - 0.5) * 2; // ±1 degree

// Create STOMP client
const client = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  reconnectDelay: 5000,
  onConnect: () => {
    console.log("✅ Connected to STOMP WebSocket");

    // Send updates every 1 second
    setInterval(() => {
      vehicles.forEach((v) => {
        const vehicleUpdate = {
          ...v,
          location: {
            latitude: BASE_LAT + randomOffset(),
            longitude: BASE_LNG + randomOffset(),
          },
        };

        client.publish({
          destination: "/topic/vehicles",
          body: JSON.stringify(vehicleUpdate),
        });

        console.log("Sent vehicle update:", vehicleUpdate);
      });
    }, 1000);
  },
});

client.activate();
