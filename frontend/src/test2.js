import axios from "axios";

const INCIDENT_URL = "http://localhost:8080/incidents";
const ASSIGNMENT_URL = "http://localhost:8080/assignments";

// Example dispatcher and vehicle IDs (adjust as needed)
const DISPATCHER_ID = 1;
const VEHICLE_ID = 1;

// Incident types and severity levels matching backend enums
const INCIDENT_TYPES = ["FIRE", "POLICE", "MEDICAL"];
const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH"];

// Interval to create new incidents
const CREATE_INTERVAL = 5000; // 5 seconds

// Generate random incident
function getRandomIncident() {
  const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
  const severityLevel = SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)];

  // Randomize location slightly to avoid duplicates
  const latitude = 30.0444 + Math.random() * 0.01;
  const longitude = 31.2357 + Math.random() * 0.01;

  return {
    type,
    severityLevel,
    location: { latitude, longitude }
  };
}

// Create a new incident
async function createIncident(incident) {
  try {
    const res = await axios.post(`${INCIDENT_URL}/add`, incident);
    console.log("Create response:", res.data);
    return incident; // return the object to locate it later
  } catch (err) {
    console.error("Error creating incident:", err.response?.data || err.message);
    return null;
  }
}

// Assign vehicle to incident
async function assignVehicle(incidentId) {
  const assignment = {
    incidentId,
    vehicleId: VEHICLE_ID,
    dispatcherId: DISPATCHER_ID
  };

  try {
    const res = await axios.post(`${ASSIGNMENT_URL}/create`, assignment);
    console.log(`Vehicle assigned to incident ${incidentId}:`, res.data);
    return true;
  } catch (err) {
    console.error("Error assigning vehicle:", err.response?.data || err.message);
    return false;
  }
}

// Mark incident as resolved
async function markAsResolved(incidentId) {
  try {
    const res = await axios.patch(`${INCIDENT_URL}/${incidentId}/status`, {
      status: "RESOLVED"
    });
    console.log(`Incident ${incidentId} resolved:`, res.data);
  } catch (err) {
    console.error("Error resolving incident:", err.response?.data || err.message);
  }
}

// Main function to create, assign, and resolve incidents
async function runTest() {
  const incident = getRandomIncident();
  const createdIncident = await createIncident(incident);
  if (!createdIncident) return;

  // Fetch all incidents and find the one we just created by location
  try {
    const incidents = await axios.get(`${INCIDENT_URL}/all`);
    const newIncident = incidents.data.find(
      i =>
        i.location.latitude.toFixed(4) === incident.location.latitude.toFixed(4) &&
        i.location.longitude.toFixed(4) === incident.location.longitude.toFixed(4)
    );

    if (!newIncident) {
      console.error("Could not find newly created incident!");
      return;
    }

    const incidentId = newIncident.id;

    const assigned = await assignVehicle(incidentId);
    if (!assigned) return;

    // Resolve incident after 5 seconds
    setTimeout(() => markAsResolved(incidentId), 5000);
  } catch (err) {
    console.error("Error fetching incidents:", err.response?.data || err.message);
  }
}

// Run periodically
setInterval(runTest, CREATE_INTERVAL);
