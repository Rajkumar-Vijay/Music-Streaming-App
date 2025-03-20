import { assets } from "../assets/frontend-assets/assets";
import Navbar from "./Navbar"
import { useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react";
import {PlayerContext} from './context/PlayerContext'

export const Displayalbum = ({ album })=>{
  const {id} = useParams();
  const [albumData, setAlbumData] = useState(null);
  const { playTrack, albumsData, songsData } = useContext(PlayerContext);

  useEffect(() => {
    if (album) {
      setAlbumData(album);
    } else if (albumsData && albumsData.length > 0) {
      // Find the album by id if not passed as prop
      const foundAlbum = albumsData.find(a => a.id === id || a._id === id);
      if (foundAlbum) {
        setAlbumData(foundAlbum);
      }
    }
  }, [album, albumsData, id]);

  if (!albumData) {
    return <div className="text-white">Loading album...</div>;
  }

  return (
    <>
      <div>
        <Navbar/>
        <div className='mt-10 flex flex-col gap-8 text-white lg:flex-row'>
          <img className='w-[10rem] rounded' src={albumData.image || ''} alt={albumData.name || ''} />
          <div>
            <p>Playlist</p>
            <h1 className='text-5xl font-bold mb-4 md:text-6xl'>{albumData.name || ''}</h1>
            <h1 className=''>{albumData.desc || ''}</h1>
            <p className='mt-1'>
              <img className='inline-block w-5' src={albumData.spotify_logo || ''} alt="" />
              <b>Spotify</b>
              . 12345 likes .12345 followers.
              . <b>50 songs,</b>
              about 2 hrs 30 min
            </p>
          </div>
        </div>
        <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 text-[#a7a7a7]'>
          <p><b className='mr-4'>#</b>Title</p>
          <p>Album</p>
          <p className='hidden sm:block'>Date added</p>
          <img className='m-auto w-4' src={assets?.clock_icon || ''} alt="" />
        </div>
        <hr/>
        {
          songsData && songsData.map((item, index)=>(
            <div onClick={()=>{playTrack(item)}} key={index} className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'>
              <p className='text-white'>
                <b className='mr-4 text-[#a7a7a7]'>{index+1}</b>
                <img className='inline w-10 mr-5' src={item.image || ''} alt={item.name || ''} />
                {/* {item.name} */}
              </p>
              <p className='text-[15px]'>{item.name || ''}</p>
              <p className='text-[15px] hidden sm:block'>5 days ago</p>
              <p className='text-[15px] text-center'>{item.duration || ''}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}