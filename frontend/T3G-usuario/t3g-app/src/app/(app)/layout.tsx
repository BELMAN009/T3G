'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './app-shell.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className={styles.shell}>
            <Sidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
