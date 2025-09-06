import React, { useEffect } from 'react';
import { Message, MessageType } from '../types';

interface MediaPreviewModalProps {
    media: Message;
    onClose: () => void;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ media, onClose }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
            onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-up"
            style={{ animationDuration: '0.2s' }}
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-[90vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 bg-zinc-800 text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors"
                    aria-label="Close media preview"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {media.type === MessageType.IMAGE && (
                    <img src={media.content} alt={media.fileName} className="w-full h-full object-contain rounded-lg shadow-2xl" />
                )}
                {media.type === MessageType.VIDEO && (
                     <video src={media.content} controls autoPlay className="w-full h-full object-contain rounded-lg shadow-2xl" />
                )}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-t from-black/90 to-transparent text-white rounded-b-lg">
                    <h3 className="font-bold text-lg">{media.fileName}</h3>
                    <p className="text-sm text-zinc-300">{media.fileSize}</p>
                </div>
            </div>
        </div>
    );
};

export default MediaPreviewModal;