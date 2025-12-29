from flask import Flask, request, jsonify
import threading
import time
import requests
import math
import random

app = Flask(__name__)

SPRING_UPDATE_URL = "http://localhost:8080/api/vehicles/updateLocation"

# Haversine distance in meters
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def simulate_vehicle(vehicle_id, start, end, interval=0.5, min_duration=10, max_duration=30 , incident_id = 0):
    lat, lng = start
    dest_lat, dest_lng = end

    distance = haversine(lat, lng, dest_lat, dest_lng)
    trip_duration = random.uniform(min_duration, max_duration)  # seconds
    steps = max(int(trip_duration / interval), 1)
    speed = distance / steps  # meters per step

   ## print(f"🚗 Vehicle {vehicle_id} trip distance: {distance:.1f}m, duration: {trip_duration:.1f}s, speed per step: {speed:.1f}m")

    for step in range(steps):
        ratio = speed / max(distance,1)
        ratio = min(ratio, 1)
        lat += (dest_lat - lat) * ratio
        lng += (dest_lng - lng) * ratio
        distance = haversine(lat, lng, dest_lat, dest_lng)

        payload = {
            "vehicleId": vehicle_id,
            "latitude": lat,
            "longitude": lng,
            "status": "BUSY"
        }
        try:
            requests.post(SPRING_UPDATE_URL, json=payload)
        except Exception as e:
            print(f"❌ Failed to update vehicle {vehicle_id}: {e}")

        #print(f"📍 Vehicle {vehicle_id} → Lat={lat:.6f} Lng={lng:.6f} Remaining={distance:.1f}m")
        time.sleep(interval)

    # Final update at destination
    payload = {
        "vehicleId": vehicle_id,
        "latitude": dest_lat,
        "longitude": dest_lng,
        "status": "AVAILABLE"
    }
    requests.post(SPRING_UPDATE_URL, json=payload)
    print(f"✅ Vehicle {vehicle_id} reached destination")
    # Resolve incident assigned to this vehicle
    status = {"status": "RESOLVED"}  # must match DTO
    try:
        resp = requests.patch(f"http://localhost:8080/incidents/{incident_id}/status", json=status)
        if resp.status_code == 200:
            print(f"✅ Incident {incident_id} resolved for vehicle {vehicle_id}")
        else:
            print(f"⚠️ Failed to resolve incident {incident_id}: {resp.status_code} {resp.text}")
    except Exception as e:
        print(f"❌ Exception resolving incident {incident_id}: {e}")

@app.route("/simulate", methods=["POST"])
def start_simulation():
    data = request.get_json()
    vehicle_id = data["vehicleId"]
    incident_id = data["incidentId"]
    print(f"🔹 Vehicle {vehicle_id} will resolve incident {incident_id}")
    start = (data["startLatitude"], data["startLongitude"])
    end = (data["endLatitude"], data["endLongitude"])
    interval = data.get("interval", 0.5)
    min_duration = data.get("minDuration", 10)
    max_duration = data.get("maxDuration", 30)

    thread = threading.Thread(target=simulate_vehicle, args=(vehicle_id, start, end, interval, min_duration, max_duration , incident_id))
    thread.start()

    return jsonify({"message": f"Simulation started for vehicle {vehicle_id}"}), 200

if __name__ == "__main__":
    app.run(port=5000)
