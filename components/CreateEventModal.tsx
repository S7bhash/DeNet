import React, { useState, useEffect } from 'react';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, dateTime: string, location: string) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setTitle('');
                setDateTime('');
                setLocation('');
            }, 300);
        } else {
            // Set default date to today at the next hour
            const now = new Date();
            now.setHours(now.getHours() + 1);
            now.setMinutes(0);
            const defaultDateTime = now.toISOString().slice(0, 16);
            setDateTime(defaultDateTime);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && dateTime && location.trim()) {
            onCreate(title, new Date(dateTime).toISOString(), location);
        }
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
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Create Event</h2>
                
                <form onSubmit={handleSubmit} className="p-2 space-y-4">
                    <div>
                        <label htmlFor="event-title" className="block text-sm font-semibold text-zinc-400 mb-2">Event Title</label>
                        <input
                            type="text"
                            id="event-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Q3 Planning Session"
                            className="w-full bg-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 border border-zinc-700"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="event-datetime" className="block text-sm font-semibold text-zinc-400 mb-2">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="event-datetime"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full bg-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 border border-zinc-700"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="event-location" className="block text-sm font-semibold text-zinc-400 mb-2">Location</label>
                        <input
                            type="text"
                            id="event-location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Conference Room 4"
                            className="w-full bg-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 border border-zinc-700"
                            required
                        />
                    </div>
                    

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-300 hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:bg-zinc-600"
                            disabled={!title.trim() || !dateTime || !location.trim()}
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;