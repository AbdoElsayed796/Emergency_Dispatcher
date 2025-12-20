import React, { useEffect, useState } from "react";

// Leaflet / Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// WebSocket
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";


// ---------- ICON ----------
const createModernIcon = (emoji, color) =>
  new L.DivIcon({
    html: `
      <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          width:48px;height:48px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 12px rgba(0,0,0,.3);
        "></div>
        <div style="font-size:24px;z-index:2">${emoji}</div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
    className: "",
  });

const WORLD_CENTER = [20, 0];

const MapView = ({ incidents = [], vehicles = [] }) => {
  const [liveVehicles, setLiveVehicles] = useState(vehicles);

  // ---------- WEBSOCKET ----------
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe("/topic/vehicles", (msg) => {
          const updatedVehicle = JSON.parse(msg.body);
          console.log("Received vehicle:", updatedVehicle); // <-- Add this
          setLiveVehicles((prev) => {
            const exists = prev.find(v => v.id === updatedVehicle.id);
            if (!exists) return [...prev, updatedVehicle];

            return prev.map((v) =>
              v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v
            );
          });
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      }
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={WORLD_CENTER}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* INCIDENTS */}
        {incidents.map((inc) => (
          <Marker
            key={`inc-${inc.id}`}
            position={[inc.location.latitude, inc.location.longitude]}
            icon={createModernIcon("❗", "#FF6B6B")}
          >
            <Popup>
              <b>Incident #{inc.id}</b><br />
              Type: {inc.type}<br />
              Status: {inc.status}<br />
              Severity: {inc.severityLevel}
            </Popup>
          </Marker>
        ))}

        {/* VEHICLES (LIVE) */}
        {liveVehicles.map((v) => {
          let emoji = "🚑";
          let color = "#1ABC9C";

          if (v.type === "FIRE") { emoji = "🚒"; color = "#E74C3C"; }
          if (v.type === "POLICE") { emoji = "🚓"; color = "#34495E"; }

          return (
            <Marker
              key={`veh-${v.id}`}
              position={[v.location.latitude, v.location.longitude]}
              icon={createModernIcon(emoji, color)}
            >
              <Popup>
                <b>Vehicle #{v.id}</b><br />
                Type: {v.type}<br />
                Status: {v.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
