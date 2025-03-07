import "../styles/Notes.css";
import { useState, useEffect } from "react";

function Note({ note, onUpdate, onDelete }) {
    const handleTitleChange = (e) => {
        onUpdate(note.id, e.target.value, "title");
    };

    const handleContentChange = (e) => {
        onUpdate(note.id, e.target.value, "content");
    };

    return (
        <div className="note-card">
            {/* Title Textarea */}
            <textarea
                rows="1"
                placeholder="Title"
                value={note.title}
                className="note-title"
                onChange={handleTitleChange}
                onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content height
                }}
            />
            <hr />
            {/* Content Textarea */}
            <textarea
                rows="1"
                placeholder="Content..."
                value={note.content}
                className="note-content"
                onChange={handleContentChange}
                onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content height
                }}
            />
            {/* Delete Button */}
            <button
                onClick={() => onDelete(note.id)}
                aria-label="Delete Note"
                id="delete-btn"
            >
                <img
                    id="trash-icon"
                    src="../public/icons8-trash(1).svg"
                    alt="Delete icon"
                />
            </button>
        </div>
    );
}

function CreateNote({ onAddNote }) {
    return (
        <header className="create-note-head">
            <h1>New Note</h1>
            <button className="create-note-btn" onClick={onAddNote}>
                +
            </button>
        </header>
    );
}

export default function NoteContainer() {
    const [notes, setNotes] = useState(() => {
        // Load notes from localStorage on initial render
        try {
            const storedNotes = localStorage.getItem("notes");
            return storedNotes ? JSON.parse(storedNotes) : []; // Default to an empty array if none exist
        } catch (error) {
            console.error("Error loading notes from localStorage:", error);
            return [];
        }
    });

    const addNote = () => {
        const newNote = {
            id: Date.now(),
            title: "",
            content: "",
        };
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };

    const updateNote = (id, newValue, field) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, [field]: newValue } : note
            )
        );
    };

    // Save notes to localStorage whenever notes change
    useEffect(() => {
        try {
            localStorage.setItem("notes", JSON.stringify(notes));
        } catch (error) {
            console.error("Error saving notes to localStorage:", error);
        }
    }, [notes]);

    return (
        <>
            <CreateNote onAddNote={addNote} />
            <div className="notes-container">
                {notes.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        onUpdate={updateNote}
                        onDelete={() => deleteNote(note.id)}
                    />
                ))}
            </div>
        </>
    );
}
