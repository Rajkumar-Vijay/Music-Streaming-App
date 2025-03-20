import {assets} from '../assets/assets.js'
import {useState} from 'react'  
import axios from 'axios';
import { url } from '../App';
import { toast } from "react-toastify";
const AddAlbum = ()=>{
  const [image, setImage]= useState(false)
  const [colour, setColor]=useState('#121212')
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading,setLoading]=useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      // First, test if the server is reachable
      try {
        const testResponse = await axios.get(`${url}/api/test-album`);
        console.log("Server test response:", testResponse.data);
      } catch (testError) {
        console.error("Server test failed:", testError);
      }

      console.log("Submitting album with URL:", `${url}/api/album/add`);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', description);
      formData.append('image', image);
      formData.append('bgColor', colour);

      // Log form data entries
      for (let [key, value] of formData.entries()) {
        console.log(`Form data entry - ${key}:`, typeof value === 'object' ? 'File object' : value);
      }

      // First try the direct test route
      try {
        console.log("Trying direct test route...");
        const testResponse = await axios.post(`${url}/api/direct-test-album-add`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("Direct test route response:", testResponse.data);
      } catch (directTestError) {
        console.error("Direct test route failed:", directTestError);
      }

      // Now try the actual album add route
      console.log("Now trying the actual album add route...");
      const response = await axios.post(`${url}/api/album/add`, formData, {
        headers: {
          // Let the browser set the content type with boundary
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout and retry logic
        timeout: 10000,
        maxRedirects: 5
      });

      console.log("Response:", response.data);

      if (response.data.success){
        toast.success("Album added");
        setDescription('');
        setImage(false);
        setName('');
      } else {
        toast.error("Something went wrong");
      }
    } catch(error) {
      console.error("Error adding album:", error);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        toast.error(`Server error: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error("No response from server. Check if server is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        toast.error(`Request setup error: ${error.message}`);
      }
    }
    setLoading(false);
  }
    return loading ? (<div className='grid place-items-center min-h-[80vh]'><div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full anilmate-spin"></div></div>) :(
      <form onSubmit={onSubmitHandler}className="flex flex-col gap-8 item-start text-gray-600">
        <div className='flex flex-col gap-4'>
          <p>Uplaod image</p>
          <input onChange={(e)=>setImage(e.target.files[0])} type='file' id='image' accept='image/*' hidden/>
          <label htmlFor='image'>
            <img className = 'w-24 cursor-pointer'src={image ? URL.createObjectURL(image) : assets.upload_area} alt=''></img>
          </label>
        </div>
        <div className='flex flex-col gap-2.5'>
          <p>Album name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw, 250px)]'></input>
        </div>
        <div className='flex flex-col gap-2.5'>
          <p>Album description</p>
          <input onChange={(e)=>setDescription(e.target.value)} value={description} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw, 250px)]'></input>
        </div>
        <div className='flex flex-col gap-3'>
          <p>Background color</p>
          <input onChange={(e)=>setColor(e.target.value)} value={colour} type='color'/>
        </div>
        <button className='w-24 item-center justify-center text-base bg-black text-white py-2.5 px-4 cursor-pointer 'type='submit'>Add</button>
      </form> 
  )
}
export default AddAlbum