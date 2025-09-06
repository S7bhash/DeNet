import React from 'react';

// Using a single, static background image as requested.
const backgroundImageUrl = 'https://unsplash.com/photos/jF946mh5QrA/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzU3MTkzMzY2fA&force=true&w=2400';

const GraffitiBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                aria-hidden="true"
            />
            <div className="absolute inset-0 w-full h-full bg-black/70" aria-hidden="true" />
        </div>
    );
};

export default GraffitiBackground;