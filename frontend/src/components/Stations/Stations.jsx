import React, { useState, useEffect } from 'react';
import { Building2, Edit2, Trash2, Save, X, Phone, MapPin } from 'lucide-react';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    type: 'FIRE',
    name: '',
    phone: '',
    location: { latitude: 0, longitude: 0 }
  });

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch(`${API_URL}/stations`);
      const data = await response.json();

      // Convert backend format to displayable format
      const formatted = data.map(st => ({
        ...st,
        locationText: `${st.location.latitude},${st.location.longitude}`
      }));

      setStations(formatted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationInput = (e) => {
    const [lat, lng] = e.target.value.split(',');
    setFormData(prev => ({
      ...prev,
      location: {
        latitude: parseFloat(lat) || 0,
        longitude: parseFloat(lng) || 0
      }
    }));
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchStations();
        setShowAddForm(false);
        setFormData({
          type: 'FIRE',
          name: '',
          phone: '',
          location: { latitude: 0, longitude: 0 }
        });
      }
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const updateStationField = (id, field, value) => {
    setStations(stations.map(station =>
      station.id === id ? { ...station, [field]: value } : station
    ));
  };

  const updateLocationField = (id, textValue) => {
    const [lat, lng] = textValue.split(',');
    setStations(stations.map(station =>
      station.id === id
        ? {
            ...station,
            locationText: textValue,
            location: {
              latitude: parseFloat(lat) || 0,
              longitude: parseFloat(lng) || 0
            }
          }
        : station
    ));
  };

  const handleUpdate = async (id) => {
    const station = stations.find(s => s.id === id);

    const updatedBody = {
      id: station.id,
      type: station.type,
      name: station.name,
      phone: station.phone,
      location: station.location
    };

    try {
      const response = await fetch(`${API_URL}/stations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBody)
      });

      if (response.ok) {
        setEditingId(null);
        fetchStations();
      }
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return;

    try {
      const response = await fetch(`${API_URL}/stations/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchStations();
      }
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      FIRE: 'bg-orange-100 text-orange-700',
      POLICE: 'bg-blue-100 text-blue-700',
      MEDICAL: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type) => {
    const icons = {
      FIRE: '🚒',
      POLICE: '🚓',
      MEDICAL: '🚑'
    };
    return icons[type] || '🏢';
  };

  if (loading) {
    return <div className="text-center py-12">Loading stations...</div>;
  }

  return (
    <div>
      {/* ADD STATION HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Stations Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Building2 className="w-4 h-4" />
          Add Station
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Station</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="FIRE">Fire Station</option>
              <option value="POLICE">Police Station</option>
              <option value="MEDICAL">Medical Station</option>
            </select>

            <input
              type="text"
              name="name"
              placeholder="Station Name"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="lat,lng"
              value={`${formData.location.latitude},${formData.location.longitude}`}
              onChange={handleLocationInput}
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getTypeIcon(station.type)}</div>
                <div>
                  {editingId === station.id ? (
                    <input
                      type="text"
                      value={station.name}
                      onChange={(e) => updateStationField(station.id, 'name', e.target.value)}
                      className="px-2 py-1 border rounded"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg">{station.name}</h3>
                  )}

                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(station.type)}`}>
                    {station.type}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">ID: {station.id}</span>
            </div>

            <div className="space-y-3 mt-4">
              {/* PHONE */}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                {editingId === station.id ? (
                  <input
                    type="tel"
                    value={station.phone}
                    onChange={(e) => updateStationField(station.id, 'phone', e.target.value)}
                    className="px-2 py-1 border rounded flex-1"
                  />
                ) : (
                  <span>{station.phone}</span>
                )}
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-1" />
                {editingId === station.id ? (
                  <input
                    type="text"
                    value={station.locationText}
                    onChange={(e) => updateLocationField(station.id, e.target.value)}
                    className="px-2 py-1 border rounded flex-1"
                  />
                ) : (
                  <span>{station.locationText}</span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              {editingId === station.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(station.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded"
                  >
                    <Save className="w-4 h-4 inline" /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-200 py-2 rounded"
                  >
                    <X className="w-4 h-4 inline" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingId(station.id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded"
                  >
                    <Edit2 className="w-4 h-4 inline" /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(station.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded"
                  >
                    <Trash2 className="w-4 h-4 inline" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stations;
