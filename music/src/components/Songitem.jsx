import { useContext } from "react";
import { PlayerContext } from "./context/PlayerContext";

const Songitem = ({image, name, desc, id})=>{
  const { playTrack, songsData } = useContext(PlayerContext);

  const handlePlay = () => {
    // Find the song by id in songsData
    const song = songsData.find(song => song._id === id);
    if (song) {
      playTrack(song);
    }
  };

  return (
    <>
      <div onClick={handlePlay} className='min-w-[180px] p-2 px-3 rouneded cursor-pointer hover:bg-[#ffffff26]'>
        <img className='rounded ' src={image} alt="" />
        <p className='fond-bold mt-2 mb-1'>{name}</p>
        <p className='text-slate-200 text-sm'>{desc}</p>
      </div>
    </>
  )
}
export default Songitem;