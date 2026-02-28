'use client';
import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Ticket, Send } from 'lucide-react';
import styles from './soporte.module.css';

const FAQ_ITEMS = [
    {
        q: '¿Cómo armo mi sistema de seguridad?',
        a: 'Ve al Dashboard y presiona el botón "Armar Sistema" en la parte superior derecha. El sistema se activará en el tiempo de retardo configurado.',
    },
    {
        q: '¿Qué hago si un dispositivo aparece offline?',
        a: 'Verifica la conexión de red del dispositivo. Si el problema persiste, intenta reiniciarlo desde la sección Dispositivos presionando el menú de opciones.',
    },
    {
        q: '¿Cómo puedo ver las grabaciones antiguas?',
        a: 'En la sección de Eventos, puedes filtrar por fecha y dispositivo. Los eventos con grabación tienen el botón "Ver Grabación" disponible.',
    },
    {
        q: '¿Cuánto tiempo se almacenan las grabaciones?',
        a: 'Por defecto se almacenan 30 días. Puedes configurar este periodo en Configuración > Grabación > Días de retención.',
    },
    {
        q: '¿Cómo añado más usuarios a mi cuenta?',
        a: 'Ve a Configuración > Usuarios y presiona "Añadir Usuario". Ingresa el correo y rol del nuevo usuario.',
    },
    {
        q: '¿Puedo recibir alertas en mi teléfono?',
        a: 'Sí. En Configuración > Notificaciones puedes activar notificaciones push, SMS y correo electrónico.',
    },
];

export default function SoportePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: SupportAPI.submitTicket({ subject, category, description })
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setSubject(''); setCategory(''); setDescription('');
        }, 3000);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ayuda y Soporte</h1>
            </div>

            <div className={styles.grid}>
                {/* FAQ */}
                <div className={styles.faqSection}>
                    <div className={`card ${styles.faqCard}`}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}><MessageCircle size={18} /></div>
                            <span>Preguntas Frecuentes</span>
                        </div>
                        <div className={styles.faqList}>
                            {FAQ_ITEMS.map((item, i) => (
                                <div key={i} className={styles.faqItem}>
                                    <button
                                        className={styles.faqQuestion}
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`${styles.faqChevron} ${openFaq === i ? styles.open : ''}`}
                                        />
                                    </button>
                                    {openFaq === i && (
                                        <div className={styles.faqAnswer}>
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className={styles.rightCol}>
                    {/* Live chat */}
                    <div className={`card ${styles.chatCard}`}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}><MessageCircle size={18} /></div>
                            <span>Chat en Vivo</span>
                        </div>
                        <p className={styles.chatDesc}>
                            ¿Necesitas ayuda inmediata? Nuestro equipo está disponible para asistirte.
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                            Iniciar Chat
                        </button>
                        <p className={styles.chatHours}>Horario: Lunes a Viernes 9:00 - 18:00</p>
                    </div>

                    {/* Ticket */}
                    <div className={`card ${styles.ticketCard}`}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}><Ticket size={18} /></div>
                            <span>Ticket de Soporte</span>
                        </div>
                        <p className={styles.chatDesc}>
                            ¿Tienes un problema específico? Envíanos un ticket y te responderemos en menos de 24 horas.
                        </p>

                        {sent ? (
                            <div className={styles.successMsg}>
                                ✅ Ticket enviado correctamente. Te contactaremos pronto.
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className={styles.ticketForm}>
                                <div>
                                    <label>Asunto</label>
                                    <input
                                        className="input"
                                        placeholder="Describe brevemente tu problema"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Categoría</label>
                                    <select
                                        className="input"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        <option>Dispositivo</option>
                                        <option>Grabaciones</option>
                                        <option>Conectividad</option>
                                        <option>Facturación</option>
                                        <option>Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Descripción</label>
                                    <textarea
                                        className="input"
                                        placeholder="Describe tu problema en detalle"
                                        rows={4}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        required
                                        style={{ resize: 'vertical', minHeight: 90 }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                                    <Send size={15} /> Enviar Ticket
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
