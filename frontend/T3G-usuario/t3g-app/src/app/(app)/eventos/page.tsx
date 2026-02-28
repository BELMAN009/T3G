'use client';
import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info, Video, Filter, Search } from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/mock-data';
import { Event } from '@/lib/api';
import styles from './eventos.module.css';

export default function EventosPage() {
    const [dateFilter, setDateFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [deviceFilter, setDeviceFilter] = useState('');

    const filtered = useMemo(() => {
        return MOCK_EVENTS.filter(e => {
            if (dateFilter && !e.timestamp.includes(dateFilter)) return false;
            if (typeFilter && e.type !== typeFilter) return false;
            if (deviceFilter && !e.device.toLowerCase().includes(deviceFilter.toLowerCase())) return false;
            return true;
        });
    }, [dateFilter, typeFilter, deviceFilter]);

    const typeIcon = (type: Event['type']) => {
        if (type === 'alert') return <AlertTriangle size={14} />;
        if (type === 'system') return <CheckCircle size={14} />;
        return <Info size={14} />;
    };

    const typeLabel = (type: Event['type']) => {
        if (type === 'alert') return 'Alerta';
        if (type === 'system') return 'Sistema';
        return 'Info';
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Historial de Eventos</h1>
                <div className={styles.total}>{filtered.length} eventos</div>
            </div>

            {/* Filters */}
            <div className={`card ${styles.filters}`}>
                <div className={styles.filtersTitle}>
                    <Filter size={16} />
                    <span>Filtros</span>
                </div>
                <div className={styles.filtersRow}>
                    <div className={styles.filterField}>
                        <label>Fecha</label>
                        <input
                            className="input"
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterField}>
                        <label>Tipo de Evento</label>
                        <select
                            className="input"
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="alert">Alerta</option>
                            <option value="system">Sistema</option>
                            <option value="info">Info</option>
                        </select>
                    </div>
                    <div className={styles.filterField}>
                        <label>Dispositivo</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="input"
                                placeholder="Buscar dispositivo..."
                                value={deviceFilter}
                                onChange={e => setDeviceFilter(e.target.value)}
                                style={{ paddingLeft: 36 }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    {(dateFilter || typeFilter || deviceFilter) && (
                        <button
                            className="btn btn-ghost"
                            style={{ alignSelf: 'flex-end' }}
                            onClick={() => { setDateFilter(''); setTypeFilter(''); setDeviceFilter(''); }}
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className={`card ${styles.tableWrap}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Dispositivo</th>
                            <th>Fecha y Hora</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className={styles.empty}>
                                    No se encontraron eventos con los filtros seleccionados
                                </td>
                            </tr>
                        ) : (
                            filtered.map(event => (
                                <tr key={event.id} className={styles.row}>
                                    <td>
                                        <span className={`${styles.typeBadge} ${event.type === 'alert' ? styles.typeAlert :
                                                event.type === 'system' ? styles.typeSystem : styles.typeInfo
                                            }`}>
                                            {typeIcon(event.type)}
                                            {typeLabel(event.type)}
                                        </span>
                                    </td>
                                    <td className={styles.desc}>{event.description}</td>
                                    <td className={styles.device}>{event.device}</td>
                                    <td className={styles.time}>
                                        {new Date(event.timestamp).toLocaleDateString('es-MX')}{' '}
                                        <span style={{ color: 'var(--text-muted)' }}>
                                            {new Date(event.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </td>
                                    <td>
                                        {event.hasRecording && (
                                            <button className={`btn btn-ghost ${styles.recordingBtn}`}>
                                                <Video size={14} />
                                                Ver Grabación
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
