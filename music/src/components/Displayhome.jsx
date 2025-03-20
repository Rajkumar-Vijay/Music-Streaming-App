import Navbar from "./Navbar"
// import { albumsData,songsData } from "../assets/frontend-assets/assets";
import AlbumItem from './Albumitem'
import SongItem from "./Songitem";
import { useContext } from "react";
import { PlayerContext } from "./context/PlayerContext";
const Displayhome = ()=>{
  const {songsData, albumsData}=useContext(PlayerContext)
  return (
  <>
    <Navbar/>
    <div className='mb-4'>
      <h1 className ='my-5 font-bold text-white text-3xl'>Featured Charts</h1>
      <div className='flex overflow-auto'>
        {albumsData.map((item, index)=>(<AlbumItem key ={index} name={item.name} desc={item.desc} id={item._id} image={item.image}/>))}
      </div>
    </div>
    <div className='mb-4'>
      <h1 className ='my-5 font-bold text-white text-3xl'>Today biggest hits</h1>
      <div className='flex overflow-auto'>
        {songsData.map((item, index)=>(<SongItem key ={index} name={item.name} desc={item.desc} id={item._id} image={item.image}/>))}
      </div>
    </div>
  </>
  )
}
export default Displayhome;
