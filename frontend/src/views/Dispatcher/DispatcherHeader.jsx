import React, { useState } from 'react';
import { User, Activity, LogOut } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown.jsx';

const DispatcherHeader = ({
                              showNotifications,
                              setShowNotifications,
                              showUserMenu,
                              setShowUserMenu,
                              notifications,
                              handleLogout
                          }) => {
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const localUnreadCount = localNotifications.filter(n => !n.read).length;

    // Mark all notifications as read
    const markAllAsRead = () => {
        setLocalNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setLocalNotifications([]);
    };

    // Mark single notification as read
    const markAsRead = (id) => {
        setLocalNotifications(prev => prev.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dispatcher Panel</h1>
                    <p className="text-sm text-gray-600">Smart Emergency Dispatch Optimization System</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notifications Dropdown Component */}
                    <NotificationsDropdown
                        showNotifications={showNotifications}
                        setShowNotifications={setShowNotifications}
                        notifications={localNotifications}
                        unreadCount={localUnreadCount}
                        markAsRead={markAsRead}
                        markAllAsRead={markAllAsRead}
                        clearAllNotifications={clearAllNotifications}
                    />

                    {/* User Menu Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Dispatcher User</p>
                                <p className="text-xs text-gray-500">Online</p>
                            </div>
                        </button>

                        {/* User Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-900">Dispatcher User</p>
                                    <p className="text-xs text-gray-500">dispatcher@emergency.com</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        <User className="w-4 h-4" />
                                        Profile Settings
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Activity className="w-4 h-4" />
                                        Activity Log
                                    </button>
                                </div>
                                <div className="p-2 border-t border-gray-200">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispatcherHeader;