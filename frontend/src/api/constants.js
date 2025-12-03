/**
 * API Endpoints and Constants
 * Centralized endpoint definitions for all services
 */

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: '/users/all',
  GET_BY_ID: (id) => `/users/${id}`,
  CREATE: '/users/create',
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
  GET_BY_ROLE: (role) => `/users/role/${role}`,
};

// Station endpoints
export const STATION_ENDPOINTS = {
  GET_ALL: '/stations/all',
  GET_BY_ID: (id) => `/stations/${id}`,
  CREATE: '/stations/create',
  UPDATE: (id) => `/stations/${id}`,
  DELETE: (id) => `/stations/${id}`,
  GET_BY_TYPE: (type) => `/stations/type/${type}`,
  GET_NEARBY: (lat, lng, radius) => `/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
};

// Vehicle endpoints
export const VEHICLE_ENDPOINTS = {
  GET_ALL: '/vehicles/all',
  GET_BY_ID: (id) => `/vehicles/${id}`,
  CREATE: '/vehicles/create',
  UPDATE: (id) => `/vehicles/${id}`,
  DELETE: (id) => `/vehicles/${id}`,
  GET_BY_STATION: (stationId) => `/vehicles/station/${stationId}`,
  GET_BY_STATUS: (status) => `/vehicles/status/${status}`,
  GET_AVAILABLE: '/vehicles/available',
  UPDATE_STATUS: (id) => `/vehicles/${id}/status`,
  UPDATE_LOCATION: (id) => `/vehicles/${id}/location`,
};

// Incident endpoints
export const INCIDENT_ENDPOINTS = {
  GET_ALL: '/incidents/all',
  GET_BY_ID: (id) => `/incidents/${id}`,
  CREATE: '/incidents/create',
  UPDATE: (id) => `/incidents/${id}`,
  DELETE: (id) => `/incidents/${id}`,
  GET_BY_STATUS: (status) => `/incidents/status/${status}`,
  GET_BY_SEVERITY: (severity) => `/incidents/severity/${severity}`,
  GET_RECENT: '/incidents/recent',
  GET_ACTIVE: '/incidents/active',
};

// Assignment endpoints
export const ASSIGNMENT_ENDPOINTS = {
  GET_ALL: '/assignments/all',
  GET_BY_ID: (id) => `/assignments/${id}`,
  CREATE: '/assignments/create',
  UPDATE: (id) => `/assignments/${id}`,
  DELETE: (id) => `/assignments/${id}`,
  GET_BY_INCIDENT: (incidentId) => `/assignments/incident/${incidentId}`,
  GET_BY_VEHICLE: (vehicleId) => `/assignments/vehicle/${vehicleId}`,
  GET_ACTIVE: '/assignments/active',
  ACCEPT: (id) => `/assignments/${id}/accept`,
  COMPLETE: (id) => `/assignments/${id}/complete`,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  CONFLICT: 'Resource already exists or conflict occurred.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  ASSIGNED: 'Assignment created successfully.',
  ACCEPTED: 'Assignment accepted successfully.',
  COMPLETED: 'Assignment completed successfully.',
};