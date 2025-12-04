import React from 'react';
import { Bell, X, Check } from 'lucide-react';
import { getNotificationIcon } from '../../utils/dispatcherHelpers.jsx';

const NotificationsDropdown = ({
                                   showNotifications,
                                   setShowNotifications,
                                   notifications,
                                   unreadCount,
                                   markAsRead,
                                   markAllAsRead,
                                   clearAllNotifications
                               }) => {
    // Mark as read and handle notification click
    const handleNotificationClick = (notif) => {
        if (!notif.read) {
            markAsRead(notif.id);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setShowNotifications(!showNotifications);
                }}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAllNotifications}
                                    className="text-xs text-gray-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded"
                                >
                                    Clear all
                                </button>
                            )}
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No notifications</p>
                                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group relative ${
                                        !notif.read ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                {notif.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400">{notif.time}</p>
                                        </div>
                                        {!notif.read && (
                                            <div className="flex-shrink-0 flex items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mark as read button (appears on hover) */}
                                    {!notif.read && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notif.id);
                                            }}
                                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer with action buttons */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 flex justify-between items-center">
                            <button
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;