import { Editor } from "@tiptap/react";
import { Bold, Italic, List, Underline } from "lucide-react";

type MenuBarProps = {
  editor: Editor | null;
  textColor: "text-gray-900" | "text-gray-100";
};

export default function MenuBar({ editor, textColor }: MenuBarProps) {
  if (!editor) return null;

  // Base button styling classes
  const baseButtonClass = `p-2 rounded-lg transition-colors ${
    textColor === "text-gray-900"
      ? "hover:bg-gray-100/80"
      : "hover:bg-gray-900/10"
  }`;

  // Active state styling
  const activeClass =
    textColor === "text-gray-900" ? "bg-blue-100/50" : "bg-blue-900/20";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Bold Button */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${baseButtonClass} ${
          editor.isActive("bold") ? activeClass : ""
        }`}
      >
        <Bold className={textColor} size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseButtonClass} ${
          editor.isActive("italic") ? activeClass : ""
        }`}
      >
        <Italic className={textColor} size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${baseButtonClass} ${
          editor.isActive("underline") ? activeClass : ""
        }`}
      >
        <Underline className={textColor} size={18} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseButtonClass} ${
          editor.isActive("bulletList") ? activeClass : ""
        }`}
      >
        <List className={textColor} size={18} />
      </button>
    </div>
  );
}
