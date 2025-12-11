import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaGoogle } from 'react-icons/fa';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Check if user already has a profile
      if (userProfile && userProfile.displayName) {
        // User has profile → go to game
        navigate('/game');
      } else {
        // User doesn't have profile → go to setup
        navigate('/profile-setup');
      }
    }
  }, [currentUser, userProfile, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-4"
        >
          <FaCar className="text-5xl md:text-6xl text-blue-500 mx-auto" />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Car Avoidance Challenge
        </h1>
        
        <p className="text-lg text-gray-300 mb-6">
          Dodge the traffic, beat your high score!
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 md:p-6 mb-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-blue-400">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">← → Move</div>
                <p className="text-gray-400 text-xs">Use arrow keys to dodge cars</p>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <div className="text-yellow-400 font-bold mb-1">⏱️ Score</div>
                <p className="text-gray-400 text-xs">1 point per second survived</p>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <div className="text-red-400 font-bold mb-1">🚀 Speed Up</div>
                <p className="text-gray-400 text-xs">Level up every 30 seconds</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 shadow-lg"
          >
            <FaGoogle className="text-red-500" />
            Sign in with Google to Play
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 text-gray-500 text-sm"
        >
          <p>Play now and compete on the global leaderboard!</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;