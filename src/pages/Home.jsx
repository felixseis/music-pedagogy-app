import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Eye, Ear } from 'lucide-react';

export default function Home() {
    return (
        <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
                Aprende Música <span style={{ color: 'var(--accent)' }}>Interactivamente</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <Link to="/sight-reading" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                        <Eye size={48} color="var(--accent)" />
                        <h2>Lectura a Primera Vista</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Practica tu lectura musical con partituras generadas aleatoriamente.</p>
                    </div>
                </Link>

                <Link to="/intervals" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                        <Music size={48} color="var(--accent)" />
                        <h2>Identificador de Intervalos</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Entrena tu oído identificando la distancia entre notas.</p>
                    </div>
                </Link>

                <Link to="/dictation" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                        <Ear size={48} color="var(--accent)" />
                        <h2>Dictado Musical</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Escucha melodías y transcríbelas nota por nota.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
