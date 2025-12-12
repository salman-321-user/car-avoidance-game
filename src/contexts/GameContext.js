import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  doc,
  getDoc,
  setDoc,
  updateDoc // Added this import
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const { currentUser, userProfile } = useAuth();
  
  // Use ref to track if score is already being saved
  const isSavingRef = useRef(false);

  // Load user's high score when user changes
  useEffect(() => {
    const loadHighScore = async () => {
      if (!currentUser) {
        setHighScore(0);
        return;
      }

      try {
        // Try to get user's score document
        const userScoreDoc = await getDoc(doc(db, 'scores', currentUser.uid));
        
        if (userScoreDoc.exists()) {
          const userScore = userScoreDoc.data().score;
          setHighScore(userScore);
          console.log("Loaded high score:", userScore);
        } else {
          setHighScore(0);
          console.log("No existing high score found");
        }
      } catch (error) {
        console.error("Error loading high score:", error);
        setHighScore(0);
      }
    };

    if (currentUser) {
      loadHighScore();
    }
  }, [currentUser]);

  // Subscribe to leaderboard updates - get all scores sorted by score
  useEffect(() => {
    const q = query(
      collection(db, 'scores'),
      orderBy('score', 'desc'),
      limit(20) // Get more scores for better leaderboard
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const scores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter to show only top 10 unique players (best score per player)
        const uniquePlayers = new Map();
        scores.forEach(score => {
          if (!uniquePlayers.has(score.playerId) || 
              score.score > uniquePlayers.get(score.playerId).score) {
            uniquePlayers.set(score.playerId, score);
          }
        });
        
        const topScores = Array.from(uniquePlayers.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        setLeaderboard(topScores);
      }, 
      (error) => {
        console.error("Leaderboard subscription error:", error);
      }
    );

    return unsubscribe;
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setGameSpeed(1);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const endGame = () => {
    if (gameState === 'game-over') return; // Prevent multiple calls
    
    setGameState('game-over');
    
    // Auto-save score when game ends (with debounce)
    if (currentUser && userProfile && score > 0 && !isSavingRef.current) {
      setTimeout(() => {
        saveScore();
      }, 500); // Small delay to ensure state is updated
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setLevel(1);
    setGameSpeed(1);
  };

  const updateScore = (newScore) => {
    setScore(newScore);
    
    // Level up every 20 points (changed from 30)
    const newLevel = Math.floor(newScore / 20) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Increase game speed with each level
      setGameSpeed(1 + (newLevel - 1) * 0.5);
    }
  };

  // Function to update avatar in scores collection when profile changes
  const updateScoreAvatar = async (newAvatar) => {
    if (!currentUser) return;
    
    try {
      const scoreDocRef = doc(db, 'scores', currentUser.uid);
      const scoreDoc = await getDoc(scoreDocRef);
      
      if (scoreDoc.exists()) {
        // Update only the playerAvatar field
        await updateDoc(scoreDocRef, {
          playerAvatar: newAvatar
        });
        console.log("Score document avatar updated successfully");
      }
    } catch (error) {
      console.error("Error updating score document avatar:", error);
      // Don't throw error - we don't want to fail the main operation
    }
  };

  // Function to update player name in scores collection when profile changes
  const updateScoreName = async (newName) => {
    if (!currentUser) return;
    
    try {
      const scoreDocRef = doc(db, 'scores', currentUser.uid);
      const scoreDoc = await getDoc(scoreDocRef);
      
      if (scoreDoc.exists()) {
        // Update only the playerName field
        await updateDoc(scoreDocRef, {
          playerName: newName
        });
        console.log("Score document player name updated successfully");
      }
    } catch (error) {
      console.error("Error updating score document player name:", error);
      // Don't throw error - we don't want to fail the main operation
    }
  };

  const saveScore = async () => {
    // Prevent multiple saves
    if (isSavingRef.current) {
      console.log("Already saving score, skipping...");
      return;
    }
    
    if (!currentUser || !userProfile || score <= 0) {
      console.log("Cannot save score: No user or invalid score");
      return;
    }

    // Only save if score is higher than previous high score
    if (score <= highScore && highScore > 0) {
      console.log(`Score ${score} not higher than high score ${highScore}. Not saving.`);
      return;
    }

    isSavingRef.current = true;
    
    try {
      // Use user's UID as document ID to ensure only one document per user
      const scoreDocRef = doc(db, 'scores', currentUser.uid);
      
      const scoreData = {
        playerId: currentUser.uid,
        playerName: userProfile.displayName || 'Anonymous',
        playerAvatar: userProfile.photoURL || '👤', // This uses the current avatar from userProfile
        score: score,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Use setDoc with merge to update or create
      await setDoc(scoreDocRef, scoreData, { merge: true });
      
      console.log("Score saved/updated successfully!");
      console.log("Document ID:", currentUser.uid);
      console.log("Score data:", scoreData);
      
      // Update high score locally
      setHighScore(score);
      
    } catch (error) {
      console.error("Error saving score:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    } finally {
      // Reset saving flag after 2 seconds to prevent rapid saves
      setTimeout(() => {
        isSavingRef.current = false;
      }, 2000);
    }
  };

  // Clean up function to reset saving flag
  useEffect(() => {
    return () => {
      isSavingRef.current = false;
    };
  }, []);

  const value = {
    gameState,
    score,
    level,
    highScore,
    leaderboard,
    gameSpeed,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    updateScore,
    saveScore,
    updateScoreAvatar, // Export this function so it can be used elsewhere
    updateScoreName,   // Export this function so it can be used elsewhere
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};