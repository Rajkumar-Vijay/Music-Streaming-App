import { useState } from "react"
import { url } from "../App"
import axios from 'axios'
import { toast } from "react-toastify"
import { useEffect } from "react"

const listAlbum = ()=>{
  const [data, setData]=useState([])
  const fetchAlbum = async()=>{
    try{
      console.log("Fetching albums...");
      const response = await axios.get(`${url}/api/album/list`);
      console.log("Album list response:", response.data);

      if(response.data.success){
        setData(response.data.albums || []);
      } else {
        toast.error(response.data.message || "Failed to fetch albums");
      }
    } catch(error) {
      console.error("Error fetching albums:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Error: ${error.response.data.message || "Failed to fetch albums"}`);
      } else {
        toast.error("Something went wrong while fetching albums");
      }
    }
  }
   const removeAlbum = async (id)=>{
      try{
        console.log("Removing album with ID:", id);
        const response = await axios.post(`${url}/api/album/remove/${id}`);
        console.log("Remove album response:", response.data);

        if (response.data.success) {
          toast.success(response.data.message);
          // Call fetchAlbum instead of fetchSongs
          await fetchAlbum();
        } else {
          toast.error(response.data.message || "Failed to delete album");
        }
      } catch(error) {
        console.error("Error removing album:", error);

        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(`Error: ${error.response.data.message || "Failed to delete album"}`);
        } else {
          toast.error("Error occurred while deleting album");
        }
      }
    }
  useEffect(()=>{
    fetchAlbum()
  },[])
  return (
    <div>
      <p>All Album list</p>
      <br/>
      <div>
        <div className = 'sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-3 text-sm mr-5 bg-gray-100'>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album color</b>
          <b>Action</b>
        </div>
        {data.map((item, index)=>{
          return (<div key={index} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] item-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'>
            <img className='w-12'src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type='color' value={item.bgColor}/>
            <p className="cursor-pointer" onClick={()=>removeAlbum(item._id)}>x</p>
          </div>)
        })}
      </div>
    </div>
  )
}
export default listAlbum