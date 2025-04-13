import { useAuth } from "../hooks/useAuth";
import {
  FaStickyNote,
  FaUserCircle,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import InfoCard from "../components/InfoCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLastCreatedNote, getUserNotesCount } from "../lib/firebase/notes";
import { Note } from "../types/Note";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notesCount, setNotesCount] = useState<number>(0);
  const [recentNote, setRecentNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotesCount = async () => {
      const count = await getUserNotesCount(user?.uid ?? "");
      setNotesCount(count);
    };

    const getLatestNote = async () => {
      const recentNote = await getLastCreatedNote(user?.uid ?? "");
      setRecentNote(recentNote);
    };

    fetchNotesCount();
    getLatestNote();
  }, [user]);

  return (
    <div className="ml-16 w-screen space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-violet-400"
            />
          ) : (
            <FaUserCircle className="text-5xl text-violet-600" />
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.displayName?.split(" ")[0] || "User"} 🎉
            </h1>
            <p className="text-gray-600 text-sm">
              Let’s make some awesome notes today.
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard
          title="Total Notes"
          value={notesCount}
          icon={<FaStickyNote />}
          description="You've made a dozen notes!"
          theme="primary"
          progress={80}
          onClick={() => navigate("/notes")}
        />

        <InfoCard
          title="Latest Note"
          value={recentNote?.title}
          icon={<FaClock />}
          description={`You created this on ${recentNote?.createdAt?.toDate()}`}
          theme="success"
          onClick={() => console.log("Show latest note", recentNote)}
        />

        <InfoCard
          title="Profile Email"
          value={user?.email || "Not available"}
          icon={<FaEnvelope />}
          description="Your linked email"
          theme="default"
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Notes
        </h2>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-gray-600">
          <p>Coming soon: List of your latest notes ✨</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
