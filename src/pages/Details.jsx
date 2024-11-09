import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../axios";
import { GrPrevious, GrNext } from "react-icons/gr";
import {
    FaRegHeart,
    FaHeart,
    FaRegArrowAltCircleDown,
    FaEllipsisH,
    FaSearch,
} from "react-icons/fa";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
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
    const [audio, setAudio] = useState(null);
    const [likedTracks, setLikedTracks] = useState([]);

    const handleLike = (track) => {
        const trackId = track.track.id;
        const updatedLikes = likedTracks.includes(trackId)
            ? likedTracks.filter((id) => id !== trackId)
            : [...likedTracks, trackId];

        setLikedTracks(updatedLikes);
        localStorage.setItem("likedTracks", JSON.stringify(updatedLikes));
    };

    const playTrack = (track) => {
        if (audio) {
            audio.pause();
        }
        const newAudio = new Audio(track.track.preview_url);
        setAudio(newAudio);
        setCurrentTrack(track);
        newAudio.play();
        setIsPlaying(true);
        newAudio.onended = () => handleNext();
    };

    const pauseTrack = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const handlePrevious = () => {
        const currentIndex = tracks.findIndex(
            (track) => track.track.id === currentTrack?.track.id
        );
        const prevTrack = tracks[currentIndex - 1];
        if (prevTrack) {
            playTrack(prevTrack);
        }
    };

    const handleNext = () => {
        const currentIndex = tracks.findIndex(
            (track) => track.track.id === currentTrack?.track.id
        );
        const nextTrack = tracks[currentIndex + 1];
        if (nextTrack) {
            playTrack(nextTrack);
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

    useEffect(() => {
        const savedLikes =
            JSON.parse(localStorage.getItem("likedTracks")) || [];
        setLikedTracks(savedLikes);
    }, []);

    const formatDuration = (durationMs) => {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

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
                    className="w-10 h-10 text-white bg-[#000] rounded-full"
                />
                {isPlaying ? (
                    <FaPauseCircle
                        onClick={pauseTrack}
                        className="w-10 h-10 text-white bg-[#000] rounded-full"
                    />
                ) : (
                    <FaPlayCircle
                        onClick={() => playTrack(currentTrack || tracks[0])}
                        className="w-10 h-10 text-white bg-[#000] rounded-full"
                    />
                )}
                <GrNext
                    onClick={handleNext}
                    className="w-10 h-10 text-white bg-[#000] rounded-full"
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
                        {playlistData.tracks.total} songs
                    </p>
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
                            onClick={() => playTrack(track)}
                        >
                            <span className="flex items-center gap-2 text-white">
                                {index + 1}
                                <img
                                    className="w-10 h-10 mr-4"
                                    src={track.track.album.images[0]?.url}
                                    alt={track.track.album.name}
                                />
                                {track.track.name}
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
                                {formatDuration(track.track.duration_ms)}
                            </span>
                            <span
                                onClick={() => handleLike(track)}
                                className="cursor-pointer"
                            >
                                {likedTracks.includes(track.track.id) ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart className="text-white" />
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Details;
