import React from 'react';
import { motion } from 'framer-motion';

const ControlButtons = ({ onLeft, onRight }) => {
  return (
    <div className="flex justify-center gap-8 p-4">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onTouchStart={onLeft}
        className="p-6 bg-gray-800/80 backdrop-blur-lg rounded-full text-2xl hover:bg-gray-700 active:bg-gray-600"
      >
        ←
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onTouchStart={onRight}
        className="p-6 bg-gray-800/80 backdrop-blur-lg rounded-full text-2xl hover:bg-gray-700 active:bg-gray-600"
      >
        →
      </motion.button>
    </div>
  );
};

export default ControlButtons;