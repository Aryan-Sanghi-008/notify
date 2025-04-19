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

  const getTextColor = (backgroundColor: string) => {
    const color = backgroundColor.replace("#", "");
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 160 ? "text-gray-900" : "text-gray-100";
  };

  if (!editor) return null;
  const textColor = getTextColor(color);

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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={`w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
            color === "#ffffff" ? "border border-gray-200" : ""
          }`}
          style={{ backgroundColor: color }}
        >
          <div className="flex justify-between items-start mb-6">
            <DialogTitle className={`text-2xl font-bold ${textColor}`}>
              {initialTitle ? "Edit Note" : "New Note"}
            </DialogTitle>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                textColor === "text-gray-900"
                  ? "hover:bg-gray-100/80"
                  : "hover:bg-gray-900/10"
              }`}
            >
              <X size={24} className={textColor} />
            </button>
          </div>

          <div className="space-y-6">
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent text-lg font-medium placeholder-gray-400 transition-colors ${
                textColor === "text-gray-900"
                  ? "border border-gray-200/80 bg-white/90 focus:ring-blue-600"
                  : "border border-gray-100/20 bg-white/20 focus:ring-white"
              }`}
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Updated DatePicker styling */}
            <div className="flex gap-3 items-center">
              <ColorPicker value={color} onChange={setColor} />
              <div className="flex-1">
                <DatePicker
                  selected={reminder}
                  onChange={(date: Date | null) => setReminder(date)}
                  placeholderText="Set reminder"
                  className={`w-full px-4 py-2.5 text-sm rounded-lg focus:ring-2 focus:border-transparent ${
                    textColor === "text-gray-900"
                      ? "border border-gray-200/80 bg-white/90 focus:ring-blue-600"
                      : "border border-gray-100/20 bg-white/20 focus:ring-white"
                  }`}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  popperClassName={`!py-3 rounded-xl shadow-xl ${
                    textColor === "text-gray-900"
                      ? "[&_.react-datepicker__header]:!bg-gray-50"
                      : "[&_.react-datepicker__header]:!bg-gray-800"
                  }`}
                  timeClassName={() => "!text-sm"}
                  wrapperClassName="w-full"
                />
              </div>
            </div>

            {/* Image container styling */}
            {photo && (
              <div
                className={`relative group rounded-xl overflow-hidden shadow-sm ${
                  textColor === "text-gray-900"
                    ? "border border-gray-200/80"
                    : "border border-gray-100/20"
                }`}
              >
                <img
                  src={photo}
                  alt="Note preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className={`absolute top-3 right-3 rounded-full p-1.5 shadow-sm transition-all ${
                    textColor === "text-gray-900"
                      ? "bg-white/90 hover:bg-white text-gray-600"
                      : "bg-gray-900/20 hover:bg-gray-900/30 text-gray-100"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Editor styling */}
            <div
              className={`rounded-xl focus-within:ring-2 ${
                textColor === "text-gray-900"
                  ? "border border-gray-200/80 focus-within:ring-blue-600"
                  : "border border-gray-100/20 focus-within:ring-white"
              }`}
            >
              <div
                className={`p-2 border-b rounded-t-xl ${
                  textColor === "text-gray-900"
                    ? "border-gray-200/80 bg-gray-50/90"
                    : "border-gray-100/20 bg-gray-900/10"
                }`}
              >
                <MenuBar editor={editor} textColor={textColor} />
              </div>
              <div className="p-4">
                <EditorContent
                  editor={editor}
                  className={`min-h-[200px] focus:outline-none prose prose-sm max-w-none ${
                    textColor === "text-gray-900"
                      ? "text-gray-700"
                      : "text-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Tags input styling */}
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <FaTag className={`${textColor} flex-shrink-0`} />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tags..."
                  className={`px-4 py-2 rounded-lg focus:ring-2 focus:border-transparent flex-1 text-sm ${
                    textColor === "text-gray-900"
                      ? "border border-gray-200/80 bg-white/90 focus:ring-blue-600"
                      : "border border-gray-100/20 bg-white/20 focus:ring-white"
                  }`}
                />
                <Button
                  size="sm"
                  onClick={handleAddTag}
                  className={`${
                    textColor === "text-gray-900"
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "bg-gray-100/20 text-gray-100 hover:bg-gray-100/30"
                  }`}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                      textColor === "text-gray-900"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100/20 text-gray-100"
                    }`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={`${
                        textColor === "text-gray-900"
                          ? "text-blue-500 hover:text-blue-700"
                          : "text-gray-300 hover:text-gray-100"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div
            className={`flex justify-end gap-3 mt-8 border-t pt-6 ${
              textColor === "text-gray-900"
                ? "border-gray-200/80"
                : "border-gray-100/20"
            }`}
          >
            <Button
              variant="ghost"
              onClick={onClose}
              className={`${
                textColor === "text-gray-900"
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-200 hover:bg-gray-100/20"
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`${
                textColor === "text-gray-900"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              } shadow-sm`}
            >
              Save Note
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
