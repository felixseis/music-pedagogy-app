import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, RotateCcw, Check, Trash2, Music } from 'lucide-react';

const SCALE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const MELODY_LENGTH = 4;

export default function DictationGame() {
    const [started, setStarted] = useState(false);
    const [targetMelody, setTargetMelody] = useState([]);
    const [userMelody, setUserMelody] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
    const synthRef = useRef(null);

    useEffect(() => {
        synthRef.current = new Tone.Synth().toDestination();
        return () => {
            if (synthRef.current) synthRef.current.dispose();
        };
    }, []);

    const startAudio = async () => {
        await Tone.start();
        setStarted(true);
        generateNewMelody();
    };

    const generateNewMelody = () => {
        const newMelody = Array(MELODY_LENGTH).fill(null).map(() =>
            SCALE[Math.floor(Math.random() * SCALE.length)]
        );
        setTargetMelody(newMelody);
        setUserMelody([]);
        setFeedback(null);
        setTimeout(() => playMelody(newMelody), 500);
    };

    const playMelody = (melody) => {
        const now = Tone.now();
        melody.forEach((note, index) => {
            synthRef.current.triggerAttackRelease(note, "8n", now + index * 0.5);
        });
    };

    const playNote = (note) => {
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease(note, "8n");
        }
    };

    const handleNoteInput = (note) => {
        if (userMelody.length < MELODY_LENGTH && !feedback) {
            playNote(note);
            setUserMelody([...userMelody, note]);
        }
    };

    const checkAnswer = () => {
        if (userMelody.length !== MELODY_LENGTH) return;

        const isCorrect = userMelody.every((note, index) => note === targetMelody[index]);
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            // Play success sound or visual cue
        }
    };

    const clearInput = () => {
        setUserMelody([]);
        setFeedback(null);
    };

    if (!started) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <button className="btn-primary" onClick={startAudio} style={{ fontSize: '1.5rem', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 auto' }}>
                    <Play size={32} />
                    Comenzar Dictado
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Dictado Musical</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Escucha la melodía y repítela.</p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => playMelody(targetMelody)}
                    style={{ borderRadius: '50%', width: '64px', height: '64px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Music size={32} />
                </button>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Repetir Melodía</span>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    {Array(MELODY_LENGTH).fill(null).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '50px',
                                height: '50px',
                                border: '2px solid var(--accent)',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                backgroundColor:
                                    feedback === 'correct' ? 'rgba(16, 185, 129, 0.2)' :
                                        feedback === 'incorrect' && userMelody[i] !== targetMelody[i] ? 'rgba(239, 68, 68, 0.2)' :
                                            'transparent',
                                borderColor:
                                    feedback === 'correct' ? 'var(--success)' :
                                        feedback === 'incorrect' ? 'var(--error)' :
                                            'var(--accent)'
                            }}
                        >
                            {userMelody[i] ? userMelody[i].replace(/\d/, '') : ''}
                        </div>
                    ))}
                </div>
            </div>

            {/* Virtual Piano / Note Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SCALE.map((note) => (
                    <button
                        key={note}
                        onClick={() => handleNoteInput(note)}
                        disabled={!!feedback || userMelody.length >= MELODY_LENGTH}
                        style={{
                            width: '50px',
                            height: '120px',
                            backgroundColor: note.includes('#') ? '#1e293b' : 'white',
                            color: note.includes('#') ? 'white' : '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0 0 4px 4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '1rem',
                            fontWeight: 'bold',
                            position: 'relative',
                            marginTop: note.includes('#') ? '-40px' : '0', // Simple visual hack for black keys if we were doing a real piano, but here just buttons
                            zIndex: note.includes('#') ? 2 : 1
                        }}
                    >
                        {note.replace(/\d/, '')}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={clearInput}
                    disabled={userMelody.length === 0 || !!feedback}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--text-secondary)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Trash2 size={20} /> Borrar
                </button>

                {!feedback ? (
                    <button
                        className="btn-primary"
                        onClick={checkAnswer}
                        disabled={userMelody.length !== MELODY_LENGTH}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: userMelody.length !== MELODY_LENGTH ? 0.5 : 1 }}
                    >
                        <Check size={20} /> Comprobar
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={generateNewMelody}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <RotateCcw size={20} /> Siguiente Melodía
                    </button>
                )}
            </div>

            {feedback && (
                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: feedback === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: feedback === 'correct' ? 'var(--success)' : 'var(--error)',
                    fontWeight: 'bold'
                }}>
                    {feedback === 'correct' ? '¡Correcto! Has reproducido la melodía.' : 'Incorrecto. Inténtalo de nuevo.'}
                </div>
            )}
        </div>
    );
}
