import React, { useState, memo } from 'react';
import { Message, User, MessageType } from '../types';

interface MessageProps {
  message: Message;
  author?: User;
  currentUser: User;
  onToggleReaction: (emoji: string) => void;
  onDelete: () => void;
  onVoteOnPoll: (optionIndex: number) => void;
  isJustSent?: boolean;
}

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

// #region Content Components (Memoized)
const PollContent = memo<{ message: Message; currentUser: User; onVote: (optionIndex: number) => void }>(({ message, currentUser, onVote }) => {
    if (!message.poll) return null;
    const { question, options } = message.poll;
    const totalVotes = options.reduce((sum, opt) => sum + opt.votes.length, 0);

    const pollColors = [
        { bar: 'bg-cyan-500', border: 'border-cyan-500', bg: 'bg-cyan-500/20' },
        { bar: 'bg-fuchsia-500', border: 'border-fuchsia-500', bg: 'bg-fuchsia-500/20' },
        { bar: 'bg-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400/20' },
        { bar: 'bg-rose-500', border: 'border-rose-500', bg: 'bg-rose-500/20' },
        { bar: 'bg-indigo-500', border: 'border-indigo-500', bg: 'bg-indigo-500/20' },
        { bar: 'bg-teal-500', border: 'border-teal-500', bg: 'bg-teal-500/20' },
    ];

    return (
        <div className="space-y-2 text-zinc-200">
            <p className="font-bold mb-3">{question}</p>
            <div className="space-y-2">
                {options.map((option, index) => {
                    const colorClasses = pollColors[index % pollColors.length];
                    const hasVoted = option.votes.includes(currentUser.id);
                    const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    return (
                        <button key={index} onClick={() => onVote(index)} className="w-full text-left">
                            <div className={`p-2 rounded-2xl border transition-all duration-200 ${hasVoted ? `${colorClasses.border} ${colorClasses.bg}` : 'border-zinc-600 bg-zinc-700/50 hover:bg-zinc-700'}`}>
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span>{option.text}</span>
                                    <span>{option.votes.length}</span>
                                </div>
                                <div className="mt-1 h-1.5 w-full bg-zinc-600 rounded-full">
                                    <div className={`h-1.5 ${colorClasses.bar} rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

const EventContent = memo<{ message: Message }>(({ message }) => {
    if (!message.event) return null;
    const { title, dateTime, location } = message.event;
    return (
        <div className="text-zinc-200">
            <div className="flex items-center space-x-2 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                 <h4 className="font-bold text-lg">{title}</h4>
            </div>
            <p className="text-sm"><span className="font-semibold">When:</span> {new Date(dateTime).toLocaleString()}</p>
            <p className="text-sm"><span className="font-semibold">Where:</span> {location}</p>
        </div>
    );
});

const LocationContent = memo<{ message: Message }>(({ message }) => {
    if (!message.location) return null;
    const { label, latitude, longitude } = message.location;
    // In a real app, use a map library. Here, we use a static image placeholder.
    const mapImageUrl = `https://picsum.photos/seed/map${latitude},${longitude}/400/200`;
    
    return (
        <div>
            <img src={mapImageUrl} alt={`Map of ${label}`} className="rounded-t-2xl" />
            <div className="p-2 bg-zinc-700/50 rounded-b-2xl">
                <p className="font-bold text-white">{label}</p>
                <p className="text-xs text-zinc-400">{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            </div>
        </div>
    );
});

const ImageContent = memo<{ message: Message }>(({ message }) => (
    <img src={message.content} alt={message.fileName || 'Shared image'} className="rounded-2xl max-w-xs cursor-pointer shadow-lg" />
));

const VideoContent = memo<{ message: Message }>(({ message }) => (
    <div className="flex items-center space-x-3">
        <VideoIcon/>
        <div>
            <p className="font-semibold text-white">{message.fileName}</p>
            <p className="text-sm text-zinc-400">{message.fileSize}</p>
        </div>
    </div>
));

const FileContent = memo<{ message: Message }>(({ message }) => (
     <div className="flex items-center space-x-3">
        <FileIcon/>
        <div>
            <p className="font-semibold text-white">{message.fileName}</p>
            <p className="text-sm text-zinc-400">{message.fileSize}</p>
        </div>
    </div>
));

const TextContent = memo<{ message: Message }>(({ message }) => (
    <p className="text-zinc-200 whitespace-pre-wrap">{message.content}</p>
));

const MessageContent: React.FC<{ message: Message; currentUser: User; onVoteOnPoll: (optionIndex: number) => void; }> = ({ message, currentUser, onVoteOnPoll }) => {
    switch (message.type) {
        case MessageType.IMAGE: return <ImageContent message={message} />;
        case MessageType.VIDEO: return <VideoContent message={message} />;
        case MessageType.FILE: return <FileContent message={message} />;
        case MessageType.POLL: return <PollContent message={message} currentUser={currentUser} onVote={onVoteOnPoll} />;
        case MessageType.EVENT: return <EventContent message={message} />;
        case MessageType.LOCATION: return <LocationContent message={message} />;
        default: return <TextContent message={message} />;
    }
};
// #endregion

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const Reactions = memo<{ message: Message; currentUser: User; onToggleReaction: (emoji: string) => void }>(({ message, currentUser, onToggleReaction }) => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1">
            {Object.entries(message.reactions).map(([emoji, userIds]) => {
                if (userIds.length === 0) return null;
                const isCurrentUserReaction = userIds.includes(currentUser.id);
                return (
                    <button
                        key={emoji}
                        onClick={() => onToggleReaction(emoji)}
                        className={`flex items-center px-1.5 py-0.5 rounded-full text-xs transition-colors ${
                            isCurrentUserReaction
                                ? 'bg-lime-500/30 border border-lime-500 text-white'
                                : 'bg-zinc-700/50 hover:bg-zinc-600/50 border border-transparent'
                        }`}
                    >
                        <span>{emoji}</span>
                        <span className="ml-1 font-semibold text-zinc-300">{userIds.length}</span>
                    </button>
                );
            })}
        </div>
    );
});

const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = memo(({ onSelect }) => (
    <div className="absolute bottom-full mb-2 p-1.5 bg-zinc-800 rounded-full shadow-lg border border-zinc-700 flex space-x-1 animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
        {EMOJI_REACTIONS.map(emoji => (
            <button key={emoji} onClick={() => onSelect(emoji)} className="p-1.5 rounded-full text-xl hover:bg-zinc-700 transition-transform hover:scale-110">
                {emoji}
            </button>
        ))}
    </div>
));

const ReadReceipt = memo<{ message: Message; isCurrentUser: boolean }>(({ message, isCurrentUser }) => {
    if (!isCurrentUser) return null;

    const isReadByOthers = message.readBy.length > 1;

    if (isReadByOthers) {
        // Read by at least one other person (double check)
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-400" viewBox="0 0 20 20" fill="currentColor"><path d="M18.28 6.28a.75.75 0 00-1.06-1.06L9.75 12.69 6.78 9.72a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l8-8z"></path><path d="M13.28 6.28a.75.75 0 00-1.06-1.06L6 11.19l-.97-.97a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l6.75-6.75z"></path></svg>;
    }
    // Delivered but not read by others yet (single check)
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;
});

const Message: React.FC<MessageProps> = ({ message, author, currentUser, onToggleReaction, onDelete, onVoteOnPoll, isJustSent }) => {
  const [isPickerOpen, setPickerOpen] = useState(false);

  if (message.type === MessageType.SYSTEM) {
    return (
        <div className="text-center text-xs text-lime-400/80 my-2 animate-fade-in-up">
            <span className="bg-zinc-800 px-2 py-1 rounded-full">-- {message.content} --</span>
        </div>
    );
  }
  
  const isCurrentUser = author?.id === currentUser.id;

  if (!author) return null; // Should not happen for non-system messages

  const animationClass = isJustSent && isCurrentUser
    ? 'animate-float-from-input'
    : 'animate-fade-in-up';

  const handleReactionClick = (emoji: string) => {
    onToggleReaction(emoji);
    setPickerOpen(false);
  };

  return (
    <div className={`flex items-start gap-3 group ${isCurrentUser ? 'flex-row-reverse' : ''} ${animationClass}`}>
      <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full mt-1 shadow-md" />
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center space-x-2">
          {!isCurrentUser && <span className="font-bold text-sm text-white">{author.name}</span>}
          <span className="text-xs text-zinc-500">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</span>
          {isCurrentUser && <ReadReceipt message={message} isCurrentUser={isCurrentUser} />}
        </div>

        <div className={`p-3 rounded-2xl max-w-md shadow-lg ${isCurrentUser ? 'bg-lime-900/80 rounded-br-xl' : 'bg-zinc-800/80 rounded-bl-xl'}`}>
          <MessageContent message={message} currentUser={currentUser} onVoteOnPoll={onVoteOnPoll} />
        </div>
        
        <div className={`relative flex items-center gap-2 mt-1.5 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
            <Reactions message={message} currentUser={currentUser} onToggleReaction={onToggleReaction} />
            
            <div className={`flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? 'flex-row-reverse': ''}`}>
              <button
                  onClick={() => setPickerOpen(!isPickerOpen)}
                  className="p-0.5 bg-zinc-700/80 rounded-full text-zinc-400 hover:scale-110 hover:text-white hover:bg-zinc-600"
                  aria-label="Add reaction"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 011.415 0 3.498 3.498 0 004.242 0 1 1 0 011.415-1.415 5.498 5.498 0 01-7.072 0 1 1 0 010 1.415z" clipRule="evenodd" /></svg>
              </button>

              {isCurrentUser && (
                <button
                    onClick={onDelete}
                    className="p-0.5 bg-zinc-700/80 rounded-full text-zinc-400 hover:scale-110 hover:text-red-400 hover:bg-zinc-600"
                    aria-label="Delete message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              )}
            </div>
            
            {isPickerOpen && <EmojiPicker onSelect={handleReactionClick} />}
        </div>
      </div>
    </div>
  );
};

export default memo(Message);