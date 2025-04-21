import { useEffect, useState } from "react";
import { Note } from "../types/Note";
import {
  deleteNote,
  fetchSoftDeleteNotes,
  restoreNote,
} from "../lib/firebase/notes";
import { useAuth } from "../hooks/useAuth";
import { FiClock, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import { getNoteEmoji, timeSince } from "../utils/helperFunctions";
import { NoteViewerModal } from "../components/NoteViewerModal";
import { motion } from "framer-motion";
import WarningModal from "../components/WarningModal";
import { EmptyState } from "../components/EmptyState";
import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";
import { v4 as uuidv4 } from "uuid";
import { hideLoader, showLoader } from "../store/slices/loaderSlice";

export const RecycleBin = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [softDeleteNotes, setSoftDeleteNotes] = useState<Note[]>([]);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const getSoftDeleteNotes = async () => {
    try {
      dispatch(showLoader());
      const deletedNotes = await fetchSoftDeleteNotes(user?.uid ?? "");
      setSoftDeleteNotes(deletedNotes);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleRestore = async (noteId: string) => {
    await restoreNote(noteId);
    dispatch(
      addToast({
        message: "Restore note successfully",
        type: "success",
        id: uuidv4(),
      })
    );
    await getSoftDeleteNotes();
  };

  const handleDelete = async (noteId: string) => {
    if (selectedNote) {
      await deleteNote(noteId);
      dispatch(
        addToast({
          message: "Note deleted permanently",
          type: "success",
          id: uuidv4(),
        })
      );
      await getSoftDeleteNotes();
      setSelectedNote(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    getSoftDeleteNotes();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiTrash2 className="text-rose-500" />
          Recycle Bin
        </h1>
        <span className="text-gray-500 text-sm">
          {softDeleteNotes.length} deleted items
        </span>
      </div>

      {softDeleteNotes.length === 0 ? (
        <EmptyState
          icon="🗑️"
          title="Empty Trash"
          description="Deleted notes will appear here"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {softDeleteNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => {
                  setViewingNote(note);
                  setViewerOpen(true);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">
                    {getNoteEmoji(note.content || "📑")}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-600">
                    Deleted{" "}
                    {note.deletedAt ? timeSince(note.deletedAt?.toDate()) : ""}
                  </span>
                </div>

                <h3 className="font-medium text-gray-900 line-clamp-1 mb-2">
                  {note.title || "Untitled Note"}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiClock className="shrink-0" />
                    <span>
                      {note.updatedAt.toDate().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-xs">
                    {note.content?.match(/#\w+/g)?.join(" ") || ""}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(note.id);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                  title="Restore"
                >
                  <FiCornerUpLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNote(note.id);
                    setConfirmOpen(true);
                  }}
                  className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                  title="Delete permanently"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <NoteViewerModal
        isOpen={viewerOpen}
        note={viewingNote}
        onClose={() => setViewerOpen(false)}
      />

      <WarningModal
        isOpen={confirmOpen}
        onConfirm={() => handleDelete(selectedNote!)}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedNote(null);
        }}
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
};
