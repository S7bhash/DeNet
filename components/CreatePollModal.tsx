
import React, { useState, useEffect } from 'react';

interface CreatePollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (question: string, options: string[]) => void;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setQuestion('');
                setOptions(['', '']);
            }, 300);
        }
    }, [isOpen]);
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };
    
    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validOptions = options.map(o => o.trim()).filter(o => o !== '');
        if (question.trim() && validOptions.length >= 2) {
            onCreate(question, validOptions);
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
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Create Poll</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="poll-question" className="block text-sm font-semibold text-zinc-400 mb-2">Question</label>
                        <input
                            type="text"
                            id="poll-question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., What's for lunch?"
                            className="w-full bg-zinc-800 rounded-xl py-3 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-zinc-400 mb-2">Options</label>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 bg-zinc-800 rounded-xl py-2.5 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-zinc-700"
                                        required
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => removeOption(index)} 
                                      className={`p-2 rounded-full text-zinc-400 hover:bg-zinc-700 transition-colors ${options.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      disabled={options.length <= 2}
                                      aria-label="Remove option"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {options.length < 6 && 
                            <button type="button" onClick={addOption} className="mt-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                                + Add Option
                            </button>
                        }
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-zinc-300 hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:bg-zinc-600"
                            disabled={!question.trim() || options.map(o => o.trim()).filter(o => o !== '').length < 2}
                        >
                            Create Poll
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePollModal;
