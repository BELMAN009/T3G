'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
    const { login } = useApp();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Por favor completa todos los campos.'); return; }
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Background particles */}
            <div className={styles.bg}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className={styles.particle} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                    }} />
                ))}
            </div>

            {/* Grid overlay */}
            <div className={styles.grid} />

            {/* Content */}
            <div className={styles.center}>
                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <Image src="/logo-t3g.png" alt="T3G Logo" width={70} height={70} style={{ objectFit: 'contain' }} />
                        <div className={styles.logoPulse} />
                    </div>
                    <h1 className={styles.logoTitle}>T3G</h1>
                    <p className={styles.logoSub}>Plataforma de Seguridad Inteligente</p>
                </div>

                {/* Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Iniciar Sesión</h2>

                    {error && (
                        <div className={styles.errorBox}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label>Correo Electrónico</label>
                            <input
                                className="input"
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Contraseña</label>
                            <div className={styles.passWrap}>
                                <input
                                    className="input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ paddingRight: 42 }}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className={styles.spinner} />
                            ) : 'Ingresar'}
                        </button>
                    </form>

                    <button className={styles.forgotLink}>
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <p className={styles.hint}>
                    Demo: cualquier email + contraseña
                </p>
            </div>
        </div>
    );
}
