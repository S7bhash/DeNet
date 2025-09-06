import React from 'react';
import { Message, User, MessageType } from '../types';
import { currentUser } from '../constants';

interface MessageProps {
  message: Message;
  author?: User;
  isJustSent?: boolean;
}

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;


const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    switch (message.type) {
        case MessageType.IMAGE:
            return <img src={message.content} alt={message.fileName || 'Shared image'} className="rounded-lg max-w-xs mt-2 cursor-pointer shadow-lg" />;
        case MessageType.VIDEO:
            return (
                <div className="p-3 bg-zinc-800/50 rounded-lg flex items-center space-x-3 mt-2">
                    <VideoIcon/>
                    <div>
                        <p className="font-semibold text-white">{message.fileName}</p>
                        <p className="text-sm text-zinc-400">{message.fileSize}</p>
                    </div>
                </div>
            );
        case MessageType.FILE:
             return (
                <div className="p-3 bg-zinc-800/50 rounded-lg flex items-center space-x-3 mt-2">
                    <FileIcon/>
                    <div>
                        <p className="font-semibold text-white">{message.fileName}</p>
                        <p className="text-sm text-zinc-400">{message.fileSize}</p>
                    </div>
                </div>
            );
        default:
            return <p className="text-zinc-200 whitespace-pre-wrap">{message.content}</p>;
    }
};

const Message: React.FC<MessageProps> = ({ message, author, isJustSent }) => {
  if (message.type === MessageType.SYSTEM) {
    return (
        <div className="text-center text-xs text-lime-400/80 my-2 animate-fade-in-up">
            <span className="bg-zinc-800 px-2 py-1 rounded">-- {message.content} --</span>
        </div>
    );
  }
  
  const isCurrentUser = author?.id === currentUser.id;

  if (!author) return null; // Should not happen for non-system messages

  const animationClass = isJustSent && isCurrentUser
    ? 'animate-float-from-input'
    : 'animate-fade-in-up';

  return (
    <div className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} ${animationClass}`}>
      <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full mt-1 shadow-md" />
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center space-x-2">
          {!isCurrentUser && <span className="font-bold text-sm text-white">{author.name}</span>}
          <span className="text-xs text-zinc-500">{message.timestamp}</span>
        </div>
        <div className={`p-3 rounded-lg max-w-md shadow-lg ${isCurrentUser ? 'bg-lime-900/80' : 'bg-zinc-800'}`}>
          <MessageContent message={message} />
        </div>
      </div>
    </div>
  );
};

export default Message;