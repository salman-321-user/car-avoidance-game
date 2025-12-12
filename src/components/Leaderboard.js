import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import {
  FaCrown,
  FaFire
} from 'react-icons/fa';

const Leaderboard = () => {
  const { leaderboard } = useGame();

  // Function to check if photoURL is a base64 image
  const isBase64Image = (url) => {
    return typeof url === 'string' && url.startsWith('data:image');
  };

  // Function to render profile avatar
  const renderProfileAvatar = (avatar, rank) => {
    if (!avatar) {
      return '👤'; // Default emoji if no avatar
    }

    if (isBase64Image(avatar)) {
      // If it's a base64 image, render as img tag
      return (
        <img
          src={avatar}
          alt="Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
      );
    } else {
      // If it's an emoji, render as text
      return <span className="text-xl md:text-2xl">{avatar}</span>;
    }
  };

  // Preload rank badge images
  const rankBadges = {
    1: process.env.PUBLIC_URL + '/BDiamond.png',
    2: process.env.PUBLIC_URL + '/Diamond.png',
    3: process.env.PUBLIC_URL + '/Ruby.png',
    4: process.env.PUBLIC_URL + '/Emerald.png',
    5: process.env.PUBLIC_URL + '/Platinum.png',
    6: process.env.PUBLIC_URL + '/Gold.png',
    7: process.env.PUBLIC_URL + '/Silver.png',
    8: process.env.PUBLIC_URL + '/Bronze.png',
  };

  // Rank names for each position
  const getRankName = (rank) => {
    switch (rank) {
      case 1: return 'BLACK DIAMOND';
      case 2: return 'DIAMOND';
      case 3: return 'RUBY';
      case 4: return 'EMERALD';
      case 5: return 'PLATINUM';
      case 6: return 'GOLD';
      case 7: return 'SILVER';
      case 8: return 'BRONZE';
      default: return 'BRONZE';
    }
  };

  // Player tags (moved under name)
  const getPlayerTag = (rank) => {
    switch (rank) {
      case 1: return 'LEGEND';
      case 2: return 'ELITE';
      case 3: return 'PRO';
      default: return '';
    }
  };

  // Get badge icon - ALL ranks use images now with crown for rank 1
  const getBadgeIcon = (rank, style) => {
    const badgeImage = rankBadges[rank] || rankBadges[8]; // Fallback to bronze
    
    return (
      <div className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11">
        <img
          src={badgeImage}
          alt={`${getRankName(rank)} Badge`}
          className="w-full h-full object-contain drop-shadow-lg"
          onError={(e) => {
            // Fallback if image doesn't load
            e.target.style.display = 'none';
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = `flex items-center justify-center w-full h-full rounded-full ${style.rankBg}`;
            fallbackDiv.innerHTML = `
              <div class="text-xl md:text-2xl font-bold ${style.rankText}">
                ${rank}
              </div>
            `;
            e.target.parentElement.replaceChild(fallbackDiv, e.target);
          }}
        />
        {/* Crown on top of Black Diamond */}
        {rank === 1 && (
          <FaCrown className="absolute -top-2 -right-2 text-yellow-400 text-sm md:text-base animate-pulse drop-shadow-lg" />
        )}
      </div>
    );
  };

  const getRankStyle = (rank) => {
    const rankName = getRankName(rank);
    const playerTag = getPlayerTag(rank);

    const baseStyles = {
      1: {
        // Black Diamond - EXCLUSIVE Cosmic Gradient with Crown
        container: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black border-2 border-purple-400 shadow-2xl shadow-purple-600/70',
        rankBg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
        rankText: 'text-white font-black',
        nameText: 'text-white font-bold text-sm md:text-base',
        scoreText: 'text-purple-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_30px_rgba(147,51,234,0.7)]',
        effect: 'animate-pulse',
        tagColor: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg',
        avatarBorder: 'border-purple-400/70 shadow-lg shadow-purple-400/50',
        rankNameColor: 'text-purple-300',
        rankNameBg: 'bg-gradient-to-r from-purple-800/90 to-black/90',
        badgeColor: 'text-purple-300'
      },
      2: {
        // Diamond - Crystal Blue with Neon Cyan
        container: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-teal-900 border-2 border-cyan-300 shadow-xl shadow-cyan-400/40',
        rankBg: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600',
        rankText: 'text-white font-black',
        nameText: 'text-white font-bold text-sm md:text-base',
        scoreText: 'text-cyan-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_18px_rgba(34,211,238,0.4)]',
        tagColor: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-cyan-100 text-xs font-bold shadow-md',
        avatarBorder: 'border-cyan-300/60',
        rankNameColor: 'text-cyan-300',
        rankNameBg: 'bg-cyan-900/90',
        badgeColor: 'text-cyan-200'
      },
      3: {
        // Ruby - Deep Ruby Red with Pink Glow
        container: 'bg-gradient-to-br from-rose-900 via-red-900 to-pink-900 border-2 border-rose-400 shadow-xl shadow-rose-500/40',
        rankBg: 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-700',
        rankText: 'text-white font-black',
        nameText: 'text-white font-bold text-sm md:text-base',
        scoreText: 'text-rose-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]',
        tagColor: 'bg-gradient-to-r from-rose-600 to-red-700 text-rose-100 text-xs font-bold shadow-md',
        avatarBorder: 'border-rose-400/60',
        rankNameColor: 'text-rose-300',
        rankNameBg: 'bg-rose-900/90',
        badgeColor: 'text-rose-300'
      },
      4: {
        // Emerald - Forest Green with Emerald Glow
        container: 'bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 border-2 border-emerald-400 shadow-lg shadow-emerald-500/40',
        rankBg: 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600',
        rankText: 'text-white font-bold',
        nameText: 'text-white font-bold text-sm md:text-base',
        scoreText: 'text-emerald-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_16px_rgba(52,211,153,0.4)]',
        tagColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-emerald-100 text-xs font-bold shadow-md',
        avatarBorder: 'border-emerald-400/60',
        rankNameColor: 'text-emerald-300',
        rankNameBg: 'bg-emerald-900/90',
        badgeColor: 'text-emerald-300'
      },
      5: {
        // Platinum - Royal Purple with Violet Accents
        container: 'bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 border-2 border-violet-400 shadow-lg shadow-violet-500/40',
        rankBg: 'bg-gradient-to-br from-violet-400 via-purple-500 to-violet-600',
        rankText: 'text-white font-bold',
        nameText: 'text-white font-semibold text-sm md:text-base',
        scoreText: 'text-violet-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_16px_rgba(139,92,246,0.4)]',
        tagColor: 'bg-gradient-to-r from-violet-500 to-purple-600 text-violet-100 text-xs font-bold shadow-md',
        avatarBorder: 'border-violet-400/60',
        rankNameColor: 'text-violet-300',
        rankNameBg: 'bg-violet-900/90',
        badgeColor: 'text-violet-300'
      },
      6: {
        // Gold - Sun Gold with Amber Glow
        container: 'bg-gradient-to-br from-amber-800 via-yellow-800 to-orange-800 border-2 border-yellow-400 shadow-lg shadow-yellow-500/30',
        rankBg: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600',
        rankText: 'text-yellow-900 font-bold',
        nameText: 'text-yellow-100 font-semibold text-sm md:text-base',
        scoreText: 'text-yellow-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_14px_rgba(234,179,8,0.3)]',
        tagColor: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-yellow-900 text-xs font-bold shadow-md',
        avatarBorder: 'border-yellow-400/60',
        rankNameColor: 'text-yellow-300',
        rankNameBg: 'bg-yellow-800/90',
        badgeColor: 'text-yellow-300'
      },
      7: {
        // Silver - Steel Gray with Silver Sheen
        container: 'bg-gradient-to-br from-gray-700 via-slate-700 to-zinc-700 border-2 border-gray-300 shadow-md shadow-gray-400/30',
        rankBg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
        rankText: 'text-gray-800 font-bold',
        nameText: 'text-gray-200 font-semibold text-sm md:text-base',
        scoreText: 'text-gray-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_12px_rgba(156,163,175,0.3)]',
        tagColor: 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-800 text-xs font-bold shadow-md',
        avatarBorder: 'border-gray-300/50',
        rankNameColor: 'text-gray-400',
        rankNameBg: 'bg-gray-700/90',
        badgeColor: 'text-gray-300'
      },
      default: {
        // Bronze - Copper Orange with Warm Glow
        container: 'bg-gradient-to-br from-orange-800 via-amber-800 to-amber-900 border-2 border-amber-500 shadow-md shadow-amber-600/30',
        rankBg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600',
        rankText: 'text-amber-900 font-bold',
        nameText: 'text-amber-100 font-medium text-sm md:text-base',
        scoreText: 'text-amber-200 font-bold text-lg md:text-xl',
        glow: 'shadow-[0_0_12px_rgba(217,119,6,0.3)]',
        tagColor: 'bg-gradient-to-r from-amber-500 to-orange-600 text-amber-900 text-xs font-bold shadow-md',
        avatarBorder: 'border-amber-500/50',
        rankNameColor: 'text-amber-400',
        rankNameBg: 'bg-amber-800/90',
        badgeColor: 'text-amber-300'
      }
    };

    return {
      ...baseStyles[rank <= 8 ? rank : 'default'],
      rankName,
      playerTag
    };
  };

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block p-5 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-full mb-4 border border-purple-400/30">
          <FaCrown className="text-4xl text-purple-400 animate-pulse" />
        </div>
        <p className="text-gray-300 font-medium mb-2 text-sm md:text-base">No scores yet</p>
        <p className="text-gray-500 text-xs md:text-sm">Be the first champion!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4 flex-shrink-0 px-2">
        <div className="relative inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-purple-400/30 shadow-lg">
          <div className="relative">
            <FaCrown className="text-xl md:text-2xl text-yellow-400 animate-pulse" />
            <FaFire className="absolute -top-1 -right-1 text-xs text-orange-500" />
          </div>
          <h3 className="text-base md:text-lg font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
            LEADERBOARD
          </h3>
          <div className="text-xs text-purple-100 bg-purple-800/40 px-2 py-1 rounded-full">
            {leaderboard.length} PLAYERS
          </div>
        </div>
      </div>

      {/* Scrollable Leaderboard Cards with INLINE labels */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 px-2">
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
              className={`relative rounded-xl p-3 md:p-4 ${style.container} ${style.glow} backdrop-blur-sm overflow-visible w-full ${rank === 1 ? 'animate-pulse' : ''}`}
            >
              {/* Inline Rank Label - Doesn't take extra space */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${style.rankBg} flex items-center justify-center shadow-md`}>
                    <span className={`text-xs md:text-sm font-bold ${style.rankText}`}>
                      {rank}
                    </span>
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold uppercase ${style.rankNameColor} tracking-wider`}>
                    {style.rankName}
                  </span>
                </div>
                
                {/* Score Display */}
                <div className="text-right">
                  <div className={`${style.scoreText} drop-shadow-md text-lg md:text-xl`}>
                    {player.score}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-gray-300/80 font-medium">
                    POINTS
                  </div>
                </div>
              </div>

              {/* Player Info Row */}
              <div className="flex items-center justify-between w-full">
                {/* Left Side: Avatar and Name */}
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 ${style.avatarBorder} flex items-center justify-center bg-gray-900/40`}>
                      {renderProfileAvatar(player.playerAvatar, rank)}
                    </div>
                  </div>

                  {/* Name and Tag */}
                  <div className="min-w-0 flex-1">
                    <h4 className={`truncate ${style.nameText}`}>
                      {player.playerName?.slice(0, 14) || 'Anonymous'}
                    </h4>
                    {style.playerTag && (
                      <div className="mt-0.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${style.tagColor} shadow-sm`}>
                          {style.playerTag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Badge Icon with Crown for Rank 1 */}
                <div className="flex items-center justify-center">
                  {getBadgeIcon(rank, style)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Simple Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-700/30 flex-shrink-0 px-2">
        <p className="text-xs text-gray-500 text-center">
          All players displayed • Updated in real-time
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;