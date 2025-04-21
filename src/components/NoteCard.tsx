import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Note } from "../types/Note";
import {
  Star,
  Pin,
  Image as ImageIcon,
  Paperclip,
  MoreHorizontal,
  Bell,
  Trash2,
  Pencil,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Button from "./Button";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onView: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onTogglePin: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, ...props }) => {
  return (
    <motion.div
      className="relative rounded-xl p-5 border shadow-sm hover:shadow-lg transition-all duration-200 ease-out group"
      style={{ backgroundColor: note.color || "#fff" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-view]")) return;
        props.onView(note);
      }}
    >
      {/* Pinned Badge */}
      {note.isPinned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 bg-violet-500 p-1.5 rounded-full shadow-lg"
        >
          <Pin className="w-5 h-5 text-white" fill="currentColor" />
        </motion.div>
      )}

      {/* Favorite Badge */}
      {note.isFavorite && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -left-3 bg-amber-500 p-1.5 rounded-full shadow-lg"
        >
          <Star className="w-5 h-5 text-white" fill="currentColor" />
        </motion.div>
      )}

      {/* Header actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => props.onToggleFavorite(note)}
            className="rounded-lg group/fav"
            data-no-view
          >
            <motion.div
              animate={{ scale: note.isFavorite ? 1.2 : 1 }}
              transition={{ type: "spring" }}
            >
              <Star
                size={18}
                className={`${
                  note.isFavorite
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-400 hover:text-amber-400"
                }`}
              />
            </motion.div>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => props.onTogglePin(note)}
            className="rounded-lg group/pin"
            data-no-view
          >
            <motion.div
              animate={{ rotate: note.isPinned ? 0 : 45 }}
              transition={{ type: "spring" }}
            >
              <Pin
                size={18}
                className={`${
                  note.isPinned
                    ? "text-violet-600 fill-violet-600"
                    : "text-gray-400 hover:text-violet-500"
                }`}
              />
            </motion.div>
          </Button>
        </div>

        <Menu as="div" className="relative" data-no-view>
          <MenuButton className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden">
            <MenuItem>
              {() => (
                <button
                  onClick={() => props.onEdit(note)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700"
                >
                  <Pencil size={16} className="text-gray-500" /> Edit
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => props.onDelete(note)}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm ${
                    focus ? "bg-red-50" : ""
                  } text-red-600 hover:bg-red-50`}
                >
                  <Trash2 size={16} className="text-red-500" /> Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Image preview */}
      {note.photoURL && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={note.photoURL}
            alt="Note visual"
            className="w-full h-36 object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {note.title || "Untitled Note"}
      </h3>

      {/* Tags */}
      {note.tags && note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content preview */}
      <div className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html:
              note.content.slice(0, 200) +
              (note.content.length > 200 ? "..." : ""),
          }}
        />
      </div>

      {/* Extras */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3">
          {note.attachments && note.attachments?.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Paperclip size={14} className="flex-shrink-0" />
              <span className="font-medium">{note.attachments.length}</span>
            </div>
          )}
          {note.reminder && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bell size={14} className="flex-shrink-0" />
              <span className="font-medium">
                {format(note.reminder, "dd MMM, HH:mm")}
              </span>
            </div>
          )}
        </div>

        <span className="text-gray-500">
          {format(note.updatedAt.toDate(), "dd MMM yyyy")}
        </span>
      </div>

      {note.isFavorite && (
        <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-amber-200/50" />
      )}
    </motion.div>
  );
};

// Custom File Input Component
export const FileInput = ({ onChange }: { onChange: (file: File) => void }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="file"
      className="hidden"
      onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      accept="image/*"
    />
    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
      <ImageIcon size={20} />
    </div>
    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
      Choose Image
    </span>
  </label>
);

export default NoteCard;
