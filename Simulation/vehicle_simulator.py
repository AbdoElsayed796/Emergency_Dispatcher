import requests
import polyline
import time
from typing import List, Tuple

class OSRMLiveTracker:
    def __init__(self, backend_url: str):
        self.backend_url = backend_url
        self.osrm_base = "https://router.project-osrm.org"


    def get_route(
        self,
        start: Tuple[float, float],
        end: Tuple[float, float]
    ) -> List[Tuple[float, float]]:


        url = (
            f"{self.osrm_base}/route/v1/driving/"
            f"{start[1]},{start[0]};{end[1]},{end[0]}"
        )

        params = {
            "overview": "full",
            "geometries": "polyline"
        }

        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()

        encoded_polyline = data["routes"][0]["geometry"]
        route = polyline.decode(encoded_polyline)

        return route

    def send_location_update(
        self,
        vehicle_id: int,
        latitude: float,
        longitude: float,
        status: str = "ON_ROUTE"
    ) -> bool:

        payload = {
            "vehicleId": vehicle_id,
            "latitude": latitude,
            "longitude": longitude,
            "status": status
        }
        print(payload)

       

    def stream_route(
        self,
        vehicle_id: int,
        route: List[Tuple[float, float]],
        interval: float = 2.0
    ):
        print(f"Streaming {len(route)} points for vehicle {vehicle_id}")

        for i, (lat, lng) in enumerate(route):
            status = "AVAILABLE" if i == len(route) - 1 else "ON_ROUTE"

            success = self.send_location_update(
                vehicle_id=vehicle_id,
                latitude=lat,
                longitude=lng,
                status=status
            )

            if success:
                print(f"📍 {lat:.6f}, {lng:.6f} [{i+1}/{len(route)}]")

            time.sleep(interval)

def main():
    tracker = OSRMLiveTracker(
        backend_url="http://localhost:8080"
    )

    start = (30.0444, 31.2357)   # Downtown Cairo
    end = (30.0561, 31.3300)     # Nasr City

    route = tracker.get_route(start, end)
    print(route[-1])
    print(len(route))

    tracker.stream_route(
        vehicle_id=1,
        route=route,
        interval=.2
    )

if __name__ == "__main__":
    main()
