import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { 
  FaCrown, 
  FaGem, 
  FaMedal, 
  FaTrophy, 
  FaFire
} from 'react-icons/fa';

const Leaderboard = () => {
  const { leaderboard } = useGame();

  const getRankStyle = (rank) => {
    switch(rank) {
      case 1:
        return {
          container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-600 shadow-2xl shadow-black/60',
          rankBg: 'bg-gradient-to-br from-gray-700 via-gray-800 to-black',
          badgeIcon: <FaGem className="text-gray-300 text-xl" />,
          badgeColor: 'text-gray-300',
          rankText: 'text-gray-100 font-black',
          nameText: 'text-white font-bold',
          scoreText: 'text-gray-100 font-bold',
          glow: 'shadow-[0_0_25px_rgba(0,0,0,0.9)]',
          effect: 'animate-pulse',
          playerTag: 'LEGEND',
          tagColor: 'bg-gray-800 text-gray-200'
        };
      case 2:
        return {
          container: 'bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-900/80 border-2 border-blue-400 shadow-xl shadow-blue-500/40',
          rankBg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
          badgeIcon: <FaGem className="text-blue-200 text-xl" />,
          badgeColor: 'text-blue-300',
          rankText: 'text-blue-100 font-black',
          nameText: 'text-white font-bold',
          scoreText: 'text-blue-200 font-bold',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]',
          playerTag: 'ELITE',
          tagColor: 'bg-blue-900/60 text-blue-200'
        };
      case 3:
        return {
          container: 'bg-gradient-to-br from-red-900/70 via-red-800/60 to-red-900/80 border-2 border-red-500 shadow-xl shadow-red-600/40',
          rankBg: 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600',
          badgeIcon: <FaGem className="text-red-300 text-xl" />,
          badgeColor: 'text-red-400',
          rankText: 'text-red-100 font-black',
          nameText: 'text-white font-bold',
          scoreText: 'text-red-200 font-bold',
          glow: 'shadow-[0_0_18px_rgba(239,68,68,0.5)]',
          playerTag: 'PRO',
          tagColor: 'bg-red-900/60 text-red-200'
        };
      case 4:
        return {
          container: 'bg-gradient-to-br from-emerald-900/70 via-emerald-800/60 to-emerald-900/80 border-2 border-emerald-500 shadow-lg shadow-emerald-600/40',
          rankBg: 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600',
          badgeIcon: <FaGem className="text-emerald-300 text-xl" />,
          badgeColor: 'text-emerald-400',
          rankText: 'text-emerald-100 font-bold',
          nameText: 'text-gray-200 font-bold',
          scoreText: 'text-emerald-200 font-bold',
          glow: 'shadow-[0_0_16px_rgba(16,185,129,0.5)]'
        };
      case 5:
        return {
          container: 'bg-gradient-to-br from-purple-900/70 via-purple-800/60 to-purple-900/80 border-2 border-purple-400 shadow-lg shadow-purple-600/40',
          rankBg: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
          badgeIcon: <FaGem className="text-purple-300 text-xl" />,
          badgeColor: 'text-purple-400',
          rankText: 'text-purple-100 font-bold',
          nameText: 'text-gray-200 font-semibold',
          scoreText: 'text-purple-200 font-bold',
          glow: 'shadow-[0_0_14px_rgba(168,85,247,0.4)]'
        };
      case 6:
        return {
          container: 'bg-gradient-to-br from-yellow-900/70 via-amber-800/60 to-yellow-900/80 border-2 border-yellow-500 shadow-lg shadow-yellow-600/30',
          rankBg: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600',
          badgeIcon: <FaMedal className="text-yellow-300 text-xl" />,
          badgeColor: 'text-yellow-400',
          rankText: 'text-yellow-100 font-bold',
          nameText: 'text-gray-200 font-semibold',
          scoreText: 'text-yellow-200 font-bold',
          glow: 'shadow-[0_0_12px_rgba(234,179,8,0.4)]'
        };
      case 7:
        return {
          container: 'bg-gradient-to-br from-gray-200/20 via-gray-300/20 to-gray-400/20 border-2 border-gray-400 shadow-md shadow-gray-500/20',
          rankBg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          badgeIcon: <FaMedal className="text-gray-300 text-xl" />,
          badgeColor: 'text-gray-400',
          rankText: 'text-gray-100 font-bold',
          nameText: 'text-gray-300 font-semibold',
          scoreText: 'text-gray-200 font-bold',
          glow: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-amber-900/50 via-amber-800/40 to-orange-900/50 border border-amber-700 shadow-md shadow-amber-800/20',
          rankBg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-orange-800',
          badgeIcon: <FaMedal className="text-amber-300 text-xl" />,
          badgeColor: 'text-amber-500',
          rankText: 'text-amber-100 font-bold',
          nameText: 'text-gray-400 font-medium',
          scoreText: 'text-amber-200 font-bold',
          glow: ''
        };
    }
  };

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-5 bg-gradient-to-br from-gray-900/40 to-black/40 rounded-full mb-4 border border-gray-700">
          <FaTrophy className="text-4xl text-gray-400" />
        </div>
        <p className="text-gray-300 font-medium mb-2">No scores yet</p>
        <p className="text-gray-500 text-sm">Be the first champion!</p>
      </div>
    );
  }

  // Show ALL players (not just top 10)
  const displayCount = leaderboard.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/50 to-black/50 px-6 py-3 rounded-2xl border border-gray-700 shadow-xl">
          <div className="relative">
            <FaCrown className="text-2xl text-yellow-400 animate-pulse" />
            <FaFire className="absolute -top-1 -right-1 text-xs text-orange-500" />
          </div>
          <h3 className="text-lg font-black bg-gradient-to-r from-gray-200 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
            LEADERBOARD
          </h3>
          <div className="text-xs text-gray-400 bg-gray-900/50 px-2 py-1 rounded-full">
            {leaderboard.length} PLAYERS
          </div>
        </div>
      </div>

      {/* Scrollable Leaderboard Cards - Shows ALL players */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {leaderboard.map((player, index) => {
          const rank = index + 1;
          const style = getRankStyle(rank);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.03,
                type: "spring",
                stiffness: 120,
                damping: 12
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.15 }
              }}
              className={`relative rounded-xl p-4 ${style.container} ${style.glow} backdrop-blur-md overflow-visible ${style.effect} w-full`}
            >
              <div className="flex items-center justify-between w-full">
                {/* Left Side: Rank Number */}
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 rounded-full ${style.rankBg} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${style.rankText}`}>
                      {rank}
                    </span>
                  </div>
                </div>

                {/* Middle: Profile Pic and Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                      rank === 1 ? 'border-gray-500' :
                      rank === 2 ? 'border-blue-400/50' :
                      rank === 3 ? 'border-red-400/50' :
                      rank === 4 ? 'border-emerald-400/50' :
                      rank === 5 ? 'border-purple-400/50' :
                      rank === 6 ? 'border-yellow-400/50' :
                      rank === 7 ? 'border-gray-300/50' :
                      'border-amber-600/50'
                    }`}>
                      {player.playerAvatar || '👤'}
                    </div>
                  </div>

                  {/* Name and Tag */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-base truncate ${style.nameText}`}>
                        {player.playerName?.slice(0, 16) || 'Anonymous'}
                      </h4>
                      {rank <= 3 && style.playerTag && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.tagColor}`}>
                          {style.playerTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Score and Badge */}
                <div className="flex items-center gap-3 ml-2">
                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-xl font-black ${style.scoreText}`}>
                      {player.score}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      POINTS
                    </div>
                  </div>

                  {/* Badge Icon */}
                  <div className="flex flex-col items-center justify-center">
                    <div className={`relative ${style.badgeColor} text-2xl`}>
                      {style.badgeIcon}
                      {rank === 1 && (
                        <FaCrown className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Simple Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-800/40 flex-shrink-0">
        <p className="text-xs text-gray-500 text-center">
          All players displayed • Updated in real-time
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;