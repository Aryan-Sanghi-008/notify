import { useAuth } from "../hooks/useAuth";
import {
  FaStickyNote,
  FaUserCircle,
  FaClock,
  FaCalendar,
} from "react-icons/fa";
import InfoCard from "../components/InfoCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecentNotes, getUserNotesCount } from "../lib/firebase/notes";
import { Note } from "../types/Note";
import Button from "../components/Button";
import NoteViewerModal from "../components/NoteViewerModal";
import { getNoteEmoji, timeSince } from "../utils/helperFunctions";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notesCount, setNotesCount] = useState<number>(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const getWeeklyActivity = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return recentNotes.filter((note) => note.createdAt.toDate() > oneWeekAgo)
      .length;
  };

  const getTodaysNotes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return recentNotes.filter((note) => note.createdAt.toDate() >= today)
      .length;
  };

  useEffect(() => {
    if (user) {
      const fetchNotesCount = async () => {
        const count = await getUserNotesCount(user?.uid);
        const notes = await getRecentNotes(user.uid);
        setNotesCount(count);
        setRecentNotes(notes);
      };
      fetchNotesCount();
    }
  }, [user]);

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-gradient-to-r from-violet-600 to-blue-500 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              {user && user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg"
                />
              ) : (
                <FaUserCircle className="text-5xl text-white/80" />
              )}

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome back, {user?.displayName?.split(" ")[0] || "User"} 👋
                </h1>
                <p className="text-white/90 text-sm mt-1">
                  {notesCount === 0
                    ? "Ready to create your first note?"
                    : `You've got ${notesCount} note${
                        notesCount !== 1 ? "s" : ""
                      } in your collection`}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 -mt-4">
          <InfoCard
            title="Total Notes"
            value={notesCount}
            icon={<FaStickyNote className="text-white" />}
            description="Your knowledge repository"
            theme="primary"
            progress={Math.min((notesCount / 50) * 100, 100)}
            onClick={() => navigate("/notes")}
          />

          <InfoCard
            title="Weekly Activity"
            value={getWeeklyActivity()}
            icon={<FaClock className="text-white" />}
            description="Notes created this week"
            theme="success"
            progress={(getWeeklyActivity() / 14) * 100}
          />

          <InfoCard
            title="Today's Notes"
            value={getTodaysNotes()}
            icon={<FaCalendar className="text-white" />}
            description="Notes created today"
            theme="warning"
            progress={(getTodaysNotes() / 5) * 100}
          />
        </section>

        <section className="bg-white rounded-2xl border border-white/20 shadow-xl p-6 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaStickyNote className="text-violet-600" />
              Recent Notes
            </h2>
            {recentNotes?.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-violet-600 hover:bg-violet-50"
                onClick={() => navigate("/notes")}
              >
                View All →
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="group relative p-5 rounded-xl border border-gray-100 hover:border-violet-200 cursor-pointer transition-all duration-200 hover:shadow-lg bg-white hover:-translate-y-1"
                  onClick={() => {
                    setViewingNote(note);
                    setViewerOpen(true);
                  }}
                >
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <span className="text-violet-600 text-lg">
                      {note.content?.includes("#") ? "🏷️" : "📄"}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="w-full h-32 mb-3 rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 flex items-center justify-center shadow-inner">
                      <span className="text-4xl">
                        {getNoteEmoji(note.content || "📑")}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800 line-clamp-1">
                      {note.title || "Untitled Note"}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                      <span className="text-gray-500">
                        {timeSince(note.createdAt.toDate())}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <FaClock className="text-sm" />
                      <span>
                        {note.updatedAt.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 col-span-full space-y-4">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center shadow-inner">
                  <FaStickyNote className="text-3xl text-violet-600" />
                </div>
                <p className="text-gray-600">Your fresh ideas await!</p>
                <Button
                  icon={<FaStickyNote />}
                  onClick={() => navigate("/notes")}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Create Note
                </Button>
              </div>
            )}
          </div>
        </section>

        <NoteViewerModal
          isOpen={viewerOpen}
          note={viewingNote}
          onClose={() => setViewerOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
