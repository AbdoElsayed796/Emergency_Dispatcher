/**
 * API Configuration
 * Centralized settings for API client
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// API version
export const API_VERSION = 'v1';