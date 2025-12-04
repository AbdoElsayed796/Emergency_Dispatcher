import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Save, X, Phone, Mail, Shield } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'DISPATCHER'
  });

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchUsers();
        setShowAddForm(false);
        setFormData({ name: '', email: '', password: '', phone: '', role: 'DISPATCHER' });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const user = users.find(u => u.id === id);

      const updatePayload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: user.password ?? null // only include if edited
      };

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        setEditingId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUserField = (id, field, value) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, [field]: value } : user
    ));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-700',
      DISPATCHER: 'bg-blue-100 text-blue-700',
      RESPONDER: 'bg-green-100 text-green-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>

          <div className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Full Name" value={formData.name}
              onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input name="email" type="email" placeholder="Email" value={formData.email}
              onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input name="password" type="password" placeholder="Password" value={formData.password}
              onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <input name="phone" placeholder="Phone" value={formData.phone}
              onChange={handleInputChange} className="px-4 py-2 border rounded-lg" />
            <select name="role" value={formData.role}
              onChange={handleInputChange} className="px-4 py-2 border rounded-lg">
              <option value="DISPATCHER">Dispatcher</option>
              <option value="RESPONDER">Responder</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.id}</td>

                {/* NAME */}
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={user.name}
                      onChange={(e) => updateUserField(user.id, 'name', e.target.value)}
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}
                </td>

                {/* EMAIL (editable) */}
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <>
                      <input
                        type="email"
                        className="border px-2 py-1 rounded w-full"
                        value={user.email}
                        onChange={(e) => updateUserField(user.id, 'email', e.target.value)}
                      />

                      {/* Password only in edit mode */}
                      <input
                        type="password"
                        placeholder="New Password"
                        className="border px-2 py-1 rounded w-full mt-2"
                        onChange={(e) =>
                          updateUserField(user.id, 'password', e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  )}
                </td>

                {/* PHONE */}
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={user.phone}
                      onChange={(e) => updateUserField(user.id, 'phone', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                  )}
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <select
                      className="border px-2 py-1 rounded"
                      value={user.role}
                      onChange={(e) => updateUserField(user.id, 'role', e.target.value)}
                    >
                      <option value="DISPATCHER">Dispatcher</option>
                      <option value="RESPONDER">Responder</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      <Shield className="w-3 h-3" /> {user.role}
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(user.id)}
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
                          onClick={() => setEditingId(user.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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

export default Users;
