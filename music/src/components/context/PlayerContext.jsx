import { createContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [repeat, setRepeat] = useState('off'); // 'off', 'all', 'one'
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Fetch songs data
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/song/list');
        const songs = response.data.songs || [];
        setSongsData(songs);

        // Initialize queue with all songs if it's empty
        if (queue.length === 0 && songs.length > 0) {
          setQueue(songs);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setLoading(false);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/album/list');
        setAlbumsData(response.data.albums || []);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchSongs();
    fetchAlbums();
  }, []);

  // Fetch user playlists if user is logged in
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
        try {
          // Use the correct endpoint for fetching all playlists for the user
          const response = await axios.get('http://localhost:4000/api/playlist', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setPlaylists(response.data.data || []);
        } catch (error) {
          console.error('Error fetching playlists:', error);
          // Set empty playlists array on error to prevent further errors
          setPlaylists([]);
        }
      } else {
        // If no user is logged in, set playlists to empty array
        setPlaylists([]);
      }
    };

    fetchUserPlaylists();
  }, []);

  // Handle audio events
  useEffect(() => {
    if (audioRef.current) {
      // Set volume
      audioRef.current.volume = volume;

      // Play/pause
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }

      // Event listeners
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      const handleDurationChange = () => {
        setDuration(audioRef.current.duration);
      };

      const handleEnded = () => {
        if (repeat === 'one') {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
          playNext();
        }
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('durationchange', handleDurationChange);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('durationchange', handleDurationChange);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [isPlaying, volume, repeat]);

  // Play a track
  const playTrack = (song, playlist = null) => {
    setTrack(song);
    setIsPlaying(true);
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      const songIds = playlist.songs.map(s => s._id);
      const index = songIds.indexOf(song._id);
      setCurrentIndex(index);
      setQueue(playlist.songs);
    } else {
      setCurrentPlaylist(null);
      setCurrentIndex(0);
      setQueue([song]);
    }
  };

  // Play next track
  const playNext = () => {
    if (queue.length <= 1) return;

    let nextIndex;
    if (shuffle) {
      // Play random song (excluding current song)
      nextIndex = Math.floor(Math.random() * (queue.length - 1));
      if (nextIndex >= currentIndex) nextIndex += 1; // Skip current song
    } else {
      // Play next song or loop back to first
      nextIndex = (currentIndex + 1) % queue.length;
    }

    setCurrentIndex(nextIndex);
    setTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  // Play previous track
  const playPrevious = () => {
    if (queue.length <= 1) return;

    // If current time > 3 seconds, restart the song instead
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex;
    if (shuffle) {
      // Play random song (excluding current song)
      prevIndex = Math.floor(Math.random() * (queue.length - 1));
      if (prevIndex >= currentIndex) prevIndex += 1; // Skip current song
    } else {
      // Play previous song or loop to last
      prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    }

    setCurrentIndex(prevIndex);
    setTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  // Toggle repeat
  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  // Seek to a specific time
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Set volume
  const changeVolume = (newVolume) => {
    setVolume(newVolume);
  };

  // Add a song to the queue
  const addToQueue = (song) => {
    setQueue([...queue, song]);
  };

  // Remove a song from the queue
  const removeFromQueue = (index) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
    
    // Adjust currentIndex if necessary
    if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    } else if (index === currentIndex) {
      // If removing current song, play next song
      if (newQueue.length > 0) {
        const newIndex = Math.min(currentIndex, newQueue.length - 1);
        setCurrentIndex(newIndex);
        setTrack(newQueue[newIndex]);
      } else {
        setTrack(null);
        setIsPlaying(false);
        setCurrentIndex(0);
      }
    }
  };

  // Clear the queue
  const clearQueue = () => {
    setQueue([]);
    setTrack(null);
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        songsData,
        albumsData,
        playlists,
        setPlaylists,
        currentPlaylist,
        track,
        isPlaying,
        volume,
        repeat,
        shuffle,
        queue,
        currentIndex,
        duration,
        currentTime,
        loading,
        audioRef,
        playTrack,
        playNext,
        playPrevious,
        togglePlay,
        toggleShuffle,
        toggleRepeat,
        seekTo,
        changeVolume,
        addToQueue,
        removeFromQueue,
        clearQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
// import { createContext, useRef, useState, useEffect } from "react"
// import axios from "axios";

// export const PlayerContext = createContext();

// export const PlayerContextProvider = (props) => {
//   const audioRef = useRef();
//   const seekBg = useRef();
//   const seekBar = useRef();
//   const url = 'http://localhost:4000';
//   const [songsData, setSongsData] = useState([]);
//   const [albumsData, setAlbumsData] = useState([]);
//   const [track, setTrack] = useState(songsData[0]);
//   const [playStatus, setPlayStatus] = useState(false);
//   const [time, setTime] = useState({
//     currentTime: {
//       second: 0,
//       minute: 0
//     },
//     totalTime: {
//       second: 0,
//       minute: 0
//     }
//   });

//   const play = () => {
//     if (audioRef.current && track) {
//       try {
//         audioRef.current.play()
//           .then(() => setPlayStatus(true))
//           .catch(error => {
//             console.error("Error playing audio:", error);
//             setPlayStatus(false);
//           });
//       } catch (error) {
//         console.error("Error playing audio:", error);
//         setPlayStatus(false);
//       }
//     }
//   }

//   const pause = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       setPlayStatus(false);
//     }
//   }

//   const playWithId = async (id) => {
//     // Find the song by id (works with both numeric indices and string IDs)
//     const songToPlay = typeof id === 'number'
//       ? songsData[id]
//       : songsData.find(song => song.id === id || song._id === id);

//     if (songToPlay) {
//       await setTrack(songToPlay);
//       if (audioRef.current) {
//         try {
//           await audioRef.current.play();
//           setPlayStatus(true);
//         } catch (error) {
//           console.error("Error playing audio:", error);
//         }
//       }
//     } else {
//       console.error("Song not found with id:", id);
//     }
//   }

//   const previous = async () => {
//     if (!track || !songsData.length) return;

//     // Find the current index of the track in songsData
//     const currentIndex = songsData.findIndex(song =>
//       song.id === track.id || song._id === track._id
//     );

//     if (currentIndex > 0) {
//       const prevSong = songsData[currentIndex - 1];
//       await setTrack(prevSong);
//       if (audioRef.current) {
//         try {
//           await audioRef.current.play();
//           setPlayStatus(true);
//         } catch (error) {
//           console.error("Error playing previous track:", error);
//         }
//       }
//     }
//   }

//   const next = async () => {
//     if (!track || !songsData.length) return;

//     // Find the current index of the track in songsData
//     const currentIndex = songsData.findIndex(song =>
//       song.id === track.id || song._id === track._id
//     );

//     if (currentIndex < songsData.length - 1) {
//       const nextSong = songsData[currentIndex + 1];
//       await setTrack(nextSong);
//       if (audioRef.current) {
//         try {
//           await audioRef.current.play();
//           setPlayStatus(true);
//         } catch (error) {
//           console.error("Error playing next track:", error);
//         }
//       }
//     }
//   }

//   const seekSong = async (e) => {
//     if (audioRef.current && seekBg.current && audioRef.current.duration) {
//       try {
//         const newTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
//         audioRef.current.currentTime = newTime;
//       } catch (error) {
//         console.error("Error seeking song:", error);
//       }
//     }
//   }

//   const getSongsData = async () => {
//     try {
//       const response = await axios.get(`${url}/api/song/list`);
//       setSongsData(response.data.songs);
//       setTrack(response.data.songs[0]);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const getAlbumsData = async () => {
//     try {
//       const response = await axios.get(`${url}/api/album/list`);
//       setAlbumsData(response.data.albums);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     setTimeout(() => {
//       if (audioRef.current) {
//         audioRef.current.ontimeupdate = () => {
//           if (seekBar.current && audioRef.current) {
//             seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100) || 0) + '%';
//             setTime({
//               currentTime: {
//                 second: Math.floor(audioRef.current.currentTime % 60) || 0,
//                 minute: Math.floor(audioRef.current.currentTime / 60) || 0
//               },
//               totalTime: {
//                 second: Math.floor(audioRef.current.duration % 60) || 0,
//                 minute: Math.floor(audioRef.current.duration / 60) || 0
//               }
//             });
//           }
//         }
//       }
//     }, 1000);
//   }, [audioRef]);

//   useEffect(() => {
//     getSongsData();
//     getAlbumsData();
//   }, []);

//   const contextValue = {
//     audioRef,
//     seekBg,
//     seekBar,
//     track,
//     setTrack,
//     playStatus,
//     setPlayStatus,
//     time,
//     play,
//     pause,
//     playWithId,
//     previous,
//     next,
//     seekSong,
//     albumsData,
//     songsData
//   }

//   return (
//     <PlayerContext.Provider value={contextValue}>
//       {props.children}
//     </PlayerContext.Provider>
//   )
// }