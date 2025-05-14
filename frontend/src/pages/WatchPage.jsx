import {useState } from "react";
import { useParams } from "react-router-dom";
import {useContentStore} from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from 'react-player'
import ORIGINAL_IMG_BASE_URL from '../utils/constants.js'



function formatReleaseData(data)
{
    return new Date(data).toLocaleDateString("en-US",{
        year:"numeric",
        month:"long",
        day:"numeric"
    })
}

export const WatchPage = () => {
    const {id} = useParams();
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerIdx,setCurrentTrailerIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content,setContent] = useState({});
    const [similarcontent,setsimilarcontent] = useState({});
    const {contentType} = useContentStore();

    useEffect(() => {
        const getTrailers = async () => {
           try {
             const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
             setTrailers(res.data.trailers);
           } catch (error) {
            if(error.message.includes("404")){
                setTrailers([]);
            }
           }
        }
        getTrailers();
    },[contentType,id]);

    useEffect(() => {
        const getSimilarContent = async () => {
           try {
             const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
             setsimilarcontent(res.data.similar);
           } catch (error) {
            if(error.message.includes("404")){
                setsimilarcontent([]);
            }
           }
        }
        getSimilarContent();
    },[contentType,id]);

    useEffect(() => {
        const getContentDetails = async () => {
           try {
             const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
             setContent(res.data.content);
           } catch (error) {
            if(error.message.includes("404")){
                setContent(null);
            }
           }
           finally{
            setLoading(false);
           }
        }
        getContentDetails();
    },[contentType,id]);

    const handlenext = () => {
        if(currentTrailerIdx < trailers.length-1) setCurrentTrailerIdx(currentTrailerIdx+1)
    }

    const handleprev = () => {
        if(currentTrailerIdx > 0 ) setCurrentTrailerIdx(currentTrailerIdx-1)
    }
  return (
    <div className="bg-black min-h-screen text-white ">
        <div className="mx-auto container px-4 py-8 h-full">
            <Navbar/>
            {
                trailers.length > 0 && (
                    <div className="flex justify-between items-center mb-4">
                        <button className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === 0 ? 'opacity-50 cursor-not-allowed ' : ''}`} disabled={currentTrailerIdx === 0}  onClick={handleprev} >   
                            <ChevronLeft size={24}/>
                        </button>
                        <button className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${currentTrailerIdx === trailers.length-1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentTrailerIdx === trailers.length-1} onClick={handlenext}>   
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )
                
            }
            <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
                {
                    trailers.length > 0 && (
                        <ReactPlayer
                        controls={true}
                        width={"100%"}
                        height={'70vh'}
                        className="mx-auto overflow-hidden rounded-lg"
                        url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
                        />
                    )
                }
            </div>
            {
                trailers?.length === 0 && (
                    <h2 className="text-xl text-center mt-5">
                        No trailers available for{" "}
                        <span className="font-bold text-red-600">{content?.title || content?.name}</span>
                    </h2>
                )
            }
            <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-5xl font-bold text-balance">{content?.title || content?.name}</h2>
                    <p className="mt-2 text-lg">
                        {formatReleaseData(content?.release_data || content?.first_air_data)}|{" "}
                        {
                            content?.adult ?(
                                <span className="text-red-600">18+</span>
                            ):(
                                <span className="text-green-600">PG-13</span>
                            )
                        }{" "}
                    </p>
                    <p className="mt-4 text-lg">{content?.overview}</p>
                </div>
                <img src={ORIGINAL_IMG_BASE_URL+content.poster_path} alt="poster img" className="max-h[600px] rounded-md"/>
            </div>
        </div>

    </div>
  )}

