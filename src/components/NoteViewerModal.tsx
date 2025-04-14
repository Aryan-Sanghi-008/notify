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
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-2xl w-full rounded-2xl bg-white p-6 shadow-xl">
          {note && (
            <>
              <DialogTitle className="text-2xl font-bold text-violet-700 mb-4">
                {note.title}
              </DialogTitle>
              <div className="prose max-h-[60vh] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Created: {format(note.createdAt.toDate(), "PPpp")}
                </p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NoteViewerModal;
