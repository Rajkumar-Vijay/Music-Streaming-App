import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { PlayerContext } from './context/PlayerContext';
import axios from 'axios';
import Songitem from './Songitem';
import Comments from './Comments';
import { FaHeart, FaRegHeart, FaShare, FaDownload, FaPlay, FaPause } from 'react-icons/fa';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { playTrack, isPlaying, track, togglePlay, currentPlaylist } = useContext(PlayerContext);
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchPlaylist();
    if (user) {
      checkIfLiked();
    }
  }, [id, user]);

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      
      const response = await axios.get(`http://localhost:4000/api/playlist/${id}`, {
        headers
      });
      
      setPlaylist(response.data.data);
      setEditData({
        name: response.data.data.name,
        description: response.data.data.description || '',
        isPublic: response.data.data.isPublic
      });
    } catch (error) {
      console.error('Error fetching playlist:', error);
      setError('Failed to load playlist');
      if (error.response?.status === 404) {
        navigate('/not-found');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/like/check/playlist/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking if playlist is liked:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (liked) {
        await axios.delete(`http://localhost:4000/api/like/playlist/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      } else {
        await axios.post(`http://localhost:4000/api/like/playlist/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }
      setLiked(!liked);
      // Update likes count in the playlist object
      setPlaylist({
        ...playlist,
        likesCount: liked ? playlist.likesCount - 1 : playlist.likesCount + 1
      });
    } catch (error) {
      console.error('Error liking/unliking playlist:', error);
    }
  };

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      playTrack(playlist.songs[0], playlist);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist.name,
        text: `Check out this playlist: ${playlist.name}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying link:', err));
    }
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('description', editData.description);
      formData.append('isPublic', editData.isPublic);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      const response = await axios.put(`http://localhost:4000/api/playlist/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setPlaylist(response.data.data);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
      alert('Failed to update playlist');
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete(`http://localhost:4000/api/playlist/${id}/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update the playlist in state
      setPlaylist({
        ...playlist,
        songs: playlist.songs.filter(song => song._id !== songId)
      });
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      alert('Failed to remove song from playlist');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!playlist) return null;

  const isOwner = user && playlist.user && user._id === playlist.user._id;
  const isCurrentlyPlaying = isPlaying && currentPlaylist && currentPlaylist._id === playlist._id;

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <img
            src={playlist.coverImage}
            alt={playlist.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <span className="text-sm bg-gray-700 px-2 py-1 rounded">
              {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          
          {playlist.description && (
            <p className="text-gray-400 mb-4">{playlist.description}</p>
          )}
          
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <p>Created by {playlist.user?.name || 'Unknown'}</p>
            <span className="mx-2">•</span>
            <p>{playlist.songs.length} songs</p>
            <span className="mx-2">•</span>
            <p>{playlist.likesCount} likes</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full transition"
              disabled={playlist.songs.length === 0}
            >
              {isCurrentlyPlaying ? <FaPause /> : <FaPlay />}
              {isCurrentlyPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={handleLike}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition"
            >
              <FaShare />
            </button>
            
            {isOwner && (
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Songs</h2>
        
        {playlist.songs.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">This playlist is empty</p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song) => (
              <div key={song._id} className="flex items-center">
                <Songitem
                  song={song}
                  onClick={() => playTrack(song, playlist)}
                  isActive={track && track._id === song._id}
                />
                
                {isOwner && (
                  <button
                    onClick={() => handleRemoveSong(song._id)}
                    className="ml-2 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Comments itemId={id} itemType="playlist" />
      </div>
      
      {/* Edit Playlist Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
            
            <form onSubmit={handleUpdatePlaylist}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description (optional)</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Cover Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={editData.isPublic}
                    onChange={(e) => setEditData({ ...editData, isPublic: e.target.checked })}
                    className="mr-2"
                  />
                  Make playlist public
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;