import React, { useState, useRef } from 'react';
import { MessageType } from '../types';

interface MessageInputProps {
  onSendMessage: (type: MessageType, content: string, fileInfo?: { fileName: string, fileSize: string }, payload?: any) => void;
  disabled: boolean;
  onOpenPollModal: () => void;
  onOpenEventModal: () => void;
}

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

const attachmentOptions = [
  { type: MessageType.IMAGE, label: "Image", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-teal-600' },
  { type: MessageType.VIDEO, label: "Video", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>, color: 'bg-indigo-600' },
  { type: MessageType.FILE, label: "Document", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: 'bg-emerald-600' },
  { type: 'CAMERA' as MessageType, label: "Camera", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-amber-600' },
  { type: MessageType.POLL, label: "Poll", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-cyan-600' },
  { type: MessageType.EVENT, label: "Event", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'bg-rose-600' },
  { type: MessageType.LOCATION, label: "Location", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-orange-600' },
];

const AttachmentOptions: React.FC<{ onSelect: (type: MessageType) => void, disabled: boolean, isOpen: boolean }> = ({ onSelect, disabled, isOpen }) => (
  <div className="absolute bottom-full left-0 mb-3 h-20 w-full" aria-hidden={!isOpen}>
    {attachmentOptions.map((opt, index) => (
      <button 
        key={opt.label}
        type="button" 
        onClick={() => onSelect(opt.type)}
        className={`absolute bottom-0 w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:bg-zinc-600 ${opt.color}`}
        style={{
          transform: isOpen ? `translate(${(index * 3.5)}rem, -0.5rem)` : 'translate(0rem, 0rem) scale(0.5)',
          opacity: isOpen ? 1 : 0,
          transitionDelay: isOpen ? `${index * 40}ms` : '0ms'
        }}
        disabled={disabled}
        tabIndex={isOpen ? 0 : -1}
        aria-label={opt.label}
      >
        {opt.icon}
      </button>
    ))}
  </div>
);

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled, onOpenPollModal, onOpenEventModal }) => {
  const [inputValue, setInputValue] = useState('');
  const [areOptionsOpen, setAreOptionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileTrigger = (type: 'IMAGE' | 'VIDEO' | 'FILE' | 'CAMERA') => {
    if (fileInputRef.current) {
        if (type === 'IMAGE') {
            fileInputRef.current.accept = 'image/*';
            fileInputRef.current.removeAttribute('capture');
        } else if (type === 'VIDEO') {
            fileInputRef.current.accept = 'video/*';
            fileInputRef.current.removeAttribute('capture');
        } else if (type === 'CAMERA') {
            fileInputRef.current.accept = 'image/*';
            fileInputRef.current.setAttribute('capture', 'environment');
        } else { // FILE
            fileInputRef.current.accept = '*/*';
            fileInputRef.current.removeAttribute('capture');
        }
        fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const sizeInMB = file.size / (1024 * 1024);
    const fileSize = sizeInMB < 0.1 
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${sizeInMB.toFixed(1)} MB`;
    const fileInfo = { fileName: file.name, fileSize };

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Content = e.target?.result as string;
            onSendMessage(MessageType.IMAGE, base64Content, fileInfo);
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        const content = `https://picsum.photos/seed/vid${Date.now()}/400/225`;
        onSendMessage(MessageType.VIDEO, content, fileInfo);
    } else {
        onSendMessage(MessageType.FILE, '', fileInfo);
    }

    if (event.target) {
        event.target.value = '';
    }
  };


  const handleOptionSelect = (type: MessageType) => {
    setAreOptionsOpen(false);
    
    switch(type) {
        case MessageType.IMAGE:
        case MessageType.VIDEO:
        case MessageType.FILE:
        case 'CAMERA' as MessageType:
            handleFileTrigger(type as any);
            break;
        case MessageType.POLL:
            onOpenPollModal();
            break;
        case MessageType.EVENT:
            onOpenEventModal();
            break;
        case MessageType.LOCATION:
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationData = { latitude, longitude, label: "Current Location" };
                    onSendMessage(MessageType.LOCATION, 'Shared a location', undefined, { location: locationData });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert(`Could not get location: ${error.message}`);
                }
            );
            break;
        default: return;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(MessageType.TEXT, inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="relative">
        <AttachmentOptions onSelect={handleOptionSelect} disabled={disabled} isOpen={areOptionsOpen} />
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <button 
            type="button" 
            onClick={() => setAreOptionsOpen(!areOptionsOpen)}
            className={`p-2 text-zinc-400 hover:text-lime-400 transition-all duration-300 disabled:opacity-50 ${areOptionsOpen ? 'rotate-45 bg-zinc-700 rounded-full' : ''}`}
            disabled={disabled}
            aria-expanded={areOptionsOpen}
            aria-label="Attach file"
        >
            <AttachmentIcon />
        </button>
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 rounded-full py-2 px-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-500 border border-transparent focus:border-lime-500 transition-all disabled:opacity-50"
            disabled={disabled}
        />
        <button
            type="submit"
            className="p-3 bg-lime-500 text-black rounded-full hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:bg-zinc-600"
            disabled={disabled || !inputValue.trim()}
            aria-label="Send message"
        >
            <SendIcon />
        </button>
        </form>
        <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            aria-hidden="true"
        />
    </div>
  );
};

export default MessageInput;