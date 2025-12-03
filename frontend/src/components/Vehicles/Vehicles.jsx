import React, { useState, useEffect } from 'react';
import { Car, Edit2, Trash2, Save, X, MapPin, Users } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'FIRE',
    status: 'AVAILABLE',
    capacity: 4,
    location: '0,0',
    station_id: '',
    responder_user_id: ''
  });

  const API_URL = 'http://localhost:8080/api'; // Update with your backend URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesRes, stationsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/vehicles`),
        fetch(`${API_URL}/stations`),
        fetch(`${API_URL}/users`)
      ]);
      
      const vehiclesData = await vehiclesRes.json();
      const stationsData = await stationsRes.json();
      const usersData = await usersRes.json();
      
      setVehicles(vehiclesData);
      setStations(stationsData);
      setResponders(usersData.filter(u => u.role === 'RESPONDER'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchData();
        setShowAddForm(false);
        setFormData({ type: 'FIRE', status: 'AVAILABLE', capacity: 4, location: '0,0', station_id: '', responder_user_id: '' });
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const vehicle = vehicles.find(v => v.id === id);
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      if (response.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const updateVehicleField = (id, field, value) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
    ));
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-700',
      ON_ROUTE: 'bg-blue-100 text-blue-700',
      BUSY: 'bg-yellow-100 text-yellow-700',
      MAINTENANCE: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      FIRE: 'bg-orange-100 text-orange-700',
      POLICE: 'bg-blue-100 text-blue-700',
      MEDICAL: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="text-center py-12">Loading vehicles...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vehicles Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Car className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="FIRE">Fire</option>
              <option value="POLICE">Police</option>
              <option value="MEDICAL">Medical</option>
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_ROUTE">On Route</option>
              <option value="BUSY">Busy</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              name="location"
              placeholder="Location (lat,lng)"
              value={formData.location}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              name="station_id"
              value={formData.station_id}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Station</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.type})
                </option>
              ))}
            </select>
            <select
              name="responder_user_id"
              value={formData.responder_user_id}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Responder</option>
              {responders.map(responder => (
                <option key={responder.id} value={responder.id}>
                  {responder.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{vehicle.id}</td>
                <td className="px-6 py-4">
                  {editingId === vehicle.id ? (
                    <select
                      value={vehicle.type}
                      onChange={(e) => updateVehicleField(vehicle.id, 'type', e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="FIRE">Fire</option>
                      <option value="POLICE">Police</option>
                      <option value="MEDICAL">Medical</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(vehicle.type)}`}>
                      {vehicle.type}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === vehicle.id ? (
                    <select
                      value={vehicle.status}
                      onChange={(e) => updateVehicleField(vehicle.id, 'status', e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ON_ROUTE">On Route</option>
                      <option value="BUSY">Busy</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === vehicle.id ? (
                    <input
                      type="number"
                      value={vehicle.capacity}
                      onChange={(e) => updateVehicleField(vehicle.id, 'capacity', e.target.value)}
                      className="px-2 py-1 border rounded w-20"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {vehicle.capacity}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === vehicle.id ? (
                    <select
                      value={vehicle.station_id}
                      onChange={(e) => updateVehicleField(vehicle.id, 'station_id', e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {stations.find(s => s.id === vehicle.station_id)?.name || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === vehicle.id ? (
                    <select
                      value={vehicle.responder_user_id}
                      onChange={(e) => updateVehicleField(vehicle.id, 'responder_user_id', e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      {responders.map(responder => (
                        <option key={responder.id} value={responder.id}>
                          {responder.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {responders.find(r => r.id === vehicle.responder_user_id)?.name || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editingId === vehicle.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(vehicle.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingId(vehicle.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;