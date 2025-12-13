import { FaUser, FaCheck, FaTrash, FaUpload, FaTimes, FaChevronLeft, FaChevronRight, FaSpinner, FaGoogle, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileSetup = () => {
  const navigate = useNavigate();
  // UPDATED: Include reauthenticateWithGoogle from useAuth
  const { userProfile, updateUserProfile, deleteAccount, reauthenticateWithGoogle } = useAuth(); 
  
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state for update loading
  const [currentEmojiPage, setCurrentEmojiPage] = useState(0);
  const [needsReauth, setNeedsReauth] = useState(false); // NEW STATE
  const fileInputRef = useRef(null);

  const avatars = [
    '🚗', '🏎️', '🚙', '🚕', '🚓', '🚑', '🚒', '🚐',
    '⚽', '🚚', '🚛', '🚜', '😻', '👧', '👦',
    '🏍️', '🛵', '🚲', '🛴',
    '🛶', '🚤', '🛸', '🚁', '✈️', '🛳️',
    '🚂', '🛺', '🛹', '🏎️', '🚓'
  ];

  // Calculate emojis per page
  const EMOJIS_PER_PAGE = 8;
  const totalPages = Math.ceil(avatars.length / EMOJIS_PER_PAGE);

  // Get current page emojis
  const getCurrentPageEmojis = () => {
    const start = currentEmojiPage * EMOJIS_PER_PAGE;
    const end = start + EMOJIS_PER_PAGE;
    return avatars.slice(start, end);
  };

  // Navigation functions
  const nextEmojiPage = () => {
    if (currentEmojiPage < totalPages - 1) {
      setCurrentEmojiPage(currentEmojiPage + 1);
    }
  };

  const prevEmojiPage = () => {
    if (currentEmojiPage > 0) {
      setCurrentEmojiPage(currentEmojiPage - 1);
    }
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      // Check if photoURL is a base64 image or emoji
      if (userProfile.photoURL && userProfile.photoURL.startsWith('data:image')) {
        setImagePreview(userProfile.photoURL);
        setUploadedImage(userProfile.photoURL);
        setSelectedAvatar('');
      } else {
        // Check if the saved emoji exists in our avatars list
        const savedEmoji = userProfile.photoURL || '🚗';
        setSelectedAvatar(savedEmoji);

        // Find the page where this emoji is located
        const emojiIndex = avatars.indexOf(savedEmoji);
        if (emojiIndex !== -1) {
          const page = Math.floor(emojiIndex / EMOJIS_PER_PAGE);
          setCurrentEmojiPage(page);
        }

        setImagePreview('');
        setUploadedImage(null);
      }
    }
  }, [userProfile]);

  // Check if form is complete (has name AND either avatar or image)
  const isFormComplete = () => {
    return displayName.trim() && (selectedAvatar || uploadedImage);
  };

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 800; // Maximum dimension

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get base64 with quality adjustment
          let quality = 0.8;
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

          // If still too large, reduce quality further
          while (compressedBase64.length > 500 * 1024 && quality > 0.1) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          }

          // If still too large after quality reduction, resize more
          if (compressedBase64.length > 500 * 1024) {
            width = Math.floor(width * 0.8);
            height = Math.floor(height * 0.8);
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          }

          console.log(`Original: ${Math.round(file.size / 1024)}KB, Compressed: ${Math.round(compressedBase64.length / 1024)}KB`);
          resolve(compressedBase64);
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (before compression)
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size should be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Compress image if needed
      const compressedImage = await compressImage(file);
      setUploadedImage(compressedImage);
      setImagePreview(compressedImage);
      setSelectedAvatar(''); // Clear emoji selection when image is uploaded

      console.log('Image compressed successfully');
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try another one.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    setSelectedAvatar('🚗'); // Set default emoji
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (isUpdating) return; // Prevent multiple clicks

    setIsUpdating(true);

    try {
      // Use uploaded image if available, otherwise use selected emoji
      const photoURL = uploadedImage || selectedAvatar;

      await updateUserProfile({
        displayName: displayName.trim(),
        photoURL: photoURL,
      });
      setIsUpdated(true);
      
      // Show success message for 3 seconds
      setTimeout(() => setIsUpdated(false), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // UPDATED: handleDeleteAccount function to handle REAUTH_REQUIRED error
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? All your data will be lost.')) return;
    
    if (needsReauth) {
      if (!window.confirm('For security, you need to re-authenticate with Google before deleting your account. Continue?')) return;
    }
    
    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (error) {
      if (error.message === 'REAUTH_REQUIRED') {
        setNeedsReauth(true);
        alert('For security reasons, please re-authenticate with Google to delete your account.');
      } else {
        alert(error.message || 'Failed to delete account. Please try again.');
        console.error(error);
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  // END UPDATED handleDeleteAccount

  // Handle cross button click
  const handleCrossClick = () => {
    if (isFormComplete()) {
      navigate('/game');
    } else {
      alert('Please complete your profile first! You need to:\n1. Enter your name\n2. Select an emoji OR upload a photo');
    }
  };

  // Handle emoji selection - FIXED FUNCTION
  const handleEmojiSelect = (emoji) => {
    if (!uploadedImage) {
      console.log("Selecting emoji:", emoji, "Previous:", selectedAvatar);
      setSelectedAvatar(emoji);
      // Only remove uploaded image if there is one
      if (uploadedImage) {
        removeUploadedImage();
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full h-full max-h-[90vh] relative"
      >
        {/* Close Button - Now conditional */}
        <button
          onClick={handleCrossClick}
          className={`absolute top-3 right-3 text-2xl font-bold z-50 ${isFormComplete()
              ? 'text-gray-300 hover:text-white cursor-pointer'
              : 'text-gray-600 cursor-not-allowed'
            }`}
          title={isFormComplete() ? "Close" : "Please complete profile first"}
          disabled={isUpdating || isDeleting} // Disable when loading
        >
          ×
        </button>

        <div className="h-full flex flex-col bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700">
          {/* Header - Fixed */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <FaUser className="text-2xl text-blue-500" />
              <h1 className="text-2xl font-bold">
                Edit Profile
              </h1>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Success Message */}
            {isUpdated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg"
              >
                <p className="text-green-400 text-sm font-bold">✓ Profile updated successfully!</p>
              </motion.div>
            )}

            {/* Loading Overlay for Update */}
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center gap-4">
                  <FaSpinner className="text-3xl text-blue-400 animate-spin" />
                  <p className="text-gray-300 font-medium">Updating profile...</p>
                  <p className="text-xs text-gray-500">This may take a few seconds</p>
                </div>
              </motion.div>
            )}

            {/* Re-authentication Required Message - NEW BLOCK */}
            {needsReauth && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationTriangle className="text-yellow-400" />
                  <p className="text-yellow-400 font-medium">Re-authentication Required</p>
                </div>
                <p className="text-sm text-yellow-300 mb-3">
                  You need to re-authenticate with Google to delete your account.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    try {
                      await reauthenticateWithGoogle();
                      setNeedsReauth(false);
                      alert('Re-authenticated successfully! You can now delete your account.');
                    } catch (error) {
                      alert('Failed to re-authenticate: ' + error.message);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-bold"
                >
                  <FaGoogle />
                  Re-authenticate with Google
                </motion.button>
              </motion.div>
            )}
            {/* END NEW BLOCK */}

            {/* Status Indicator */}
            {!isFormComplete() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg"
              >
                <p className="text-yellow-400 text-sm">
                  ⚠️ Please complete your profile to continue
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Selection - Now with Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">
                  Choose Avatar or Upload Photo
                </label>

                {/* Current Selection Preview */}
                <div className="mb-4 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 flex items-center justify-center bg-gray-900">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeUploadedImage}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                            title="Remove photo"
                            disabled={isUpdating || isUploading}
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <span className="text-4xl">
                          {selectedAvatar || '🚗'}
                        </span>
                      )}
                    </div>
                    {(isUploading || isUpdating) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {imagePreview ? 'Uploaded Photo' : selectedAvatar ? 'Selected Emoji' : 'No selection'}
                  </p>
                </div>

                {/* Image Upload Button */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    disabled={isUpdating}
                  />
                  <motion.label
                    htmlFor="image-upload"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 w-full p-3 border rounded-lg cursor-pointer transition-all ${isUpdating
                        ? 'bg-gray-800 border-gray-600 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 border-gray-700'
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="text-blue-400 animate-spin" />
                        <span className="text-sm font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaUpload className="text-blue-400" />
                        <span className="text-sm font-medium">Upload Photo</span>
                      </>
                    )}
                  </motion.label>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Upload any image (will be compressed to max 500KB)
                  </p>
                </div>

                {/* Emoji Selection Grid - SIMPLIFIED FIX */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Or choose an emoji:</p>
                    <div className="text-xs text-gray-500">
                      Page {currentEmojiPage + 1} of {totalPages}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {getCurrentPageEmojis().map((avatar, index) => {
                      // SIMPLIFIED: Check if this emoji is the currently selected one
                      const isSelected = avatar === selectedAvatar;

                      return (
                        <motion.button
                          key={`${currentEmojiPage}-${index}`}
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEmojiSelect(avatar)}
                          className={`text-2xl p-3 rounded-lg transition-all ${isSelected
                              ? 'bg-blue-600 ring-2 ring-blue-400 transform scale-105'
                              : 'bg-gray-900 hover:bg-gray-700'
                            } ${uploadedImage || isUpdating ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          disabled={!!uploadedImage || isUpdating}
                        >
                          {avatar}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <button
                        type="button"
                        onClick={prevEmojiPage}
                        disabled={currentEmojiPage === 0 || isUpdating}
                        className={`p-2 rounded-lg ${currentEmojiPage === 0 || isUpdating
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                      >
                        <FaChevronLeft />
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentEmojiPage(index)}
                            disabled={isUpdating}
                            className={`w-2 h-2 rounded-full ${currentEmojiPage === index
                                ? 'bg-blue-500'
                                : 'bg-gray-600 hover:bg-gray-500'
                              } ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={nextEmojiPage}
                        disabled={currentEmojiPage === totalPages - 1 || isUpdating}
                        className={`p-2 rounded-lg ${currentEmojiPage === totalPages - 1 || isUpdating
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}

                  {uploadedImage && (
                    <p className="text-xs text-yellow-500 mt-2 text-center">
                      Remove photo to select an emoji
                    </p>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your game name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${isUpdating
                      ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 border-gray-700 focus:border-blue-500'
                    }`}
                  maxLength={15}
                  autoFocus
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 15 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${isUpdating || isUploading || !isFormComplete()
                      ? 'bg-gradient-to-r from-blue-800 to-purple-800 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                    }`}
                  disabled={isUploading || !isFormComplete() || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      {isFormComplete() ? 'Update Profile' : 'Complete Profile First'}
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${isDeleting || isUploading || isUpdating
                      ? 'bg-gradient-to-r from-red-800 to-red-900 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90'
                    }`}
                  disabled={isDeleting || isUploading || isUpdating}
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Delete Account
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Requirements List */}
            <div className="mt-6 p-3 bg-gray-900/30 rounded-lg">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Requirements:</h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className={`flex items-center gap-1 ${displayName.trim() ? 'text-green-400' : ''}`}>
                  {displayName.trim() ? '✓' : '○'} Enter your name
                </li>
                <li className={`flex items-center gap-1 ${selectedAvatar || uploadedImage ? 'text-green-400' : ''}`}>
                  {selectedAvatar || uploadedImage ? '✓' : '○'} Select emoji OR upload photo
                </li>
                <li className={`flex items-center gap-1 ${isFormComplete() ? 'text-green-400' : ''}`}>
                  {isFormComplete() ? '✓' : '○'} Complete profile to continue
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4 border border-red-500">
              <h3 className="text-xl font-bold text-red-500 mb-3">Delete Account</h3>
              {/* RE-AUTH STATUS INSIDE MODAL */}
              {needsReauth && (
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-yellow-400" />
                    <p className="text-yellow-400 font-medium">Re-authentication Required</p>
                  </div>
                  <p className="text-sm text-yellow-300 mb-3">
                    You need to re-authenticate with Google to delete your account.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        await reauthenticateWithGoogle();
                        setNeedsReauth(false);
                        alert('Re-authenticated successfully! You can now delete your account.');
                      } catch (error) {
                        alert('Failed to re-authenticate: ' + error.message);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-bold"
                  >
                    <FaGoogle />
                    Re-authenticate with Google
                  </motion.button>
                </div>
              )}
              {/* END RE-AUTH STATUS */}

              <p className="text-gray-300 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSetup;