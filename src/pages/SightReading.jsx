import React, { useState, useEffect } from 'react';
import ScoreRenderer from '../features/sight-reading/ScoreRenderer';
import { RefreshCw } from 'lucide-react';

const NOTES = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];
const DURATIONS = ['q']; // Quarter notes for simplicity initially

export default function SightReading() {
    const [score, setScore] = useState([]);

    const generateScore = () => {
        // Generate 4 random notes
        const newScore = Array(4).fill(null).map(() => {
            const note = NOTES[Math.floor(Math.random() * NOTES.length)];
            return `${note}:q`;
        });
        setScore(newScore);
    };

    useEffect(() => {
        generateScore();
    }, []);

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Lectura a Primera Vista</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Identifica las notas que aparecen en la partitura.</p>
            </div>

            <div className="card" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                {/* VexFlow renders black text by default, so white background is safer for now */}
                <ScoreRenderer notes={score} width={400} height={150} />
            </div>

            <button className="btn-primary" onClick={generateScore} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={20} />
                Nueva Partitura
            </button>
        </div>
    );
}
