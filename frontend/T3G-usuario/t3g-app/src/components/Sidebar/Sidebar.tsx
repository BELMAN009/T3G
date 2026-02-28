'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    LayoutDashboard, Clock, Monitor, Headphones,
    Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/eventos', label: 'Eventos', icon: Clock },
    { href: '/dispositivos', label: 'Dispositivos', icon: Monitor },
    { href: '/soporte', label: 'Soporte', icon: Headphones },
    { href: '/configuracion', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
    const { user, logout, sidebarOpen, setSidebarOpen } = useApp();
    const pathname = usePathname();

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    return (
        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ''}`}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Image src="/logo-t3g.png" alt="T3G" width={32} height={32} style={{ objectFit: 'contain' }} />
                </div>
                {sidebarOpen && (
                    <div className={styles.logoText}>
                        <span className="gradient-text" style={{ fontWeight: 700, fontSize: 18 }}>T3G</span>
                    </div>
                )}
                <button
                    className={styles.collapseBtn}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? 'Colapsar' : 'Expandir'}
                >
                    {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`${styles.navItem} ${active ? styles.active : ''}`}
                            title={!sidebarOpen ? label : undefined}
                        >
                            <Icon size={18} />
                            {sidebarOpen && <span>{label}</span>}
                            {active && <div className={styles.activeBar} />}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className={styles.userSection}>
                {sidebarOpen && (
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{initials}</div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name}</span>
                            <span className={styles.userEmail}>{user?.email}</span>
                        </div>
                    </div>
                )}
                <button
                    className={styles.logoutBtn}
                    onClick={logout}
                    title="Cerrar Sesión"
                >
                    <LogOut size={16} />
                    {sidebarOpen && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    );
}
