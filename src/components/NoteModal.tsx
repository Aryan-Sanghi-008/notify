// NoteModal.tsx
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "./Button";
import { FaTag } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import MenuBar from "./MenuBar";
import ColorPicker from "./ColorPicker";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    content: string,
    additionalData: {
      photoURL?: string;
      tags?: string[];
      color?: string;
      reminder?: Date | null;
    }
  ) => void;
  initialTitle?: string;
  initialContent?: string;
  initialPhoto?: string;
  initialTags?: string[];
  initialColor?: string;
  initialReminder?: Date | null;
};

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  initialContent = "",
  initialPhoto = "",
  initialTags = [],
  initialColor = "#ffffff",
  initialReminder = null,
}: NoteModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [photo, setPhoto] = useState(initialPhoto);
  const [tags, setTags] = useState(initialTags);
  const [color, setColor] = useState(initialColor);
  const [reminder, setReminder] = useState<Date | null>(initialReminder);
  const [tagInput, setTagInput] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialTitle);
    setContent(initialContent);
    setPhoto(initialPhoto);
    setTags(initialTags);
    setColor(initialColor);
    setReminder(initialReminder);
    editor?.commands.setContent(initialContent);
  }, [isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    onSave(title, content, {
      photoURL: photo,
      tags,
      color,
      reminder,
    });
    onClose();
  };

  if (!editor) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: color }}
        >
          <div className="flex justify-between items-start mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {initialTitle ? "Edit Note" : "New Note"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium placeholder-gray-400"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-3 items-center">
              <ColorPicker value={color} onChange={setColor} />
              <div className="flex-1">
                <DatePicker
                  selected={reminder}
                  onChange={(date: Date | null) => setReminder(date)}
                  placeholderText="Set reminder"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  popperClassName="!py-3 rounded-xl shadow-xl [&_.react-datepicker__time-container]:!rounded-r-xl [&_.react-datepicker__header]:!bg-gray-50"
                  timeClassName={() => "!text-sm"}
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            {photo && (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={photo}
                  alt="Note preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 rounded-full p-1.5 shadow-sm transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
              <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <MenuBar editor={editor} />
              </div>
              <div className="p-4">
                <EditorContent
                  editor={editor}
                  className="min-h-[200px] focus:outline-none prose prose-sm max-w-none text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <FaTag className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tags..."
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddTag}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 border-t border-gray-100 pt-6">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Save Note
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
