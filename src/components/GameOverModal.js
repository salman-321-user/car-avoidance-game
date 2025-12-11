import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { FaTrophy, FaRedo, FaHome, FaMedal } from 'react-icons/fa';

const GameOverModal = () => {
  const { gameState, score, level, highScore, startGame } = useGame();
  const { userProfile } = useAuth();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (gameState === 'game-over' && !hasShownRef.current) {
      hasShownRef.current = true;
    }
  }, [gameState]);

  useEffect(() => {
    // Reset when game starts
    if (gameState === 'playing') {
      hasShownRef.current = false;
    }
  }, [gameState]);

  if (gameState !== 'game-over') return null;

  const isNewHighScore = score > highScore;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 max-w-sm w-full border-2 border-gray-700"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="inline-block mb-4"
            >
              <div className="text-5xl">💥</div>
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2 text-red-500">GAME OVER</h2>
            <p className="text-gray-400 mb-4 text-sm">You crashed!</p>
            
            {isNewHighScore && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-4 p-3 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-lg border border-yellow-500/30"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaTrophy className="text-yellow-400" />
                  <span className="text-yellow-400 font-bold">NEW HIGH SCORE!</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Your score has been saved!
                </p>
              </motion.div>
            )}
            
            {!isNewHighScore && highScore > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-gray-800/30 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaMedal className="text-blue-400" />
                  <p className="text-sm text-gray-300">
                    Your high score: <span className="text-yellow-400 font-bold">{highScore}</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try to beat {highScore} points!
                </p>
              </motion.div>
            )}
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Your Score</span>
                <span className="text-2xl font-bold text-blue-400">{score}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">High Score</span>
                <span className="text-xl font-bold text-yellow-400">{Math.max(score, highScore)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Level</span>
                <span className="text-xl font-bold text-purple-400">{level}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 p-3 rounded-lg font-bold text-sm"
              >
                <FaRedo />
                Play Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-bold text-sm"
              >
                <FaHome />
                Main Menu
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverModal;