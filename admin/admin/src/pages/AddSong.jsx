import { assets } from "../assets/assets";
import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { url } from "../App";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const AddSong = () => {
  const { admin } = useContext(AuthContext);
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [downloadable, setDownloadable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [duration, setDuration] = useState("");

  // Calculate song duration when a file is selected
  useEffect(() => {
    if (song) {
      const audio = new Audio(URL.createObjectURL(song));
      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setDuration(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
      });
    }
  }, [song]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);
      formData.append("artist", artist);
      formData.append("genre", genre);
      formData.append("releaseYear", releaseYear);
      formData.append("downloadable", downloadable);
      formData.append("duration", duration);

      const response = await axios.post(`${url}/api/song/add`, formData, {
        headers: {
          Authorization: `Bearer ${admin.token}`
        }
      });

      if (response.data.success) {
        toast.success("Song added successfully");
        setName("");
        setDesc("");
        setAlbum("none");
        setArtist("");
        setGenre("");
        setReleaseYear("");
        setDownloadable(true);
        setImage(false);
        setSong(false);
        setDuration("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error(error.response?.data?.message || "Error occurred");
    }
    setLoading(false);
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`, {
        headers: {
          Authorization: `Bearer ${admin.token}`
        }
      });

      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error("Unable to load albums data");
      }
    } catch (err) {
      console.error("Error loading albums:", err);
      toast.error("Error occurred");
    }
  };

  useEffect(() => {
    if (admin && admin.token) {
      loadAlbumData();
    }
  }, [admin]);
  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
      <h2 className="text-2xl font-bold mb-4">Add New Song</h2>

      <div className="flex flex-col gap-8 w-full max-w-3xl">
        {/* Upload Song Section */}
        <div className="flex flex-row gap-8">
          <div>
            <p className="mb-2">Upload Song</p>
            <input onChange={(e)=>setSong(e.target.files[0])} type="file" id="song" accept="audio/*" hidden />
            <label htmlFor="song">
              <img
                src={song? assets.upload_added:assets.upload_song}
                className="w-24 cursor-pointer"
                alt="Upload song"
              />
            </label>
            {song && <p className="mt-2 text-sm text-green-600">Duration: {duration || 'Calculating...'}</p>}
          </div>
          <div>
            <p className="mb-2">Upload Cover Image</p>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
            <label htmlFor="image">
              <img
                src={image? URL.createObjectURL(image):assets.upload_area}
                className="w-24 cursor-pointer"
                alt="Upload image"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Song Name Input */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Song Name</label>
            <input
              onChange={(e)=>setName(e.target.value)}
              value={name}
              className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
              placeholder="Enter song name"
              type="text"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Artist</label>
            <input
              onChange={(e)=>setArtist(e.target.value)}
              value={artist}
              className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
              placeholder="Enter artist name"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Album</label>
            <select
              onChange={(e)=>setAlbum(e.target.value)}
              value={album}
              className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full'
            >
              <option value='none'>None</option>
              {albumData.map((item, index) => (
                <option value={item.name} key={index}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Genre</label>
            <select
              onChange={(e)=>setGenre(e.target.value)}
              value={genre}
              className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
            >
              <option value="">Select Genre</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="R&B">R&B</option>
              <option value="Country">Country</option>
              <option value="Electronic">Electronic</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Folk">Folk</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Release Year</label>
            <input
              onChange={(e)=>setReleaseYear(e.target.value)}
              value={releaseYear}
              className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
              placeholder="Enter release year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="downloadable"
              checked={downloadable}
              onChange={(e) => setDownloadable(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="downloadable" className="font-medium">Allow Downloads</label>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium">Song Description</label>
          <textarea
            onChange={(e)=>setDesc(e.target.value)}
            value={desc}
            className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
            placeholder="Enter song description"
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type='submit'
          className='text-base bg-black text-white py-3 px-8 cursor-pointer hover:bg-gray-800 transition'
          disabled={loading || !song || !image}
        >
          {loading ? 'Adding...' : 'Add Song'}
        </button>
      </div>
    </form>
  );
};

export default AddSong;
