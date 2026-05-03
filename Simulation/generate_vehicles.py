import csv
import random
from typing import Tuple

class VehicleDataGenerator:
    def __init__(self, center_lat: float = 30.0444, center_lng: float = 31.2357):
        self.center_lat = center_lat
        self.center_lng = center_lng
        # Only the enum types
        self.vehicle_types = ["FIRE", "POLICE", "MEDICAL"]
        self.vehicle_status = "AVAILABLE"  # fixed status

    def generate_location(self, radius: float = 1) -> Tuple[float, float]:
        """Generate random location within radius"""
        lat = self.center_lat + random.uniform(-radius, radius)
        lng = self.center_lng + random.uniform(-radius, radius)
        return lat, lng

    def generate_csv(self, filename: str, num_vehicles: int):
        print(f"Generating {num_vehicles} vehicles in {filename}...")
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['type', 'status', 'capacity', 'lat', 'lng', 'stationId', 'responderId'])

            for _ in range(num_vehicles):
                v_type = random.choice(self.vehicle_types)
                capacity = random.randint(1, 6)  # example capacity
                lat, lng = self.generate_location()
                station_id = random.randint(1, 1)  # example station ids
                responder_id = 1  # fixed as requested

                writer.writerow([
                    v_type,
                    self.vehicle_status,
                    capacity,
                    f"{lat:.6f}",
                    f"{lng:.6f}",
                    station_id,
                    responder_id
                ])
        print(f"✅ Created {filename} with {num_vehicles} vehicles")

def main():
    generator = VehicleDataGenerator(center_lat=30.0444, center_lng=31.2357)
    generator.generate_csv('vehicles_75.csv', 75)
    generator.generate_csv('vehicles_125.csv', 125)
    generator.generate_csv('vehicles_375.csv', 375)

if __name__ == "__main__":
    main()
