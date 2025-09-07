
import React, { useState, useEffect } from 'react';
import { MOCK_CONTACTS } from '../constants';
import { Contact } from '../types';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (groupName: string, selectedContacts: Contact[]) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setGroupName('');
                setSelectedContacts([]);
            }, 300); // Reset after transition
        }
    }, [isOpen]);
    
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

    const handleContactToggle = (contact: Contact) => {
        setSelectedContacts(prev => 
            prev.some(c => c.id === contact.id)
                ? prev.filter(c => c.id !== contact.id) 
                : [...prev, contact]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName.trim() && selectedContacts.length > 0) {
            onCreate(groupName, selectedContacts);
        }
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-end md:items-center md:justify-center transition-all duration-300 ${isOpen ? 'bg-black/80' : 'bg-transparent pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                className={`w-full bg-zinc-900 border-t border-zinc-800 rounded-t-2xl shadow-2xl px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0rem)+1rem)] text-zinc-200 transform transition-all duration-300 ease-out md:max-w-lg md:rounded-2xl md:border md:p-6 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-0 md:scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Create New Network</h2>
                
                <form onSubmit={handleSubmit} className="p-2">
                    <div className="mb-4">
                        <label htmlFor="group-name" className="block text-sm font-semibold text-zinc-400 mb-2">Network Name</label>
                        <input
                            type="text"
                            id="group-name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g., Project Cerberus"
                            className="w-full bg-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500 border border-zinc-700"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-zinc-400 mb-2">Invite from Contacts</label>
                        <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                            {MOCK_CONTACTS.map(contact => (
                                <label key={contact.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-700/50 cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <img src={contact.avatarUrl} alt={contact.name} className="w-8 h-8 rounded-full" />
                                        <div className="flex flex-col">
                                            <span>{contact.name}</span>
                                            {!contact.isUser && <span className="text-xs text-zinc-500">Not on network - SMS invite</span>}
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedContacts.some(c => c.id === contact.id)}
                                        onChange={() => handleContactToggle(contact)}
                                        className="form-checkbox h-5 w-5 bg-zinc-700 border-zinc-600 rounded text-lime-500 focus:ring-lime-500/50"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-300 hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:bg-zinc-600"
                            disabled={!groupName.trim() || selectedContacts.length === 0}
                        >
                            Create & Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
