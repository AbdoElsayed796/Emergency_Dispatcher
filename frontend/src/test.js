// // Vehicle Real-Time Location Simulator
// // Continuously updates vehicle locations to simulate real movement

// // For Node.js - import fetch if not available globally
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// const API_BASE = 'http://localhost:8080/api/vehicles';

// // Store created vehicle IDs and their current positions
// let vehiclesTracking = new Map(); // id -> {lat, lng, direction}

// // Cairo city boundaries
// const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };
// const MOVEMENT_SPEED = 0.0005; // ~55 meters per update

// // Create a new vehicle
// async function createVehicle() {
//     const statuses = ['AVAILABLE', 'BUSY', 'ON_ROUTE', 'MAINTENANCE'];
//     const types = ['MEDICAL', 'FIRE', 'POLICE'];
    
//     const vehicleData = {
//         type: types[Math.floor(Math.random() * types.length)],
//         status: statuses[Math.floor(Math.random() * statuses.length)],
//         capacity: Math.floor(Math.random() * 5) + 2,
//         location: {
//             latitude: CAIRO_CENTER.lat + (Math.random() - 0.5) * 0.1,
//             longitude: CAIRO_CENTER.lng + (Math.random() - 0.5) * 0.1
//         },
//         stationId: 1,
//         responderId: 1
//     };

//     try {
//         console.log('🚗 Creating vehicle...', vehicleData.type, vehicleData.status);
//         console.log('   Sending to:', API_BASE);
//         console.log('   Data:', JSON.stringify(vehicleData, null, 2));
        
//         const response = await fetch(API_BASE, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(vehicleData)
//         });

//         console.log('   Response status:', response.status, response.statusText);

//         if (response.ok) {
//             const created = await response.json();
            
//             // Track this vehicle's position
//             vehiclesTracking.set(created.id, {
//                 lat: vehicleData.location.latitude,
//                 lng: vehicleData.location.longitude,
//                 direction: Math.random() * 360, // Random initial direction
//                 type: vehicleData.type,
//                 status: vehicleData.status
//             });
            
//             console.log(`✅ Vehicle ${created.id} created (${created.type})`);
//             return created;
//         } else {
//             const errorText = await response.text();
//             console.error('❌ Failed to create vehicle!');
//             console.error('   Status:', response.status);
//             console.error('   Error:', errorText);
//             return null;
//         }
//     } catch (error) {
//         console.error('❌ Error creating vehicle:', error.message);
//         console.error('   Full error:', error);
//         return null;
//     }
// }

// // Update vehicle location (simulate movement)
// async function updateVehicleLocation(vehicleId) {
//     const vehicle = vehiclesTracking.get(vehicleId);
//     if (!vehicle) {
//         console.log(`⚠️ Vehicle ${vehicleId} not tracked`);
//         return;
//     }

//     // Calculate new position based on direction
//     const radians = vehicle.direction * (Math.PI / 180);
//     vehicle.lat += Math.cos(radians) * MOVEMENT_SPEED;
//     vehicle.lng += Math.sin(radians) * MOVEMENT_SPEED;

//     // Randomly change direction slightly (simulate realistic movement)
//     vehicle.direction += (Math.random() - 0.5) * 30;

//     // Keep vehicles within Cairo boundaries
//     const maxDistance = 0.05;
//     if (Math.abs(vehicle.lat - CAIRO_CENTER.lat) > maxDistance) {
//         vehicle.direction = 180 - vehicle.direction;
//     }
//     if (Math.abs(vehicle.lng - CAIRO_CENTER.lng) > maxDistance) {
//         vehicle.direction = -vehicle.direction;
//     }

//     // Keep status unchanged during road movement
//     // Status should only change through manual API calls or other operations
    
//     const updateData = {
//         status: vehicle.status,  // Keep current status
//         capacity: Math.floor(Math.random() * 5) + 2,
//         location: {
//             latitude: vehicle.lat,
//             longitude: vehicle.lng
//         },
//         responderId: 1
//     };

//     try {
//         const response = await fetch(`${API_BASE}/${vehicleId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updateData)
//         });

//         if (response.ok) {
//             console.log(`📍 Vehicle ${vehicleId} moved to [${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}] - ${vehicle.status}`);
//             return true;
//         } else {
//             const errorText = await response.text();
//             console.error(`❌ Failed to update vehicle ${vehicleId}: ${response.status} - ${errorText}`);
//             return false;
//         }
//     } catch (error) {
//         console.error(`❌ Error updating vehicle ${vehicleId}:`, error.message);
//         return false;
//     }
// }

// // Update all tracked vehicles
// async function updateAllVehicles() {
//     if (vehiclesTracking.size === 0) {
//         console.log('⚠️ No vehicles to update');
//         return;
//     }

//     console.log(`\n🔄 Updating ${vehiclesTracking.size} vehicles...`);
    
//     const promises = Array.from(vehiclesTracking.keys()).map(id => 
//         updateVehicleLocation(id)
//     );
    
//     await Promise.all(promises);
//     console.log(`✅ Updated ${vehiclesTracking.size} vehicles\n`);
// }

// // Create initial fleet
// async function createInitialFleet(count = 5) {
//     console.log(`\n🚀 Creating initial fleet of ${count} vehicles...\n`);
    
//     for (let i = 0; i < count; i++) {
//         const result = await createVehicle();
//         if (!result) {
//             console.error(`❌ Failed to create vehicle ${i + 1}`);
//         }
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
//     }
    
//     console.log(`\n✅ Fleet created! ${vehiclesTracking.size} vehicles ready\n`);
    
//     if (vehiclesTracking.size === 0) {
//         console.error('\n❌ ERROR: No vehicles were created!');
//         console.error('Please check:');
//         console.error('  1. Is your backend running on http://localhost:8080?');
//         console.error('  2. Does stationId=1 exist in your database?');
//         console.error('  3. Does responderId=1 exist in your database?');
//         console.error('  4. Check backend logs for errors\n');
//     }
// }

// // Start real-time simulation
// let simulationInterval = null;

// async function startSimulation(updateIntervalSeconds = 3, fleetSize = 5) {
//     if (simulationInterval) {
//         console.log('⚠️ Simulation already running!');
//         return;
//     }

//     console.log('\n╔════════════════════════════════════════════════════════════╗');
//     console.log('║     🚨 REAL-TIME VEHICLE TRACKING SIMULATION STARTED     ║');
//     console.log('╚════════════════════════════════════════════════════════════╝\n');

//     // Test connection first
//     console.log('🔍 Testing API connection...');
//     try {
//         const testResponse = await fetch(API_BASE);
//         console.log(`✅ API is reachable: ${testResponse.status}\n`);
//     } catch (error) {
//         console.error('❌ Cannot reach API:', error.message);
//         console.error('   Make sure your backend is running!\n');
//         return;
//     }

//     // Create initial fleet if needed
//     if (vehiclesTracking.size === 0) {
//         await createInitialFleet(fleetSize);
//     }

//     if (vehiclesTracking.size === 0) {
//         console.error('❌ Cannot start simulation - no vehicles created!');
//         return;
//     }

//     console.log(`📡 Update interval: ${updateIntervalSeconds} seconds`);
//     console.log(`🚗 Tracking ${vehiclesTracking.size} vehicles`);
//     console.log(`🗺️ Watch your Dispatcher Dashboard for real-time updates!\n`);

//     // Start periodic updates
//     simulationInterval = setInterval(async () => {
//         await updateAllVehicles();
//     }, updateIntervalSeconds * 1000);
// }

// function stopSimulation() {
//     if (!simulationInterval) {
//         console.log('⚠️ No simulation running!');
//         return;
//     }

//     clearInterval(simulationInterval);
//     simulationInterval = null;
    
//     console.log('\n╔════════════════════════════════════════════════════════════╗');
//     console.log('║          ⏹️  SIMULATION STOPPED                            ║');
//     console.log('╚════════════════════════════════════════════════════════════╝\n');
// }

// function showStatus() {
//     console.log('\n╔════════════════════════════════════════════════════════════╗');
//     console.log('║                  📊 SIMULATION STATUS                      ║');
//     console.log('╚════════════════════════════════════════════════════════════╝');
//     console.log(`\n🚗 Tracked Vehicles: ${vehiclesTracking.size}`);
//     console.log(`📡 Status: ${simulationInterval ? '🟢 Running' : '🔴 Stopped'}`);
//     console.log(`🌍 API Endpoint: ${API_BASE}\n`);
    
//     if (vehiclesTracking.size > 0) {
//         console.log('📍 Current Vehicles:');
//         vehiclesTracking.forEach((vehicle, id) => {
//             console.log(`   Vehicle ${id}: ${vehicle.type} - ${vehicle.status} at [${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}]`);
//         });
//         console.log('');
//     }
// }

// // Auto-start when run with Node.js
// if (typeof window === 'undefined') {
//     // Running in Node.js
//     console.log('\n╔════════════════════════════════════════════════════════════╗');
//     console.log('║       🚗 VEHICLE REAL-TIME LOCATION SIMULATOR             ║');
//     console.log('╚════════════════════════════════════════════════════════════╝\n');

//     (async () => {
//         // Start simulation with 5 vehicles, updating every 3 seconds
//         await startSimulation(3, 5);

//         // Keep running indefinitely
//         console.log('💡 Press Ctrl+C to stop the simulation\n');

//         // Handle graceful shutdown
//         process.on('SIGINT', () => {
//             console.log('\n\n🛑 Shutting down...');
//             stopSimulation();
//             showStatus();
//             process.exit(0);
//         });
//     })();
// } else {
//     // Running in browser
//     console.log(`
// ╔════════════════════════════════════════════════════════════╗
// ║     🚗 VEHICLE REAL-TIME LOCATION SIMULATOR LOADED         ║
// ╚════════════════════════════════════════════════════════════╝

// 🎮 Available Commands:
//    ┌─────────────────────────────────────────────────────────┐
//    │ startSimulation(interval, count)  Start simulation      │
//    │   - interval: seconds between updates (default: 3)      │
//    │   - count: number of vehicles (default: 5)              │
//    │                                                          │
//    │ stopSimulation()                  Stop simulation       │
//    │ showStatus()                      Show current status   │
//    │ createVehicle()                   Add one more vehicle  │
//    └─────────────────────────────────────────────────────────┘

// 🚀 Quick Start:
//    → Run: startSimulation()
//    → Watch your Dispatcher Dashboard!

// 📍 Backend: ${API_BASE}
// `);

//     window.startSimulation = startSimulation;
//     window.stopSimulation = stopSimulation;
//     window.showStatus = showStatus;
//     window.createVehicle = createVehicle;
// }

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
  
  const API = "http://localhost:8080/incidents/add";
  
  setInterval(async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "MEDICAL",
        severityLevel: "MEDIUM",
        description: "Node WS test incident",
        location: {
          latitude: 30.05 + Math.random() * 0.01,
          longitude: 31.24 + Math.random() * 0.01
        }
      })
    });
    console.log("🚑 Incident sent");
  }, 5000);
  