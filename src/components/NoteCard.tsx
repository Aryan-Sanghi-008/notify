import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Note } from "../types/Note";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "./Button";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onView: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <motion.div
      className="relative bg-white border rounded-xl p-4 shadow hover:shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-view]")) return;
        onView(note);
      }}
    >
      <h3 className="text-lg font-bold text-violet-700">{note.title}</h3>

      <p
        className="text-sm text-gray-600 mt-2"
        dangerouslySetInnerHTML={{
          __html: note.content.slice(0, 100) + "...",
        }}
      />

      <p className="text-xs text-gray-400 mt-2">
        {format(note.createdAt.toDate(), "PPpp")}
      </p>

      {/* Triple dot menu */}
      <Menu
        as="div"
        data-no-view
        className="absolute bottom-2 right-2 text-right"
      >
        <MenuButton className="p-1 rounded-full hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </MenuButton>
        <MenuItems className="absolute right-0 bottom-8 w-28 bg-white border rounded-md shadow-md z-10">
          <MenuItem>
            {() => (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(note)}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm`}
              >
                <Pencil size={16} /> Edit
              </Button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <Button
                variant="ghost"
                onClick={() => onDelete(note)}
                className={`${
                  focus ? "bg-red-100" : ""
                } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600`}
              >
                <Trash2 size={16} /> Delete
              </Button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </motion.div>
  );
};

export default NoteCard;
