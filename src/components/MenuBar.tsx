// MenuBar.tsx
import { Editor } from "@tiptap/react";

type MenuBarProps = {
  editor: Editor | null;
};

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 p-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="font-bold"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="italic"
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="underline"
      >
        Underline
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </button>
    </div>
  );
}
