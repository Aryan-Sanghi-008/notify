import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import NoteModal from "../components/NoteModal";
import { Note } from "../types/Note";
import Button from "../components/Button";
import {
  createNote,
  getUserNotes,
  softDeleteNote,
  updateNote,
} from "../lib/firebase/notes";
import { useAuth } from "../hooks/useAuth";
import NoteCard from "../components/NoteCard";
import WarningModal from "../components/WarningModal";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";
import { v4 as uuidv4 } from "uuid";
import { FaStickyNote } from "react-icons/fa";
import { NoteViewerModal } from "../components/NoteViewerModal";
import { hideLoader, showLoader } from "../store/slices/loaderSlice";
import SearchBar from "../components/SearchBar";
import { addNotification } from "../store/slices/notificationSlice";

const NotesPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    await softDeleteNote(noteToDelete.id);
    dispatch(
      addToast({
        message: "Note deleted successfully",
        type: "success",
        id: uuidv4(),
      })
    );
    dispatch(
      addNotification({
        message: `You've deleted note "${noteToDelete.title}"`,
        type: "delete",
        noteId: noteToDelete.id,
      })
    );
    setWarningOpen(false);
    setNoteToDelete(null);
    fetchNotes();
  };

  const fetchNotes = async () => {
    try {
      dispatch(showLoader());
      if (!user) return;
      const userNotes = await getUserNotes(user.uid);
      const sortedNotes = userNotes.sort(sortNotes);
      setNotes(sortedNotes);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSaveNote = async (
    title: string,
    content: string,
    additionalData?: {
      photoURL?: string;
      tags?: string[];
      color?: string;
      reminder?: Date | null;
    }
  ) => {
    if (!user) return;

    if (editingNote) {
      await updateNote(editingNote.id, {
        title,
        content,
        photoURL: additionalData?.photoURL || null,
        ...additionalData,
      });
      dispatch(
        addToast({
          message: "Note updated successfully",
          type: "success",
          id: uuidv4(),
        })
      );
      dispatch(
        addNotification({
          message: `You've
           updated
           note "${editingNote.title}"`,
          type: "update",
          noteId: editingNote?.id,
        })
      );
      setEditingNote(null);
    } else {
      await createNote({
        title,
        content,
        userId: user.uid,
        ...additionalData,
      });
      dispatch(
        addToast({
          message: "Note created successfully",
          type: "success",
          id: uuidv4(),
        })
      );
      dispatch(
        addNotification({
          message: `You've created
           note "${title}"`,
          type: "update",
          noteId: uuidv4(),
        })
      );
    }

    setModalOpen(false);
    fetchNotes();
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const sortNotes = (a: Note, b: Note) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Favorites next
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // Then by last modified
    return b.updatedAt.toMillis() - a.updatedAt.toMillis();
  };

  const handleToggleFavorite = async (note: Note) => {
    const newFavoriteState = !note.isFavorite;
    await updateNote(note.id, { isFavorite: newFavoriteState });

    dispatch(
      addToast({
        message: newFavoriteState
          ? "Note added to favorites ★"
          : "Note removed from favorites",
        type: newFavoriteState ? "success" : "info",
        id: uuidv4(),
      })
    );

    setNotes((prevNotes) =>
      prevNotes
        .map((n) =>
          n.id === note.id ? { ...n, isFavorite: newFavoriteState } : n
        )
        .sort(sortNotes)
    );
  };

  const handleTogglePin = async (note: Note) => {
    const newPinState = !note.isPinned;
    await updateNote(note.id, { isPinned: newPinState });

    dispatch(
      addToast({
        message: newPinState ? "Note pinned to top 📌" : "Note unpinned",
        type: newPinState ? "success" : "info",
        id: uuidv4(),
      })
    );

    setNotes((prevNotes) =>
      prevNotes
        .map((n) => (n.id === note.id ? { ...n, isPinned: newPinState } : n))
        .sort(sortNotes)
    );
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;

    const searchLower = searchQuery.toLowerCase();

    return notes
      .filter(
        (note) =>
          // Include if pinned/favorite OR matches search
          note.isPinned ||
          note.isFavorite ||
          note.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => {
        // Maintain sorting priority even in search results
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return b.updatedAt.toMillis() - a.updatedAt.toMillis();
      });
  }, [notes, searchQuery]);

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return (
    <div className="ml-10 pr-5 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 px-4">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-violet-700 shrink-0">
              Your Notes
            </h1>
            <SearchBar
              placeholder="Search notes by tags..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>

          {filteredNotes.length > 0 && (
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingNote(null);
                setModalOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              New Note
            </Button>
          )}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleRequestDelete}
              onView={handleViewNote}
              onToggleFavorite={handleToggleFavorite}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaStickyNote className="text-6xl inline-block" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No notes found
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating a new note
            </p>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setModalOpen(true)}
            >
              Create First Note
            </Button>
          </div>
        )}

        {/* Modals */}
        <NoteModal
          isOpen={modalOpen}
          onClose={() => {
            setEditingNote(null);
            setModalOpen(false);
          }}
          onSave={handleSaveNote}
          initialTitle={editingNote?.title || ""}
          initialContent={editingNote?.content || ""}
          initialTags={editingNote?.tags}
          initialColor={editingNote?.color}
          initialReminder={editingNote?.reminder}
        />

        <WarningModal
          isOpen={warningOpen}
          onConfirm={confirmDelete}
          onCancel={() => setWarningOpen(false)}
          message="Are you sure you want to delete this note?, Well..., you can restore this note from recycle bin."
        />

        <NoteViewerModal
          isOpen={viewerOpen}
          note={viewingNote}
          onClose={() => setViewerOpen(false)}
        />
      </div>
    </div>
  );
};

export default NotesPage;
