'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, SystemStatus, Device, Alert } from '@/lib/api';
import { MOCK_USER, MOCK_SYSTEM_STATUS, MOCK_DEVICES, MOCK_ALERTS } from '@/lib/mock-data';

interface AppContextType {
    // Auth
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;

    // System
    systemStatus: SystemStatus;
    toggleArmed: () => void;

    // Devices
    devices: Device[];

    // Alerts
    alerts: Alert[];
    unreadCount: number;
    dismissAlert: (id: string) => void;

    // UI
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>(MOCK_SYSTEM_STATUS);
    const [devices] = useState<Device[]>(MOCK_DEVICES);
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const login = useCallback(async (email: string, _password: string) => {
        // TODO: Replace with real AuthAPI.login() call
        // const { token, user } = await AuthAPI.login(email, password);
        // localStorage.setItem('t3g_token', token);
        // setUser(user);
        await new Promise(r => setTimeout(r, 800)); // Simulate network
        setUser({ ...MOCK_USER, email });
    }, []);

    const logout = useCallback(() => {
        // TODO: AuthAPI.logout()
        setUser(null);
        localStorage.removeItem('t3g_token');
    }, []);

    const toggleArmed = useCallback(() => {
        // TODO: Replace with SystemAPI.arm() / SystemAPI.disarm()
        setSystemStatus(prev => ({
            ...prev,
            armed: !prev.armed,
            state: prev.armed ? 'disarmed' : 'armed',
            lastUpdated: new Date().toISOString(),
        }));
    }, []);

    const dismissAlert = useCallback((id: string) => {
        // TODO: AlertsAPI.dismiss(id)
        setAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <AppContext.Provider value={{
            user, isAuthenticated: !!user,
            login, logout,
            systemStatus, toggleArmed,
            devices, alerts, unreadCount, dismissAlert,
            sidebarOpen, setSidebarOpen,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
}
