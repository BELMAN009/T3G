'use client';
import React, { useState } from 'react';
import { Maximize2, Camera, WifiOff } from 'lucide-react';
import styles from './CameraFeed.module.css';

interface CameraFeedProps {
    id: string;
    name: string;
    subtitle?: string;
    status: 'online' | 'offline' | 'warning';
    large?: boolean;
    onClick?: () => void;
}

export default function CameraFeed({ id, name, subtitle, status, large, onClick }: CameraFeedProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isOnline = status === 'online' || status === 'warning';

    return (
        <div
            className={`${styles.feed} ${large ? styles.large : ''} ${isOnline ? styles.online : styles.offline}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {/* Feed Area */}
            <div className={styles.feedArea}>
                {isOnline ? (
                    <>
                        {/* Simulated camera view */}
                        <div className={styles.cameraPlaceholder}>
                            {/* Scan line animation */}
                            <div className={styles.scanLine} />
                            {/* Grid overlay */}
                            <div className={styles.gridOverlay} />
                            <div className={styles.cameraIcon}>
                                <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" opacity="0.3">
                                    <polygon points="0,0 40,20 0,40" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <line x1="40" y1="20" x2="60" y2="10" stroke="currentColor" strokeWidth="2" />
                                    <line x1="40" y1="20" x2="60" y2="30" stroke="currentColor" strokeWidth="2" />
                                    <line x1="60" y1="10" x2="60" y2="30" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            {/* Corner brackets */}
                            <div className={`${styles.corner} ${styles.topLeft}`} />
                            <div className={`${styles.corner} ${styles.topRight}`} />
                            <div className={`${styles.corner} ${styles.bottomLeft}`} />
                            <div className={`${styles.corner} ${styles.bottomRight}`} />
                        </div>

                        {/* LIVE Badge */}
                        <div className={styles.liveBadge}>
                            <div className={styles.liveDot} />
                            <span>LIVE</span>
                        </div>

                        {/* Timestamp */}
                        <div className={styles.timestamp}>
                            {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </>
                ) : (
                    <div className={styles.offlineState}>
                        <WifiOff size={24} />
                        <span>Sin señal</span>
                    </div>
                )}

                {/* Hover overlay */}
                {isHovered && onClick && (
                    <div className={styles.hoverOverlay}>
                        <div className={styles.hoverBtn}>
                            <Maximize2 size={18} />
                            <span>Ver pantalla completa</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <div>
                    <div className={styles.cameraName}>{name}</div>
                    {subtitle && <div className={styles.cameraSubtitle}>{subtitle}</div>}
                </div>
                <div className={styles.statusDot} data-online={isOnline} />
            </div>
        </div>
    );
}
