import { motion } from "framer-motion";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";

export const AuthPage = () => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex bg-gray-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Left Illustration Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-1 bg-gradient-to-tr from-violet-800 to-purple-700 p-12 items-center justify-center relative"
        >
          <div className="space-y-8 text-gray-100 z-10">
            <motion.h2 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-white"
            >
              Welcome to NotiFy ✨
            </motion.h2>
            <ul className="space-y-6 text-lg">
              {['Smart Note Organization', 'Instant Search & Tags', 'Cross-Device Sync'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <FiArrowRight className="text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-300/10 rounded-full blur-2xl" />
          </div>
        </motion.div>

        {/* Right Auth Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 p-12 flex flex-col items-center justify-center relative"
        >
          <div className="max-w-md w-full space-y-8">
            {/* Logo & Heading */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 border border-white/10">
                <span className="text-4xl">📝</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                NotiFy
              </h1>
              <p className="text-gray-400 mt-2">Your Smarter Note-Taking Space</p>
            </motion.div>

            {/* Auth Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={signIn}
                className="w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all border border-white/10 shadow-lg"
              >
                <FcGoogle className="text-2xl" />
                <span className="text-gray-100 font-medium">
                  Continue with Google
                </span>
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/80 text-gray-400">Secure Login</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {['🔒 Secure', '🚀 Fast', '✨ Modern'].map((feature) => (
                <div 
                  key={feature}
                  className="p-3 bg-gray-800 rounded-lg border border-white/10 shadow-sm"
                >
                  <span className="block text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="absolute bottom-6 text-sm text-gray-400">
            By continuing, you agree to our{" "}
            <a href="#" className="text-violet-300 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-300 hover:underline">
              Privacy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};