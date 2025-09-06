import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, avatarUrl: string) => void;
    currentUser: User;
}

const LanguageRec: React.FC = () => (
    <div className="mt-6 p-4 bg-black/30 rounded-lg text-xs text-zinc-400 border border-zinc-700/50">
        <h4 className="font-bold text-zinc-300 mb-2 uppercase tracking-widest">P2P Backend Tech</h4>
        <p>For a real-world decentralized application, high-performance languages are ideal for the peer-to-peer layer.</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
            <li><span className="font-semibold text-lime-400">Go:</span> Excellent for concurrency with Goroutines.</li>
            <li><span className="font-semibold text-lime-400">Rust:</span> Provides memory safety and fearless concurrency.</li>
        </ul>
    </div>
);


const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
    const [name, setName] = useState(currentUser.name);
    const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

    useEffect(() => {
        if (isOpen) {
            setName(currentUser.name);
            setAvatarUrl(currentUser.avatarUrl);
        }
    }, [isOpen, currentUser]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
            onClose();
           }
        };
        if(isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name, avatarUrl);
    };

    const handleAvatarChange = () => {
        // Simulate uploading a new avatar by getting a new random one
        const newSeed = `avatar-${Date.now()}`;
        setAvatarUrl(`https://picsum.photos/seed/${newSeed}/100/100`);
    };

    return (
        <div 
            className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/80' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 rounded-t-2xl shadow-2xl p-4 text-zinc-200 transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Profile Settings</h2>
                
                <form onSubmit={handleSave} className="p-2">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="relative">
                            <img src={avatarUrl} alt="Current avatar" className="w-20 h-20 rounded-full border-2 border-zinc-600" />
                            <button 
                                type="button" 
                                onClick={handleAvatarChange}
                                className="absolute -bottom-1 -right-1 bg-lime-500 text-black h-7 w-7 rounded-full flex items-center justify-center hover:bg-lime-400 transition-colors"
                                aria-label="Change profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                         <p className="text-sm text-zinc-400">Click the icon to change your avatar.</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="profile-name" className="block text-sm font-semibold text-zinc-400 mb-2">Display Name</label>
                        <input
                            type="text"
                            id="profile-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 rounded-md py-2 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500 border border-zinc-700"
                            required
                        />
                    </div>
                     <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-zinc-300 hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-lime-500 text-black font-bold rounded-md hover:bg-lime-400 transition-colors disabled:opacity-50"
                            disabled={!name.trim()}
                        >
                            Save Changes
                        </button>
                    </div>

                    <LanguageRec />
                </form>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;