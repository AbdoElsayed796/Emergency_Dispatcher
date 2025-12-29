import csv
import random
from typing import List, Tuple

class IncidentDataGenerator:
    def __init__(self, center_lat: float = 30.0444, center_lng: float = 31.2357):
        self.center_lat = center_lat
        self.center_lng = center_lng
        
        self.incident_types = ["FIRE", "MEDICAL", "ACCIDENT"]
        self.severity_levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        
    def generate_location(self, radius: float = 1) -> Tuple[float, float]:
        lat = self.center_lat + random.uniform(-radius, radius)
        lng = self.center_lng + random.uniform(-radius, radius)
        return (lat, lng)
    
    def generate_csv(self, filename: str, num_incidents: int):
        print(f"Generating {num_incidents} incidents...")
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['type', 'severity', 'lat', 'lng'])
            
            for i in range(num_incidents):
                incident_type = random.choice(self.incident_types)
                severity = random.choice(self.severity_levels)
                lat, lng = self.generate_location()
                
                writer.writerow([
                    incident_type,
                    severity,
                    f"{lat:.6f}",
                    f"{lng:.6f}"
                ])
   
        
        print(f"✅ Created {filename} with {num_incidents} incidents")
    

def main():
    generator = IncidentDataGenerator(center_lat=30.0444, center_lng=31.2357)

    generator.generate_csv('incidents_100.csv', 100)

    generator.generate_csv('incidents_500.csv', 500)
    

if __name__ == "__main__":
    main()