// ============================================================
// T3G API Service Layer
// Ready to connect to real backend - just update BASE_URL and
// replace mock data with real fetch calls
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic fetch helper
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('t3g_token') : null;
  
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export const AuthAPI = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<void>('/auth/logout', { method: 'POST' }),

  me: () =>
    apiFetch<User>('/auth/me'),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ── System ────────────────────────────────────────────────────
export const SystemAPI = {
  getStatus: () =>
    apiFetch<SystemStatus>('/system/status'),

  arm: () =>
    apiFetch<SystemStatus>('/system/arm', { method: 'POST' }),

  disarm: () =>
    apiFetch<SystemStatus>('/system/disarm', { method: 'POST' }),
};

// ── Devices ───────────────────────────────────────────────────
export const DevicesAPI = {
  getAll: () =>
    apiFetch<Device[]>('/devices'),

  getById: (id: string) =>
    apiFetch<Device>(`/devices/${id}`),

  create: (data: Partial<Device>) =>
    apiFetch<Device>('/devices', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Device>) =>
    apiFetch<Device>(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<void>(`/devices/${id}`, { method: 'DELETE' }),

  getStreamUrl: (id: string) =>
    apiFetch<{ url: string }>(`/devices/${id}/stream`),
};

// ── Events ────────────────────────────────────────────────────
export const EventsAPI = {
  getAll: (filters?: EventFilters) => {
    const params = new URLSearchParams();
    if (filters?.date) params.set('date', filters.date);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.device) params.set('device', filters.device);
    return apiFetch<Event[]>(`/events?${params.toString()}`);
  },

  acknowledge: (id: string) =>
    apiFetch<Event>(`/events/${id}/acknowledge`, { method: 'POST' }),
};

// ── Alerts ────────────────────────────────────────────────────
export const AlertsAPI = {
  getRecent: (limit = 10) =>
    apiFetch<Alert[]>(`/alerts?limit=${limit}`),

  dismiss: (id: string) =>
    apiFetch<void>(`/alerts/${id}/dismiss`, { method: 'POST' }),
};

// ── Support ───────────────────────────────────────────────────
export const SupportAPI = {
  submitTicket: (data: TicketData) =>
    apiFetch<{ ticketId: string }>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Config ────────────────────────────────────────────────────
export const ConfigAPI = {
  get: () =>
    apiFetch<Config>('/config'),

  update: (data: Partial<Config>) =>
    apiFetch<Config>('/config', { method: 'PUT', body: JSON.stringify(data) }),

  updateProfile: (data: Partial<User>) =>
    apiFetch<User>('/config/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (current: string, newPass: string) =>
    apiFetch<void>('/config/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    }),
};

// ── Types ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface SystemStatus {
  armed: boolean;
  state: 'armed' | 'disarmed' | 'alarm' | 'pending';
  devicesOnline: number;
  devicesTotal: number;
  lastUpdated: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'camera' | 'sensor' | 'alarm' | 'doorbell';
  location: string;
  zone: 'interior' | 'exterior';
  status: 'online' | 'offline' | 'warning';
  batteryLevel?: number;
  resolution?: string;
  model?: string;
  ip?: string;
  streamUrl?: string;
  lastSeen: string;
}

export interface Event {
  id: string;
  type: 'alert' | 'system' | 'info';
  description: string;
  device: string;
  deviceId?: string;
  timestamp: string;
  hasRecording: boolean;
  acknowledged: boolean;
}

export interface Alert {
  id: string;
  type: 'motion' | 'intrusion' | 'system' | 'device';
  severity: 'high' | 'medium' | 'low';
  message: string;
  device: string;
  timestamp: string;
  read: boolean;
}

export interface EventFilters {
  date?: string;
  type?: string;
  device?: string;
}

export interface TicketData {
  subject: string;
  category: string;
  description: string;
}

export interface Config {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    motionAlerts: boolean;
    systemAlerts: boolean;
  };
  recording: {
    quality: 'HD' | 'FHD' | '4K';
    duration: number;
    retentionDays: number;
    continuous: boolean;
    motionOnly: boolean;
  };
  security: {
    entryDelay: number;
    exitDelay: number;
    alarmDuration: number;
    zones: Zone[];
  };
}

export interface Zone {
  id: string;
  name: string;
  armed: boolean;
  devices: string[];
}
