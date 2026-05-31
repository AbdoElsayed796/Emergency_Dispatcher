from flask import Flask, request, jsonify
import threading
import time
import requests
import math
import random

app = Flask(__name__)

SPRING_UPDATE_URL = "http://localhost:8080/api/vehicles/updateLocation"
SPRING_INCIDENT_URL = "http://localhost:8080/incidents"

# ------------------- Locks for atomic updates -------------------
vehicle_locks = {}
vehicle_locks_lock = threading.Lock()

incident_locks = {}
incident_locks_lock = threading.Lock()

def get_vehicle_lock(vehicle_id):
    """Get or create a lock for a specific vehicle."""
    with vehicle_locks_lock:
        if vehicle_id not in vehicle_locks:
            vehicle_locks[vehicle_id] = threading.Lock()
        return vehicle_locks[vehicle_id]

def get_incident_lock(incident_id):
    """Get or create a lock for a specific incident."""
    with incident_locks_lock:
        if incident_id not in incident_locks:
            incident_locks[incident_id] = threading.Lock()
        return incident_locks[incident_id]

# ------------------- Atomic Update Functions -------------------
def update_vehicle_location_atomic(vehicle_id, payload, retries=5):
    """Update vehicle location atomically for this vehicle with retries."""
    lock = get_vehicle_lock(vehicle_id)
    with lock:
        for attempt in range(retries):
            try:
                response = requests.post(SPRING_UPDATE_URL, json=payload)
                if response.status_code == 200:
                    return response
                print(f"⚠️ Attempt {attempt+1}: Failed to update vehicle {vehicle_id} ({response.status_code})")
            except Exception as e:
                print(f"⚠️ Attempt {attempt+1}: Exception updating vehicle {vehicle_id}: {e}")
            time.sleep(0.3 * (attempt + 1))  # exponential backoff
        print(f"❌ Failed to update vehicle {vehicle_id} after {retries} attempts")
        return None

def update_incident_status_atomic(incident_id, status, retries=5):
    """Update incident status atomically for this incident with retries."""
    lock = get_incident_lock(incident_id)
    with lock:
        for attempt in range(retries):
            try:
                response = requests.patch(f"{SPRING_INCIDENT_URL}/{incident_id}/status", json=status)
                if response.status_code == 200:
                    return response
                print(f"⚠️ Attempt {attempt+1}: Failed to update incident {incident_id} ({response.status_code})")
            except Exception as e:
                print(f"⚠️ Attempt {attempt+1}: Exception updating incident {incident_id}: {e}")
            time.sleep(0.3 * (attempt + 1))
        print(f"❌ Failed to update incident {incident_id} after {retries} attempts")
        return None

# ------------------- Utility Functions -------------------
def haversine(lat1, lon1, lat2, lon2):
    """Calculate Haversine distance in meters."""
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ------------------- Vehicle Simulation -------------------
def simulate_vehicle(vehicle_id, start, end, incident_id=0, interval=0.5, min_duration=10, max_duration=30):
    lat, lng = start
    dest_lat, dest_lng = end

    distance = haversine(lat, lng, dest_lat, dest_lng)
    trip_duration = random.uniform(min_duration, max_duration)
    steps = max(int(trip_duration / interval), 1)
    speed = distance / steps

    for step in range(steps):
        ratio = speed / max(distance, 1)
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
        update_vehicle_location_atomic(vehicle_id, payload, retries=3)
        time.sleep(interval)

    # Final update at destination
    final_payload = {
        "vehicleId": vehicle_id,
        "latitude": dest_lat,
        "longitude": dest_lng,
        "status": "AVAILABLE"
    }
    update_vehicle_location_atomic(vehicle_id, final_payload, retries=3)
    print(f"✅ Vehicle {vehicle_id} reached destination")

    # Resolve incident
    status = {"status": "RESOLVED"}
    resp = update_incident_status_atomic(incident_id, status, retries=5)
    if resp and resp.status_code == 200:
        print(f"✅ Incident {incident_id} resolved for vehicle {vehicle_id}")
    else:
        print(f"⚠️ Failed to resolve incident {incident_id}")

# ------------------- Flask Endpoint -------------------
@app.route("/simulate", methods=["POST"])
def start_simulation():
    data = request.get_json()
    vehicle_id = data["vehicleId"]
    incident_id = data["incidentId"]
    start = (data["startLatitude"], data["startLongitude"])
    end = (data["endLatitude"], data["endLongitude"])
    interval = data.get("interval", 0.5)
    min_duration = data.get("minDuration", 10)
    max_duration = data.get("maxDuration", 30)

    print(f"🔹 Vehicle {vehicle_id} will resolve incident {incident_id}")
    thread = threading.Thread(
        target=simulate_vehicle,
        args=(vehicle_id, start, end, incident_id, interval, min_duration, max_duration)
    )
    thread.start()

    return jsonify({"message": f"Simulation started for vehicle {vehicle_id}"}), 200

# ------------------- Run Flask -------------------
if __name__ == "__main__":
    app.run(port=5000)
