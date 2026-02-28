'use client';
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Camera, Radio, Bell, DoorOpen, Plus, MoreVertical, Edit, Trash2, Wifi, WifiOff, X } from 'lucide-react';
import { Device } from '@/lib/api';
import styles from './dispositivos.module.css';

const DeviceIcon = ({ type }: { type: Device['type'] }) => {
    const props = { size: 22, className: styles.deviceTypeIcon };
    if (type === 'camera') return <Camera {...props} />;
    if (type === 'sensor') return <Radio {...props} />;
    if (type === 'alarm') return <Bell {...props} />;
    return <DoorOpen {...props} />;
};

export default function DispositivosPage() {
    const { devices } = useApp();
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [addModal, setAddModal] = useState(false);

    const getStatusClass = (s: Device['status']) =>
        s === 'online' ? styles.statusOnline :
            s === 'offline' ? styles.statusOffline : styles.statusWarning;

    const getStatusLabel = (s: Device['status']) =>
        s === 'online' ? 'En Línea' : s === 'offline' ? 'Offline' : 'Batería Baja';

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mis Dispositivos</h1>
                    <p className={styles.subtitle}>{devices.filter(d => d.status === 'online').length} de {devices.length} en línea</p>
                </div>
                <button className="btn btn-primary" onClick={() => setAddModal(true)}>
                    <Plus size={16} /> Añadir Dispositivo
                </button>
            </div>

            <div className={styles.grid}>
                {devices.map(device => (
                    <div key={device.id} className={`card ${styles.deviceCard}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrap}>
                                <DeviceIcon type={device.type} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <button
                                    className={styles.menuBtn}
                                    onClick={() => setMenuOpen(menuOpen === device.id ? null : device.id)}
                                >
                                    <MoreVertical size={16} />
                                </button>
                                {menuOpen === device.id && (
                                    <div className={styles.dropdown}>
                                        <button className={styles.dropItem} onClick={() => setMenuOpen(null)}>
                                            <Edit size={13} /> Editar
                                        </button>
                                        <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={() => setMenuOpen(null)}>
                                            <Trash2 size={13} /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.deviceName}>{device.name}</div>
                            <div className={styles.deviceLocation}>{device.zone === 'exterior' ? 'Exterior' : 'Interior'}</div>
                            {device.resolution && <div className={styles.deviceMeta}>{device.resolution}</div>}
                            {device.model && <div className={styles.deviceMeta}>{device.model}</div>}
                            {device.ip && <div className={styles.deviceMeta}>{device.ip}</div>}
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={`${styles.statusBadge} ${getStatusClass(device.status)}`}>
                                {device.status === 'online' ? <Wifi size={11} /> : <WifiOff size={11} />}
                                {device.status === 'warning' && device.batteryLevel !== undefined
                                    ? `Batería ${device.batteryLevel}%`
                                    : getStatusLabel(device.status)}
                            </span>
                            {device.type === 'camera' && (
                                <button className={`btn btn-ghost ${styles.streamBtn}`}>
                                    Ver Stream
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Device Modal */}
            {addModal && (
                <div className="modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Añadir Dispositivo</h2>
                            <button className="btn btn-ghost" onClick={() => setAddModal(false)} style={{ padding: '6px 10px' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Nombre del Dispositivo</label>
                                <input className="input" placeholder="Ej: Cámara Patio" />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Tipo</label>
                                <select className="input">
                                    <option>Cámara</option>
                                    <option>Sensor</option>
                                    <option>Alarma</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Zona</label>
                                <select className="input">
                                    <option>Exterior</option>
                                    <option>Interior</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Dirección IP</label>
                                <input className="input" placeholder="192.168.1.x" />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAddModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAddModal(false)}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
