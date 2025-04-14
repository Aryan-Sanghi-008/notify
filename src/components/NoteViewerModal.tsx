// src/components/NoteViewerModal.tsx
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";
import { Note } from "../types/Note";
import Button from "./Button";

type Props = {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
};

const NoteViewerModal = ({ isOpen, note, onClose }: Props) => {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full rounded-2xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-2xl font-bold text-violet-700 mb-4">
            {note.title}
          </DialogTitle>
          <div
            className="text-gray-700 text-sm mb-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <p className="text-xs text-gray-400 text-right">
            Created: {format(note.createdAt.toDate(), "PPpp")}
          </p>
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NoteViewerModal;
