import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WORLD_CENTER = [20, 0];

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

const MapView = ({ incidents = [], vehicles = [], onDeleteIncident }) => {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={WORLD_CENTER} zoom={2} style={{ width: "100%", height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {incidents.map((inc) => {
          let emoji = "🔥"; // default
          let color = "#FF6B6B";

          if (inc.type === "MEDICAL") { emoji = "🩺"; color = "#1ABC9C"; }
          else if (inc.type === "POLICE") { emoji = "👮"; color = "#34495E"; }

          return (
            <Marker
              key={`inc-${inc.id}`}
              position={[inc.location.latitude, inc.location.longitude]}
              icon={createModernIcon(emoji, color)}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <div>
                    <b>Incident #{inc.id}</b><br />
                    Type: {inc.type}<br />
                    Status: {inc.status}<br />
                    Severity: {inc.severityLevel}
                  </div>

                  {/* Show delete button only if incident is resolved */}
                  {inc.status === "RESOLVED" && (
                    <button
                      onClick={() => onDeleteIncident(inc.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {vehicles.map((v) => {
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
