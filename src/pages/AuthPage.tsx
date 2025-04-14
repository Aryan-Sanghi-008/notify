import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

export const AuthPage = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8  text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">NotiFy 📝</h1>
        <p className="text-gray-500 mb-6">
          Organize your thoughts. Effortlessly.
        </p>

        <Button
          onClick={signIn}
          className="flex items-center justify-center w-full border border-gray-300 px-4 py-2 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition-all bg-white text-gray-700"
        >
          <FcGoogle className="text-2xl mr-3" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};
