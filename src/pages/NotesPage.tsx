import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import NoteModal from "../components/NoteModal";
import { Note } from "../types/Note";
import Button from "../components/Button";
import {
  createNote,
  deleteNote,
  getUserNotes,
  updateNote,
} from "../lib/firebase/notes";
import { useAuth } from "../hooks/useAuth";
import NoteCard from "../components/NoteCard";
import WarningModal from "../components/WarningModal";
import NoteViewerModal from "../components/NoteViewerModal";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";
import { v4 as uuidv4 } from 'uuid';

const NotesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [_notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
    setViewerOpen(true);
  };

  const handleRequestDelete = (note: Note) => {
    setNoteToDelete(note);
    setWarningOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    dispatch(
      addToast({
        message: "Note deleted successfully",
        type: "success",
        id: uuidv4(),
      })
    );
    setWarningOpen(false);
    setNoteToDelete(null);
    fetchNotes();
  };

  const fetchNotes = async () => {
    if (!user) return;
    const userNotes = await getUserNotes(user.uid);
    setNotes(userNotes);
    setFilteredNotes(userNotes);
  };

  const handleSaveNote = async (title: string, content: string) => {
    if (!user) return;

    if (editingNote) {
      await updateNote({ id: editingNote.id, title, content });
      dispatch(
        addToast({
          message: "Note updated successfully",
          type: "success",
          id: uuidv4(),
        })
      );
      setEditingNote(null);
    } else {
      await createNote({ title, content, userId: user.uid });
      dispatch(
        addToast({
          message: "Note created successfully",
          type: "success",
          id: uuidv4(),
        })
      );
    }

    setModalOpen(false);
    fetchNotes(); // refresh list
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  //TODO : will add filter functionality soon
  // const filterBy = (period: "all" | "week" | "month") => {
  //   const now = new Date();
  //   let result = notes;

  //   if (period === "week") {
  //     result = notes.filter((note) => {
  //       const createdAt = note.createdAt.toDate();
  //       return now.getTime() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;
  //     });
  //   } else if (period === "month") {
  //     result = notes.filter((note) => {
  //       const createdAt = note.createdAt.toDate();
  //       return now.getMonth() === createdAt.getMonth();
  //     });
  //   }

  //   setFilteredNotes(result);
  // };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return (
    <div className="ml-10 w-screen min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="ml-4 text-3xl font-bold text-violet-700">Your Notes</h1>
        <Button
          icon={<Plus />}
          onClick={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
        >
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEditNote}
            onDelete={handleRequestDelete}
            onView={handleViewNote}
          />
        ))}
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => {
          setEditingNote(null);
          setModalOpen(false);
        }}
        onSave={handleSaveNote}
        initialTitle={editingNote?.title || ""}
        initialContent={editingNote?.content || ""}
      />

      {/* Warning MOdal */}
      <WarningModal
        isOpen={warningOpen}
        onConfirm={confirmDelete}
        onCancel={() => setWarningOpen(false)}
        message="Are you sure you want to delete this note? This action cannot be undone."
      />

      {/* View Note */}
      <NoteViewerModal
        isOpen={viewerOpen}
        note={viewingNote}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
};

export default NotesPage;
