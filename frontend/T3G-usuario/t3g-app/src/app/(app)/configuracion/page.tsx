'use client';
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_CONFIG } from '@/lib/mock-data';
import { User, Bell, Video, Shield, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import styles from './configuracion.module.css';

type Tab = 'perfil' | 'notificaciones' | 'grabacion' | 'seguridad' | 'contrasena';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'grabacion', label: 'Grabación', icon: Video },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'contrasena', label: 'Contraseña', icon: Lock },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
            role="switch"
            aria-checked={checked}
        >
            <div className={styles.toggleThumb} />
        </button>
    );
}

export default function ConfiguracionPage() {
    const { user } = useApp();
    const [tab, setTab] = useState<Tab>('perfil');
    const [config] = useState(MOCK_CONFIG);
    const [notifs, setNotifs] = useState(config.notifications);
    const [rec, setRec] = useState(config.recording);
    const [sec, setSec] = useState(config.security);
    const [saved, setSaved] = useState(false);
    const [showPass, setShowPass] = useState({ cur: false, new1: false, new2: false });

    const handleSave = () => {
        // TODO: ConfigAPI.update(...)
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const renderContent = () => {
        switch (tab) {
            case 'perfil':
                return (
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Nombre completo</label>
                            <input className="input" defaultValue={user?.name} />
                        </div>
                        <div className={styles.field}>
                            <label>Correo electrónico</label>
                            <input className="input" type="email" defaultValue={user?.email} />
                        </div>
                        <div className={styles.field}>
                            <label>Teléfono</label>
                            <input className="input" placeholder="+52 55 xxxx xxxx" />
                        </div>
                        <div className={styles.field}>
                            <label>Rol</label>
                            <input className="input" defaultValue={user?.role === 'admin' ? 'Administrador' : 'Usuario'} disabled />
                        </div>
                    </div>
                );

            case 'notificaciones':
                return (
                    <div className={styles.toggleList}>
                        {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
                            const labels: Record<string, string> = {
                                email: 'Notificaciones por correo',
                                sms: 'Notificaciones por SMS',
                                push: 'Notificaciones push',
                                motionAlerts: 'Alertas de movimiento',
                                systemAlerts: 'Alertas del sistema',
                            };
                            return (
                                <div key={key} className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>{labels[key]}</div>
                                    </div>
                                    <Toggle
                                        checked={val}
                                        onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );

            case 'grabacion':
                return (
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Calidad de grabación</label>
                            <select className="input" value={rec.quality} onChange={e => setRec(p => ({ ...p, quality: e.target.value as 'HD' | 'FHD' | '4K' }))}>
                                <option value="HD">HD (720p)</option>
                                <option value="FHD">Full HD (1080p)</option>
                                <option value="4K">4K Ultra HD</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Duración por clip (segundos)</label>
                            <input className="input" type="number" value={rec.duration} onChange={e => setRec(p => ({ ...p, duration: +e.target.value }))} min={10} max={300} />
                        </div>
                        <div className={styles.field}>
                            <label>Días de retención</label>
                            <input className="input" type="number" value={rec.retentionDays} onChange={e => setRec(p => ({ ...p, retentionDays: +e.target.value }))} min={7} max={365} />
                        </div>
                        <div className={styles.full}>
                            <div className={styles.toggleList}>
                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Grabación continua</div>
                                        <div className={styles.toggleSub}>Graba ininterrumpidamente las 24 horas</div>
                                    </div>
                                    <Toggle checked={rec.continuous} onChange={v => setRec(p => ({ ...p, continuous: v }))} />
                                </div>
                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Solo al detectar movimiento</div>
                                        <div className={styles.toggleSub}>Ahorra espacio de almacenamiento</div>
                                    </div>
                                    <Toggle checked={rec.motionOnly} onChange={v => setRec(p => ({ ...p, motionOnly: v }))} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'seguridad':
                return (
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Retardo de entrada (segundos)</label>
                            <input className="input" type="number" value={sec.entryDelay} onChange={e => setSec(p => ({ ...p, entryDelay: +e.target.value }))} min={0} max={120} />
                        </div>
                        <div className={styles.field}>
                            <label>Retardo de salida (segundos)</label>
                            <input className="input" type="number" value={sec.exitDelay} onChange={e => setSec(p => ({ ...p, exitDelay: +e.target.value }))} min={0} max={120} />
                        </div>
                        <div className={styles.field}>
                            <label>Duración de alarma (segundos)</label>
                            <input className="input" type="number" value={sec.alarmDuration} onChange={e => setSec(p => ({ ...p, alarmDuration: +e.target.value }))} min={30} max={600} />
                        </div>
                        <div className={styles.full}>
                            <div className={styles.zonesTitle}>Zonas</div>
                            <div className={styles.zones}>
                                {sec.zones.map(zone => (
                                    <div key={zone.id} className={styles.zoneRow}>
                                        <span className={styles.zoneName}>{zone.name}</span>
                                        <span className={`badge ${zone.armed ? 'badge-online' : 'badge-offline'}`}>
                                            {zone.armed ? 'Armada' : 'Desarmada'}
                                        </span>
                                        <Toggle
                                            checked={zone.armed}
                                            onChange={v => setSec(p => ({ ...p, zones: p.zones.map(z => z.id === zone.id ? { ...z, armed: v } : z) }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'contrasena':
                return (
                    <div className={styles.formGrid} style={{ maxWidth: 400 }}>
                        {(['cur', 'new1', 'new2'] as const).map((k, i) => {
                            const labels = ['Contraseña Actual', 'Nueva Contraseña', 'Confirmar Nueva Contraseña'];
                            return (
                                <div key={k} className={styles.field}>
                                    <label>{labels[i]}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="input"
                                            type={showPass[k] ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            style={{ paddingRight: 40 }}
                                        />
                                        <button
                                            type="button"
                                            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                                            onClick={() => setShowPass(p => ({ ...p, [k]: !p[k] }))}
                                        >
                                            {showPass[k] ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configuración</h1>
            </div>

            <div className={styles.layout}>
                {/* Tabs sidebar */}
                <div className={styles.tabs}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`${styles.tabBtn} ${tab === id ? styles.tabActive : ''}`}
                            onClick={() => setTab(id)}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`card ${styles.content}`}>
                    <div className={styles.contentHeader}>
                        <h2 className={styles.contentTitle}>
                            {TABS.find(t => t.id === tab)?.label}
                        </h2>
                        {saved && (
                            <div className={styles.savedMsg}>
                                <CheckCircle size={14} /> Guardado
                            </div>
                        )}
                    </div>
                    {renderContent()}
                    <div className={styles.actions}>
                        <button className="btn btn-ghost">Cancelar</button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            <Save size={15} /> Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
