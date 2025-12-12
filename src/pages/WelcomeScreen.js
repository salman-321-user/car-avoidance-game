import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaGoogle, FaTrophy, FaPlay, FaUsers, FaCrown, FaFire, FaStar, FaArrowRight, FaRoad, FaKeyboard, FaGamepad } from 'react-icons/fa';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (userProfile && userProfile.displayName) {
        navigate('/game');
      } else {
        navigate('/profile-setup');
      }
    }
  }, [currentUser, userProfile, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggingIn(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-900 via-black to-gray-900">

      {/* Background Elements - Fixed (doesn't scroll) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-purple-500/5 to-transparent"></div>

        {[...Array(5)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-[1px] w-32 bg-yellow-400/20"
            style={{
              left: `${(i * 25) % 100}%`,
              top: `${20 + (i * 15)}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content (Scrollable) */}
      <div className="relative w-full px-4 py-8 md:px-8 min-h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto pb-32"
        >

          {/* HERO */}
          <div className="text-center mb-6 md:mb-8 pt-4">
            <motion.div animate={floatAnimation} className="inline-block mb-6">
              <div className="relative">
                <FaCar className="text-5xl md:text-6xl text-blue-500 mx-auto" />
                <div className="absolute -top-1 -right-1">
                  <FaFire className="text-lg text-orange-500" />
                </div>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              CAR AVOIDANCE
            </motion.h1>

            <motion.h2 variants={itemVariants} className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">
              ULTIMATE CHALLENGE
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8">
              Dodge, Survive, Conquer the Leaderboard!
            </motion.p>

            <motion.div variants={itemVariants} className="mb-12">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="group relative w-full max-w-md mx-auto"
              >
                <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-4 md:py-5 rounded-xl border-2 border-white/10 shadow-lg transition-all duration-300">
                  {isLoggingIn ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-lg font-bold text-white">Starting Engine...</span>
                    </div>
                  ) : (
                    <>
                      <FaGoogle className="text-xl text-white" />
                      <span className="text-lg font-bold text-white">SIGN IN WITH GOOGLE</span>
                      <FaArrowRight className="text-lg text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Free to play • No downloads required
                </p>
              </motion.button>

              {isLoggingIn && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400 mt-4 text-sm">
                  Preparing your gaming experience...
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* FEATURES */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Why Players Love It</h2>
              <p className="text-gray-400">Experience the thrill of high-speed avoidance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: <FaTrophy className="text-2xl text-yellow-400" />,
                  title: "Global Competition",
                  desc: "Compete with players worldwide on the leaderboard",
                  color: "bg-yellow-500/10"
                },
                {
                  icon: <FaGamepad className="text-2xl text-blue-400" />,
                  title: "Simple Controls",
                  desc: "Easy to learn, hard to master",
                  color: "bg-blue-500/10"
                },
                {
                  icon: <FaUsers className="text-2xl text-green-400" />,
                  title: "Community Driven",
                  desc: "Join thousands of players",
                  color: "bg-green-500/10"
                },
              ].map((feature, index) => (
                <div key={index} className={`${feature.color} p-5 rounded-xl border border-gray-700/50`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-black/30 rounded-lg">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FOOTER */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-gray-800/50 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaCar className="text-gray-500" />
              <span className="text-gray-500">•</span>
              <FaRoad className="text-gray-500" />
              <span className="text-gray-500">•</span>
              <FaTrophy className="text-gray-500" />
            </div>
            <p className="text-gray-600 text-sm">
              Car Avoidance Challenge © {new Date().getFullYear()}
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;