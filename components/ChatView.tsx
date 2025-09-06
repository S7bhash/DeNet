import React, { useRef, useEffect, useState } from 'react';
import { Group, Message as MessageType, MessageType as MsgEnum, User } from '../types';
import Header from './Header';
import Message from './Message';
import MessageInput from './MessageInput';
import MediaView from './MediaView';
import MediaPreviewModal from './MediaPreviewModal';
import { users } from '../constants';
import GraffitiBackground from './GraffitiBackground';

interface ChatViewProps {
  group: Group;
  currentUser: User;
  isSyncing: boolean;
  isConnected: boolean;
  onSendMessage: (type: MsgEnum, content: string, fileInfo?: { fileName: string, fileSize: string }, payload?: any) => void;
  onToggleReaction: (groupId: string, messageId: string, emoji: string) => void;
  onDeleteMessage: (groupId: string, messageId: string) => void;
  onVoteOnPoll: (groupId: string, messageId: string, optionIndex: number) => void;
  justSentMessageIds: Set<string>;
  onBack: () => void;
  onOpenPollModal: () => void;
  onOpenEventModal: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  group, currentUser, isSyncing, isConnected, 
  onSendMessage, onToggleReaction, onDeleteMessage, onVoteOnPoll,
  justSentMessageIds, onBack, onOpenPollModal, onOpenEventModal
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'chat' | 'media'>('chat');
  const [selectedMedia, setSelectedMedia] = useState<MessageType | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    if(view === 'chat') {
      scrollToBottom();
    }
  }, [group.messages, view]);
  
  const mediaMessages = group.messages.filter(m => m.type === MsgEnum.IMAGE || m.type === MsgEnum.VIDEO);

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden">
      <GraffitiBackground />
      
      <div className="relative z-10 flex flex-col h-full bg-transparent">
        <Header 
          groupName={group.name} 
          memberCount={group.members.length}
          activeView={view}
          onViewChange={setView}
          onBack={onBack}
        />
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {view === 'chat' ? (
            <>
              <div className="space-y-6">
                {group.messages.map(msg => (
                  <Message 
                    key={msg.id} 
                    message={msg} 
                    author={users[msg.authorId]}
                    currentUser={currentUser}
                    onToggleReaction={(emoji) => onToggleReaction(group.id, msg.id, emoji)}
                    onDelete={() => onDeleteMessage(group.id, msg.id)}
                    onVoteOnPoll={(optionIndex) => onVoteOnPoll(group.id, msg.id, optionIndex)}
                    isJustSent={justSentMessageIds.has(msg.id)}
                  />
                ))}
              </div>
              <div ref={messagesEndRef} />
            </>
          ) : (
            <MediaView messages={mediaMessages} onMediaSelect={setSelectedMedia} />
          )}
        </div>

        {isSyncing && (
            <div className="px-6 pb-2 text-sm text-lime-400 flex items-center justify-center animate-pulse bg-zinc-950/50">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-lime-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 * 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Syncing with peer nodes...
            </div>
        )}

        {!isConnected && (
           <div className="px-6 py-2 bg-red-500/20 text-red-400 text-center text-sm">
              You are offline. Messages will not be sent or received.
           </div>
        )}

        <div className="p-2 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
          <MessageInput 
            onSendMessage={onSendMessage} 
            disabled={!isConnected || isSyncing}
            onOpenPollModal={onOpenPollModal}
            onOpenEventModal={onOpenEventModal}
          />
        </div>
      </div>


      {selectedMedia && (
        <MediaPreviewModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </div>
  );
};

export default ChatView;