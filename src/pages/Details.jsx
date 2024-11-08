import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../axios";
import { GrPrevious, GrNext } from "react-icons/gr";
import {
    FaRegHeart,
    FaRegArrowAltCircleDown,
    FaEllipsisH,
    FaSearch,
} from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";
import { CiClock2 } from "react-icons/ci";

const Details = () => {
    const { id } = useParams();
    const [playlistData, setPlaylistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(1); // default volume

    const handlePlayPause = (track) => {
        if (currentTrack?.track.id === track.track.id && isPlaying) {
            setIsPlaying(false);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
    };

    const handlePrevious = () => {
        const currentIndex = tracks.findIndex(
            (track) => track.track.id === currentTrack?.track.id
        );
        const prevTrack = tracks[currentIndex - 1];
        if (prevTrack) {
            setCurrentTrack(prevTrack);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        const currentIndex = tracks.findIndex(
            (track) => track.track.id === currentTrack?.track.id
        );
        const nextTrack = tracks[currentIndex + 1];
        if (nextTrack) {
            setCurrentTrack(nextTrack);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const response = await http.get(
                    `https://api.spotify.com/v1/playlists/${id}`
                );
                setPlaylistData(response.data);
                setTracks(response.data.tracks.items);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch playlist data");
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylistData();
    }, [id]);

    if (loading) {
        return (
            <div className="loader flex items-center justify-center min-h-screen">
                <div className="spotify-loader">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <div className="flex gap-4 p-7 bg-[#c4ff00]">
                <GrPrevious
                    onClick={handlePrevious}
                    className="w-10 h-10 py-2 px-3 text-white bg-[#000] rounded-full"
                />
                <GrNext
                    onClick={handleNext}
                    className="w-10 h-10 py-2 px-3 text-white bg-[#000] rounded-full"
                />
            </div>

            <div className="flex items-center p-7 bg-gradient-to-b from-[#c4ff00] to-[#111] text-white">
                <img
                    className="w-[297px] h-[297px] shadow-lg"
                    src={playlistData.images[0]?.url}
                    alt={playlistData.name}
                />
                <div className="ml-6">
                    <p className="text-sm uppercase text-[22px] text-gray-300">
                        {playlistData.type}
                    </p>
                    <h2 className="text-6xl font-bold mt-2">
                        {playlistData.name}
                    </h2>
                    <p className="text-gray-400 mt-4">
                        {playlistData.description}
                    </p>
                    <p className="text-gray-400">
                        {playlistData.owner.display_name} •{" "}
                        {playlistData.tracks.total} songs,{" "}
                        {Math.floor(playlistData.tracks.total * 3.5)} mins
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between px-7 bg-[#121212]">
                <div className="flex items-center gap-9">
                    <FaPlayCircle
                        onClick={() => handlePlayPause(tracks[0])}
                        className="w-20 h-20 bg-[#65D36E] text-white rounded-full"
                    />
                    <FaRegHeart className="text-white w-12 h-12" />
                    <FaRegArrowAltCircleDown className="text-white w-12 h-12" />
                    <FaEllipsisH className="text-white w-6 h-6" />
                </div>
                <div className="flex items-center text-white font-semibold gap-11">
                    <FaSearch className="w-6 h-6" />
                    <div className="flex items-center text-white text-sm font-semibold">
                        <span className="text-[18px]">Custom order</span>
                        <AiOutlineDown className="ml-1" />
                    </div>
                </div>
            </div>

            <div className="bg-[#121212]">
                <div className="text-white p-7 border-b border-gray-500 text-[16px] flex items-center justify-between">
                    <span># TITLE</span>
                    <span>ALBUM</span>
                    <span>DATE ADDED</span>
                    <span>
                        <CiClock2 />
                    </span>
                </div>
                <div className="p-7">
                    {tracks.map((track, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 border-b border-gray-500 cursor-pointer"
                        >
                            <span
                                onClick={() => handlePlayPause(track)}
                                className="text-white flex items-center gap-2"
                            >
                                {index + 1}
                                <img
                                    className="w-10 h-10 mr-4"
                                    src={track.track.album.images[0]?.url}
                                    alt={track.track.album.name}
                                />
                                {track.track.name} <br />
                                {track.track.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </span>
                            <span className="text-white">
                                {track.track.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </span>
                            <span className="text-gray-400">
                                {track.track.album.name}
                            </span>
                            <span className="text-gray-400">
                                {Math.floor(track.track.duration_ms / 60000)}:
                                {Math.floor(
                                    (track.track.duration_ms % 60000) / 1000
                                )
                                    .toString()
                                    .padStart(2, "0")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {isPlaying && (
                <div className="footer bg-[#121212] text-white p-6 fixed bottom-0 w-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FaPlayCircle
                            onClick={() => setIsPlaying(false)}
                            className="w-10 h-10 text-white"
                        />
                        <span className="text-white">
                            {currentTrack.track.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handlePrevious} className="text-white">
                            Previous
                        </button>
                        <button onClick={handleNext} className="text-white">
                            Next
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-32"
                        />
                        <audio
                            src={currentTrack.track.preview_url}
                            autoPlay
                            volume={volume}
                            onEnded={() => setIsPlaying(false)}
                        />
                    </div>
                </div>
            )}
            {/* <Footer currentTrack={currentTrack} /> */}
        </div>
    );
};

export default Details;
