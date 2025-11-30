import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Play, RotateCcw, Check, Trash2, Music, Settings } from 'lucide-react';

const SCALE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

const LEVELS = {
    low: { label: 'Baja', length: 4, color: '#22c55e' },
    medium: { label: 'Media', length: 6, color: '#eab308' },
    high: { label: 'Alta', length: 8, color: '#ef4444' }
};

const getSolfege = (note) => {
    const map = {
        'C': 'Do',
        'D': 'Re',
        'E': 'Mi',
        'F': 'Fa',
        'G': 'Sol',
        'A': 'La',
        'B': 'Si'
    };
    return map[note.charAt(0)] || note;
};

export default function DictationGame() {
    const [started, setStarted] = useState(false);
    const [difficulty, setDifficulty] = useState('low'); // 'low', 'medium', 'high'
    const [targetMelody, setTargetMelody] = useState([]);
    const [userMelody, setUserMelody] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
    const [isLoaded, setIsLoaded] = useState(false);
    const synthRef = useRef(null);

    useEffect(() => {
        const sampler = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                "A4": "A4.mp3",
                "C5": "C5.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            onload: () => {
                setIsLoaded(true);
            }
        }).toDestination();

        synthRef.current = sampler;

        return () => {
            if (synthRef.current) synthRef.current.dispose();
        };
    }, []);

    const startAudio = async (level) => {
        await Tone.start();
        if (!isLoaded) return;
        setDifficulty(level);
        setStarted(true);
        generateNewMelody(LEVELS[level].length);
    };

    const generateNewMelody = (length = LEVELS[difficulty].length) => {
        const newMelody = Array(length).fill(null).map(() =>
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
        const currentLength = LEVELS[difficulty].length;
        if (userMelody.length < currentLength && !feedback) {
            playNote(note);
            setUserMelody([...userMelody, note]);
        }
    };

    const checkAnswer = () => {
        const currentLength = LEVELS[difficulty].length;
        if (userMelody.length !== currentLength) return;

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

    const changeLevel = () => {
        setStarted(false);
        setFeedback(null);
        setUserMelody([]);
    };

    if (!started) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ marginBottom: '2rem' }}>Selecciona la Dificultad</h1>
                {!isLoaded ? (
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Cargando sonidos de piano...
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {Object.entries(LEVELS).map(([key, config]) => (
                            <button
                                key={key}
                                className="btn-primary"
                                onClick={() => startAudio(key)}
                                style={{
                                    fontSize: '1.2rem',
                                    padding: '1rem 2rem',
                                    backgroundColor: config.color,
                                    borderColor: config.color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>{config.label}</span>
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>({config.length} notas)</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const currentLength = LEVELS[difficulty].length;

    return (
        <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={changeLevel}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Settings size={20} />
                    <span style={{ fontSize: '0.9rem' }}>Nivel: {LEVELS[difficulty].label}</span>
                </button>
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

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {Array(currentLength).fill(null).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '40px',
                                height: '40px',
                                border: '2px solid var(--accent)',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
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
                            {userMelody[i] ? getSolfege(userMelody[i]) : ''}
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
                        disabled={!!feedback || userMelody.length >= currentLength}
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
                        {getSolfege(note)}
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
                        disabled={userMelody.length !== currentLength}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: userMelody.length !== currentLength ? 0.5 : 1 }}
                    >
                        <Check size={20} /> Comprobar
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={() => generateNewMelody()}
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
