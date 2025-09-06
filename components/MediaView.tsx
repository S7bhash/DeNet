import React from 'react';
import { Message, MessageType } from '../types';

interface MediaViewProps {
    messages: Message[];
    onMediaSelect: (message: Message) => void;
}

const MediaGridItem: React.FC<{ message: Message; onSelect: () => void }> = ({ message, onSelect }) => {
    const isVideo = message.type === MessageType.VIDEO;

    return (
        <div
            className="relative aspect-square bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
            onClick={onSelect}
        >
            <img src={message.content} alt={message.fileName || 'media'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                {isVideo && (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                 {!isVideo && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5 5" />
                    </svg>
                )}
            </div>
             <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs truncate font-semibold">{message.fileName}</p>
            </div>
        </div>
    );
};

const MediaView: React.FC<MediaViewProps> = ({ messages, onMediaSelect }) => {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold">No Media Yet</h3>
                <p>Images and videos shared in this group will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in-up">
            {messages.map(msg => (
                <MediaGridItem key={msg.id} message={msg} onSelect={() => onMediaSelect(msg)} />
            ))}
        </div>
    );
};

export default MediaView;