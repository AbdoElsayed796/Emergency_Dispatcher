import csv
import random
from typing import List, Tuple

class IncidentDataGenerator:
    def __init__(self):
        self.incident_types = ["FIRE", "MEDICAL", "POLICE"]
        self.severity_levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        
    def generate_location(self) -> Tuple[float, float]:
        # Worldwide coordinates
        lat = random.uniform(-90, 90)
        lng = random.uniform(-180, 180)
        return (lat, lng)
    
    def generate_csv(self, filename: str, num_incidents: int):
        print(f"Generating {num_incidents} incidents worldwide...")
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['type', 'severity', 'lat', 'lng'])
            
            for _ in range(num_incidents):
                incident_type = random.choice(self.incident_types)
                severity = random.choice(self.severity_levels)
                lat, lng = self.generate_location()
                
                writer.writerow([
                    incident_type,
                    severity,
                    f"{lat:.6f}",
                    f"{lng:.6f}"
                ])
        
        print(f"✅ Created {filename} with {num_incidents} incidents worldwide")
    

def main():
    generator = IncidentDataGenerator()

    generator.generate_csv('incidents_100.csv', 100)
    generator.generate_csv('incidents_500.csv', 500)
    

if __name__ == "__main__":
    main()
