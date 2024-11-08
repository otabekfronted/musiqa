import React from "react";

const Footer = ({ currentTrack }) => {
    if (!currentTrack) {
        return null;
    }

    return (
        <div className="footer bg-[#121212] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img
                    className="w-14 h-14"
                    src={currentTrack.track.album.images[0]?.url}
                    alt={currentTrack.track.name}
                />
                <div>
                    <p className="text-lg font-semibold">
                        {currentTrack.track.name}
                    </p>
                    <p className="text-sm text-gray-400">
                        {currentTrack.track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                    </p>
                </div>
            </div>
            <div>
                <audio
                    src={currentTrack.track.preview_url}
                    controls
                    autoPlay
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default Footer;
