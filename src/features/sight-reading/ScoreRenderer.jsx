import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

const ScoreRenderer = ({ notes = [], width = 500, height = 200 }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);

        renderer.resize(width, height);
        const context = renderer.getContext();

        // Create a stave at position 10, 40 of width 400 on the canvas.
        const stave = new Stave(10, 40, width - 20);

        // Add a clef and time signature.
        stave.addClef("treble").addTimeSignature("4/4");

        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();

        if (notes.length > 0) {
            // Create a voice in 4/4 and add notes
            const voice = new Voice({ num_beats: 4, beat_value: 4 });

            // Map simple note strings to VexFlow StaveNotes
            // Example input: ["c/4", "d/4", "e/4", "f/4"]
            const vfNotes = notes.map(note => {
                const [key, rawDuration] = note.split(':'); // Expect format "c/4:q" (key:duration)
                const duration = rawDuration ? rawDuration.trim() : "q";
                return new StaveNote({ clef: "treble", keys: [key], duration: duration });
            });

            voice.addTickables(vfNotes);

            // Format and justify the notes to 400 pixels.
            new Formatter().joinVoices([voice]).format([voice], width - 50);

            // Render voice
            voice.draw(context, stave);
        }
    }, [notes, width, height]);

    return <div ref={containerRef} />;
};

export default ScoreRenderer;
