import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import GameCanvas from '../components/GameCanvas';
import Leaderboard from '../components/Leaderboard';
import GameOverModal from '../components/GameOverModal';
import { FaHome, FaUser, FaPlay, FaPause, FaRedo, FaTrophy, FaGamepad, FaBook, FaLightbulb } from 'react-icons/fa';

const GameScreen = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { gameState, score, level, startGame, pauseGame, resumeGame } = useGame();

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'playing') {
        if (e.key === 'Escape' || e.key === ' ') {
          pauseGame();
        }
      } else if (gameState === 'paused' && e.key === ' ') {
        resumeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame, resumeGame]);

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      {/* Main Container */}
      <div className="min-h-full flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex-shrink-0 p-2 md:p-3 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {userProfile && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile-setup')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 rounded-lg hover:bg-gray-700/80 transition-colors"
                >
                  <span className="text-lg md:text-xl">{userProfile.photoURL}</span>
                  <span className="text-sm md:text-base font-bold truncate max-w-[100px] md:max-w-[150px]">
                    {userProfile.displayName}
                  </span>
                </motion.button>
              )}
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-lg hover:opacity-90"
              >
                <FaHome className="text-sm md:text-base" />
                <span className="hidden md:inline text-sm font-semibold">HOME</span>
              </motion.button>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-400">SCORE</div>
                <div className="text-xl md:text-2xl font-bold text-blue-400">{score}</div>
              </div>

              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-400">LEVEL</div>
                <div className="text-xl md:text-2xl font-bold text-yellow-400">{level}</div>
              </div>

              <div className="flex gap-2">
                {gameState === 'idle' || gameState === 'game-over' ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm md:text-base font-bold hover:opacity-90"
                  >
                    <FaPlay className="text-sm" />
                    <span>{gameState === 'game-over' ? 'PLAY AGAIN' : 'START GAME'}</span>
                  </motion.button>
                ) : gameState === 'paused' ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={resumeGame}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm md:text-base font-bold hover:opacity-90"
                  >
                    <FaPlay className="text-sm" />
                    <span>RESUME</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseGame}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-sm md:text-base font-bold hover:opacity-90"
                  >
                    <FaPause className="text-sm" />
                    <span>PAUSE</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-2 md:p-3">
          {/* Game Area - Increased width */}
          <div className="max-w-6xl mx-auto mb-3 md:mb-4">
            <div className="bg-gray-800/40 rounded-xl border border-gray-700 overflow-hidden">
              <div className="relative h-[500px] md:h-[550px] lg:h-[600px] bg-gradient-to-br from-gray-900/50 to-black/50">
                <GameCanvas />

                {/* Game State Overlays */}
                <AnimatePresence>
                  {gameState === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                      <div className="text-center p-6 max-w-md">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                          Car Avoidance Game
                        </h2>
                        <p className="text-gray-300 mb-6 text-base md:text-lg">
                          Avoid incoming cars and survive as long as possible!
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={startGame}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-lg font-bold hover:opacity-90 mb-6"
                        >
                          START GAME
                        </motion.button>
                        <div className="text-sm text-gray-400 space-y-2">
                          <p className="flex items-center justify-center gap-2">
                            <span className="px-2 py-1 bg-gray-800 rounded">← →</span>
                            <span>Arrow Keys to move left/right</span>
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <span className="px-2 py-1 bg-gray-800 rounded">SPACE</span>
                            <span>Pause/Resume game</span>
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <span className="px-2 py-1 bg-gray-800 rounded">ESC</span>
                            <span>Pause game</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {gameState === 'paused' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                      <div className="text-center p-8 bg-gray-900/90 rounded-xl border border-gray-700">
                        <h2 className="text-4xl font-bold mb-4 text-yellow-400">GAME PAUSED</h2>
                        <p className="text-gray-300 text-lg mb-6">Press SPACE to continue</p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={resumeGame}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-bold hover:opacity-90"
                        >
                          RESUME GAME
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Controls */}
              <div className="lg:hidden p-3 bg-gray-900/80 border-t border-gray-700">
                <div className="flex justify-center gap-6">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-8 py-4 bg-gray-800/90 rounded-xl text-2xl font-bold hover:bg-gray-700/90"
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
                  >
                    ←
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-8 py-4 bg-gray-800/90 rounded-xl text-2xl font-bold hover:bg-gray-700/90"
                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
                  >
                    →
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard - Increased height and width */}
          <div className="max-w-6xl mx-auto mb-3 md:mb-4">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-700">
              <div className="p-4 md:p-6">
                
                <div className="h-[400px] md:h-[450px] overflow-y-auto pr-2">
                  <Leaderboard />
                </div>
              </div>
            </div>
          </div>

          {/* Info Sections in 3 columns - Increased width */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* How to Play */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700 p-4 md:p-5">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FaGamepad className="text-blue-400 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    🎮 HOW TO PLAY
                  </h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="font-bold text-base md:text-lg text-blue-300">Movement</span>
                      <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm md:text-base font-bold border border-gray-700">← →</div>
                    </div>
                    <p className="text-sm md:text-base text-gray-300">Use left and right arrow keys to move your car</p>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="font-bold text-base md:text-lg text-green-300">Pause/Resume</span>
                      <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm md:text-base font-bold border border-gray-700">SPACE</div>
                    </div>
                    <p className="text-sm md:text-base text-gray-300">Press spacebar to pause or resume the game</p>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="font-bold text-base md:text-lg text-yellow-300">Pause</span>
                      <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm md:text-base font-bold border border-gray-700">ESC</div>
                    </div>
                    <p className="text-sm md:text-base text-gray-300">Press escape key to pause the game</p>
                  </div>
                </div>
              </div>

              {/* Game Rules */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700 p-4 md:p-5">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <FaBook className="text-purple-400 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    📝 GAME RULES
                  </h3>
                </div>
                <ul className="space-y-3 md:space-y-4">
                  <li className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-red-500/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-red-900/30 rounded-lg mt-0.5">
                        <span className="text-red-400 font-bold">✕</span>
                      </div>
                      <div>
                        <span className="font-bold text-base md:text-lg text-white block mb-1">Avoid Cars</span>
                        <p className="text-sm md:text-base text-gray-300">Stay clear of incoming cars to survive</p>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-yellow-900/30 rounded-lg mt-0.5">
                        <span className="text-yellow-400 font-bold">★</span>
                      </div>
                      <div>
                        <span className="font-bold text-base md:text-lg text-white block mb-1">Score System</span>
                        <p className="text-sm md:text-base text-gray-300">Earn 10 points for every second survived</p>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-900/30 rounded-lg mt-0.5">
                        <span className="text-blue-400 font-bold">↑</span>
                      </div>
                      <div>
                        <span className="font-bold text-base md:text-lg text-white block mb-1">Level Progression</span>
                        <p className="text-sm md:text-base text-gray-300">Cars speed up every 30 seconds</p>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 md:p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-green-900/30 rounded-lg mt-0.5">
                        <span className="text-green-400 font-bold">⚠</span>
                      </div>
                      <div>
                        <span className="font-bold text-base md:text-lg text-white block mb-1">Game Over</span>
                        <p className="text-sm md:text-base text-gray-300">Collision with any car ends the game</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Pro Tips */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700 p-4 md:p-5">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                  <div className="p-2 bg-yellow-900/30 rounded-lg">
                    <FaLightbulb className="text-yellow-400 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    💡 PRO TIPS
                  </h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-lg border border-blue-800/40 hover:border-blue-500/60 transition-all duration-200">
                    <h4 className="font-bold text-base md:text-lg text-blue-300 mb-2 md:mb-3">Stay Centered</h4>
                    <p className="text-sm md:text-base text-gray-300">Position yourself in middle lanes for better reaction time to incoming cars</p>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-lg border border-green-800/40 hover:border-green-500/60 transition-all duration-200">
                    <h4 className="font-bold text-base md:text-lg text-green-300 mb-2 md:mb-3">Anticipate Patterns</h4>
                    <p className="text-sm md:text-base text-gray-300">Watch for gaps and patterns in car movement to plan your route</p>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-lg border border-purple-800/40 hover:border-purple-500/60 transition-all duration-200">
                    <h4 className="font-bold text-base md:text-lg text-purple-300 mb-2 md:mb-3">Stay Calm</h4>
                    <p className="text-sm md:text-base text-gray-300">Don't panic at higher speeds. Smooth movements are more effective</p>
                  </div>
                  <div className="p-3 md:p-4 bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-lg border border-yellow-800/40 hover:border-yellow-500/60 transition-all duration-200">
                    <h4 className="font-bold text-base md:text-lg text-yellow-300 mb-2 md:mb-3">Practice Pausing</h4>
                    <p className="text-sm md:text-base text-gray-300">Use the pause feature to catch your breath during intense moments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 md:p-4 bg-gray-800/90 border-t border-gray-700 mt-4 md:mt-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm md:text-base text-gray-400">
              Car Avoidance Game • Use ← → arrow keys to move • SPACE to pause/resume • ESC to pause
            </p>
          </div>
        </div>
      </div>

      <GameOverModal />
    </div>
  );
};

export default GameScreen;