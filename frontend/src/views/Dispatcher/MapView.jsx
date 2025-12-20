import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------- MODERN ANIMATED ICONS ----------
const createModernIcon = (emoji, color) =>
  new L.DivIcon({
    html: `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 48px;
          height: 48px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
        <div style="
          position: relative;
          font-size: 24px;
          transform: translateY(-4px);
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          z-index: 10;
        ">${emoji}</div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: rotate(-45deg) scale(1); }
            50% { transform: rotate(-45deg) scale(1.05); }
          }
        </style>
      </div>
    `,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

// ---------- MAP CENTER ----------
const WORLD_CENTER = [20, 0];

const MapView = ({ incidents = [], vehicles = [] }) => {
  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
      <style>{`
        .leaflet-container {
          background: #e5e3df;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 4px;
        }
        .leaflet-popup-content {
          margin: 12px;
          font-size: 14px;
          line-height: 1.6;
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .custom-popup-header {
          font-weight: 600;
          font-size: 16px;
          color: #1a1a1a;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f0f0f0;
        }
        .custom-popup-row {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 13px;
        }
        .custom-popup-label {
          color: #666;
          font-weight: 500;
        }
        .custom-popup-value {
          color: #1a1a1a;
          font-weight: 600;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          font-size: 20px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-radius: 12px !important;
        }
      `}</style>
      
      <MapContainer
        center={WORLD_CENTER}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
        zoomControl={true}
        attributionControl={false}
      >
        {/* Modern Google-like map tiles */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          noWrap={true}
        />

        {/* ---------- INCIDENT MARKERS ---------- */}
        {incidents.map((inc) => {
          let emoji = "❗";
          let color = "#FF6B6B";
          
          if (inc.type === "FIRE") {
            emoji = "🔥";
            color = "#FF4757";
          } else if (inc.type === "MEDICAL") {
            emoji = "🩺";
            color = "#3498DB";
          } else if (inc.type === "POLICE") {
            emoji = "👮";
            color = "#2C3E50";
          }
          
          return (
            <Marker
              key={`incident-${inc.id}`}
              position={[inc.location.latitude, inc.location.longitude]}
              icon={createModernIcon(emoji, color)}
            >
              <Popup>
                <div>
                  <div className="custom-popup-header">
                    {emoji} Incident #{inc.id}
                  </div>
                  <div className="custom-popup-row">
                    <span className="custom-popup-label">Type:</span>
                    <span className="custom-popup-value">{inc.type}</span>
                  </div>
                  <div className="custom-popup-row">
                    <span className="custom-popup-label">Severity:</span>
                    <span className="custom-popup-value">{inc.severityLevel}</span>
                  </div>
                  <div className="custom-popup-row">
                    <span className="custom-popup-label">Status:</span>
                    <span className="custom-popup-value">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ---------- VEHICLE MARKERS ---------- */}
        {vehicles.map((v) => {
          let emoji = "🚚";
          let color = "#95A5A6";
          
          if (v.type === "FIRE") {
            emoji = "🚒";
            color = "#E74C3C";
          } else if (v.type === "MEDICAL") {
            emoji = "🚑";
            color = "#1ABC9C";
          } else if (v.type === "POLICE") {
            emoji = "🚓";
            color = "#34495E";
          }
          
          return (
            <Marker
              key={`vehicle-${v.id}`}
              position={[v.location.latitude, v.location.longitude]}
              icon={createModernIcon(emoji, color)}
            >
              <Popup>
                <div>
                  <div className="custom-popup-header">
                    {emoji} Vehicle #{v.id}
                  </div>
                  <div className="custom-popup-row">
                    <span className="custom-popup-label">Type:</span>
                    <span className="custom-popup-value">{v.type}</span>
                  </div>
                  <div className="custom-popup-row">
                    <span className="custom-popup-label">Status:</span>
                    <span className="custom-popup-value">{v.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;