import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "./Button";

type WarningModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
};

export default function WarningModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Are you sure you want to continue?",
}: WarningModalProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
          <DialogTitle className="text-xl font-semibold text-red-600 mb-4">
            Warning
          </DialogTitle>
          <p className="text-sm text-gray-700 mb-6">{message}</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
