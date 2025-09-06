import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
}

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>;

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <button type="button" className="p-2 text-zinc-400 hover:text-lime-400 transition-colors disabled:opacity-50" disabled={disabled}>
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
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default MessageInput;