'use client';
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import CameraFeed from '@/components/CameraFeed/CameraFeed';
import {
    Shield, ShieldOff, AlertTriangle, CheckCircle, Info,
    Maximize2, X
} from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/mock-data';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { systemStatus, toggleArmed, devices, alerts } = useApp();
    const cameras = devices.filter(d => d.type === 'camera');
    const [fullscreen, setFullscreen] = useState<string | null>(null);
    const [arming, setArming] = useState(false);

    const handleToggle = async () => {
        setArming(true);
        await new Promise(r => setTimeout(r, 600));
        toggleArmed();
        setArming(false);
    };

    const recentAlerts = MOCK_EVENTS.slice(0, 5);

    const alertIcon = (type: string) => {
        if (type === 'alert') return <AlertTriangle size={14} className={styles.iconAlert} />;
        if (type === 'system') return <CheckCircle size={14} className={styles.iconSystem} />;
        return <Info size={14} className={styles.iconInfo} />;
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard de Monitoreo</h1>
                    <p className={styles.subtitle}>
                        {systemStatus.devicesOnline} de {systemStatus.devicesTotal} dispositivos en línea
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={`btn ${systemStatus.armed ? 'btn-danger' : 'btn-success'}`}
                        onClick={handleToggle}
                        disabled={arming}
                    >
                        {arming ? (
                            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        ) : systemStatus.armed ? (
                            <><ShieldOff size={16} /> Desarmar Sistema</>
                        ) : (
                            <><Shield size={16} /> Armar Sistema</>
                        )}
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Left - Cameras */}
                <div className={styles.camerasSection}>
                    {/* Main camera */}
                    {cameras[0] && (
                        <div className={styles.mainCamera}>
                            <CameraFeed
                                id={cameras[0].id}
                                name={cameras[0].name}
                                subtitle={`Cámara 1 · ${cameras[0].resolution}`}
                                status={cameras[0].status}
                                large
                                onClick={() => setFullscreen(cameras[0].id)}
                            />
                        </div>
                    )}

                    {/* Secondary cameras */}
                    <div className={styles.secondaryGrid}>
                        {cameras.slice(1, 5).map((cam, i) => (
                            <CameraFeed
                                key={cam.id}
                                id={cam.id}
                                name={cam.name}
                                subtitle={`Cámara ${i + 2}`}
                                status={cam.status}
                                onClick={() => setFullscreen(cam.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right - Status Panel */}
                <div className={styles.sidePanel}>
                    {/* System Status */}
                    <div className={`card ${styles.statusCard}`}>
                        <div className={styles.statusHeader}>
                            <span className={styles.statusLabel}>Estado del Sistema</span>
                            <Shield size={18} className={systemStatus.armed ? styles.iconArmed : styles.iconDisarmed} />
                        </div>
                        <div className={styles.statusRow}>
                            <span className={styles.statusKey}>Estado Actual</span>
                            <span className={systemStatus.armed ? styles.armed : styles.disarmed}>
                                {systemStatus.armed ? 'Sistema Armado' : 'Sistema Desarmado'}
                            </span>
                        </div>
                        <div className={styles.statusRow}>
                            <span className={styles.statusKey}>Dispositivos</span>
                            <div>
                                <div className={styles.devCount}>
                                    {systemStatus.devicesOnline} de {systemStatus.devicesTotal}
                                </div>
                                <div className={styles.devLabel}>Online</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className={`card ${styles.alertsCard}`}>
                        <div className={styles.alertsHeader}>
                            <span>Alertas Recientes</span>
                            <span className={styles.alertsBadge}>{alerts.filter(a => !a.read).length}</span>
                        </div>
                        <div className={styles.alertsList}>
                            {recentAlerts.map(event => (
                                <div key={event.id} className={styles.alertItem}>
                                    <div className={`${styles.alertIconWrap} ${event.type === 'alert' ? styles.alertTypeAlert :
                                            event.type === 'system' ? styles.alertTypeSystem : styles.alertTypeInfo
                                        }`}>
                                        {alertIcon(event.type)}
                                    </div>
                                    <div className={styles.alertBody}>
                                        <div className={styles.alertMsg}>{event.description}</div>
                                        <div className={styles.alertMeta}>
                                            {event.device} · {new Date(event.timestamp).toLocaleString('es-MX', {
                                                month: '2-digit', day: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen modal */}
            {fullscreen && (
                <div className="modal-overlay" onClick={() => setFullscreen(null)}>
                    <div style={{ width: '90vw', maxWidth: 900 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {cameras.find(c => c.id === fullscreen)?.name}
                            </span>
                            <button className="btn btn-ghost" onClick={() => setFullscreen(null)} style={{ padding: '6px 10px' }}>
                                <X size={16} />
                            </button>
                        </div>
                        {cameras.find(c => c.id === fullscreen) && (
                            <CameraFeed
                                id={fullscreen}
                                name={cameras.find(c => c.id === fullscreen)!.name}
                                subtitle={cameras.find(c => c.id === fullscreen)!.resolution}
                                status={cameras.find(c => c.id === fullscreen)!.status}
                                large
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
