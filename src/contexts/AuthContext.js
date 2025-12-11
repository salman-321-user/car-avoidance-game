import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        });
      }
      
      return user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...userProfile,
        ...profileData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      setUserProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // Delete user account and all associated data
  const deleteAccount = async () => {
    if (!currentUser) return;

    try {
      const uid = currentUser.uid;
      
      // 1. Delete user profile from Firestore
      await deleteDoc(doc(db, 'users', uid));
      
      // 2. Delete user's score from Firestore
      const scoreDocRef = doc(db, 'scores', uid);
      const scoreDoc = await getDoc(scoreDocRef);
      if (scoreDoc.exists()) {
        await deleteDoc(scoreDocRef);
      }
      
      // 3. Delete user from authentication
      await deleteUser(currentUser);
      
      // 4. Clear local state
      setCurrentUser(null);
      setUserProfile(null);
      
      console.log("Account deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // If user needs to re-authenticate before deletion
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please re-login and try again to delete your account.');
      }
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
    updateUserProfile,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};