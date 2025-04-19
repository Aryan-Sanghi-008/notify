// NoteViewerModal.tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";
import { Note } from "../types/Note";
import Button from "./Button";
import { FaTag, FaBell } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
};

export const NoteViewerModal = ({ isOpen, note, onClose }: Props) => {
  const safeFormat = (date: Date, formatStr: string) => {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return isNaN(parsedDate.getTime())
      ? "Invalid date"
      : format(parsedDate, formatStr);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="max-w-2xl w-full rounded-2xl bg-white p-6 shadow-xl"
          style={{ backgroundColor: note?.color || "#fff" }}
        >
          {note && (
            <>
              <DialogTitle className="text-2xl font-bold text-violet-700 mb-4">
                {note.title}
              </DialogTitle>

              {note.photoURL && (
                <img
                  src={note.photoURL}
                  alt="Note visual"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                />
              )}

              {note.tags && note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-sm flex items-center gap-1"
                    >
                      <FaTag className="text-xs" /> #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-h-[60vh] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="space-y-1 text-sm text-gray-500">
                  <p>Created: {format(note.createdAt.toDate(), "PPpp")}</p>
                  <p>Last updated: {format(note.updatedAt.toDate(), "PPpp")}</p>
                  {note.reminder && (
                    <p className="flex items-center gap-2 text-amber-600">
                      <FaBell />
                      Reminder: {safeFormat(note.reminder, "PPpp")}
                    </p>
                  )}
                </div>
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
