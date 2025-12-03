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
    location: '0,0'
  });

  const API_URL = 'http://localhost:8080/api'; // Update with your backend URL

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch(`${API_URL}/stations`);
      const data = await response.json();
      setStations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setFormData({ type: 'FIRE', name: '', phone: '', location: '0,0' });
      }
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const station = stations.find(s => s.id === id);
      const response = await fetch(`${API_URL}/stations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station)
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

  const updateStationField = (id, field, value) => {
    setStations(stations.map(station => 
      station.id === id ? { ...station, [field]: value } : station
    ));
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

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Station</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getTypeIcon(station.type)}</div>
                <div>
                  {editingId === station.id ? (
                    <input
                      type="text"
                      value={station.name}
                      onChange={(e) => updateStationField(station.id, 'name', e.target.value)}
                      className="px-2 py-1 border rounded font-semibold"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg text-gray-900">{station.name}</h3>
                  )}
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${getTypeBadgeColor(station.type)}`}>
                    {station.type}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">ID: {station.id}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
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

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                {editingId === station.id ? (
                  <input
                    type="text"
                    value={station.location}
                    onChange={(e) => updateStationField(station.id, 'location', e.target.value)}
                    className="px-2 py-1 border rounded flex-1"
                    placeholder="lat,lng"
                  />
                ) : (
                  <span className="break-all">{station.location}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              {editingId === station.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(station.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingId(station.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(station.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* {stations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stations yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first station</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Building2 className="w-4 h-4" />
            Add Station
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Stations;