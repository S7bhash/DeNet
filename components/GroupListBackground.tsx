import React from 'react';

// The new background image URL provided by the user.
const backgroundImageUrl = 'https://unsplash.com/photos/Nfw3-kdOt7o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mzl8fGdyYWZmaXRpfGVufDB8fHx8MTc1NzE3NjEyOHww&force=true&w=2400';

const GroupListBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                aria-hidden="true"
            />
            <div className="absolute inset-0 w-full h-full bg-black/50" aria-hidden="true" />
        </div>
    );
};

export default GroupListBackground;