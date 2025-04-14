import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "./Button";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
};

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  initialContent = "",
}: NoteModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    editor?.commands.setContent(initialContent);
  }, [initialTitle, initialContent, isOpen]);

  const handleSubmit = () => {
    onSave(title, content);
    setTitle("");
    editor?.commands.clearContent();
    onClose();
  };

  if (!editor) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-2xl font-bold mb-4 text-violet-700">
            {initialTitle ? "Edit Note" : "New Note"}
          </DialogTitle>
          
          <input
            type="text"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mb-4 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-violet-400">
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

type MenuBarProps = {
  editor: ReturnType<typeof useEditor>;
};

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null;

  const buttonClass = (active: boolean) => 
    `p-2 hover:bg-violet-100 rounded ${active ? "text-violet-700" : "text-gray-600"}`;

  return (
    <div className="flex gap-1 p-2 border-b border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        1. List
      </button>
    </div>
  );
};