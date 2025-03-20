import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { PlayerContext } from './context/PlayerContext';
import { FaHome, FaSearch, FaMusic, FaHeart, FaList, FaDownload, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { playlists } = useContext(PlayerContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-500">Music App</h1>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <Link
                to="/home"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/home') || isActive('/')
                    ? 'bg-purple-600'
                    : 'hover:bg-gray-800'
                }`}
              >
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/search') ? 'bg-purple-600' : 'hover:bg-gray-800'
                }`}
              >
                <FaSearch />
                <span>Search</span>
              </Link>
            </li>
            <li>
              <Link
                to="/playlists"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/playlists') ? 'bg-purple-600' : 'hover:bg-gray-800'
                }`}
              >
                <FaMusic />
                <span>Your Playlists</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Library Section */}
        <div className="px-4 py-2 mt-4">
          <h2 className="text-gray-400 text-sm font-semibold px-4 mb-2">YOUR LIBRARY</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/liked-songs"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-800`}
              >
                <FaHeart className="text-red-500" />
                <span>Liked Songs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/downloads"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-800`}
              >
                <FaDownload />
                <span>Downloads</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Playlists Section */}
        {playlists && playlists.length > 0 && (
          <div className="px-4 py-2 mt-4">
            <h2 className="text-gray-400 text-sm font-semibold px-4 mb-2">YOUR PLAYLISTS</h2>
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {playlists.map((playlist) => (
                <li key={playlist._id}>
                  <Link
                    to={`/playlist/${playlist._id}`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-800 text-sm truncate`}
                  >
                    <FaList />
                    <span className="truncate">{playlist.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="font-medium truncate">{user ? user.name : 'User'}</p>
              <p className="text-gray-400 text-xs truncate">{user ? user.email : 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

// import {assets} from '../assets/frontend-assets/assets.js';
// import { useNavigate } from 'react-router-dom';
// const Sidebar = ()=>{
//   const navigate = useNavigate ();
//   return(
//     <div className='w-[20%] h-full p-2 flex-col hidden gap-2 text-white lg:flex bg-indigo-950' >
//       <div className ='bg-black h-[15%] rounded flex flex-col justify-around'>
//         <div onClick ={()=>navigate('/')}className='flex cursor-pointer items-center gap-3 pl-8 curser-pointer'>
//           <img className='w-6' src={assets.home_icon} alt="app home icon" />
//           <p>Home</p>
//         </div>
//         <div className='flex items-center gap-3 pl-8 curser-pointer'>
//           <img className='w-6' src={assets.search_icon} alt="app home icon" />
//           <p>search</p>
//         </div>
//       </div>
//       <div className='h-[85%] bg-black rounded'>
//         <div className='p-4 flex items-center justify-between'>
//           <div className='pl-4 flex flex-row justify-center items-center gap-3'>
//             <img className=' w-6 flex flex-col'src={assets.stack_icon} alt="library icon" />
//             <p>library</p>
//           </div>
//           <div className='pl-4 flex flex-row justify-center items-center gap-3'>
//             <img className=' w-3 flex flex-col'src={assets.arrow_icon} alt="library icon" />
//             <img className=' w-3 flex flex-col'src={assets.plus_icon} alt="library icon" />
//           </div>
//         </div>
//         <div className='px-4 p-4 m-2 rounded font-semibold bg-neutral-900'>
//           <h1>Create your first playlist</h1>
//           <p className='font-light'>it's easy we will help you</p>
//           <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create play list</button>   
//         </div>
//         <div className='px-4 p-4 m-2 rounded font-semibold bg-neutral-900'>
//           <h1>Les's findsome broadcast</h1>
//           <p className='font-light'>we will kep you update on new episodes</p>
//           <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>broadcast</button>   
//         </div>
//       </div>

//     </div>
//   )
// }
// export default Sidebar;