import React from 'react';
import { Group, Invitation, User, MessageType } from '../types';

interface GroupListViewProps {
  currentUser: User;
  groups: Group[];
  onSelectGroup: (groupId: string) => void;
  isConnected: boolean;
  onOpenCreateGroupModal: () => void;
  onOpenProfileModal: () => void;
  invitations: Invitation[];
  onAcceptInvitation: (invitation: Invitation) => void;
  onDeclineInvitation: (invitationId: string) => void;
}

const UserProfileHeader: React.FC<{ currentUser: User, isConnected: boolean; onOpenProfileModal: () => void }> = ({ currentUser, isConnected, onOpenProfileModal }) => (
    <div className="flex items-center justify-between p-4 bg-zinc-900/70 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
            <div className="relative">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full border-2 border-zinc-600"/>
                <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ${isConnected ? 'bg-lime-500 animate-pulse' : 'bg-red-500'} ring-2 ring-zinc-900`}></span>
            </div>
            <div>
                <h3 className="font-semibold text-white text-lg">{currentUser.name}</h3>
                <p className={`text-sm ${isConnected ? 'text-lime-400' : 'text-red-400'}`}>{isConnected ? 'Status: Connected' : 'Status: Disconnected'}</p>
            </div>
        </div>
        <button onClick={onOpenProfileModal} className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
    </div>
);

const getLastMessagePreview = (group: Group): string => {
    const lastMessage = group.messages[group.messages.length - 1];
    if (!lastMessage) return "No messages yet";
    
    switch(lastMessage.type) {
        case MessageType.TEXT:
        case MessageType.SYSTEM:
            return lastMessage.content;
        case MessageType.IMAGE:
            return `📷 ${lastMessage.fileName || 'Image'}`;
        case MessageType.VIDEO:
            return `📹 ${lastMessage.fileName || 'Video'}`;
        case MessageType.FILE:
            return `📄 ${lastMessage.fileName || 'File'}`;
        default:
            return "New activity";
    }
};

const GroupListItem: React.FC<{ group: Group; onClick: () => void }> = ({ group, onClick }) => (
    <li
        onClick={onClick}
        className="flex items-center justify-between p-3 cursor-pointer mx-2 transition-all duration-200 border-b border-zinc-800"
    >
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-lime-400 border border-zinc-600 text-xl">
                {group.name.charAt(0)}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-white">{group.name}</p>
                <p className="text-sm text-zinc-400 truncate max-w-[200px]">{getLastMessagePreview(group)}</p>
            </div>
        </div>
        {group.unreadCount > 0 && (
            <span className="bg-lime-500 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{group.unreadCount}</span>
        )}
    </li>
);

const InvitationItem: React.FC<{ invitation: Invitation, onAccept: () => void, onDecline: () => void }> = ({ invitation, onAccept, onDecline }) => (
    <div className="bg-zinc-800/50 p-3 rounded-lg mx-2 border border-zinc-700/50">
        <div className="flex items-center space-x-3 mb-3">
            <img src={invitation.inviter.avatarUrl} alt={invitation.inviter.name} className="w-8 h-8 rounded-full"/>
            <div>
                <p className="text-sm text-zinc-300"><span className="font-semibold text-white">{invitation.inviter.name}</span> invited you to</p>
                <p className="font-bold text-lime-400">{invitation.group.name}</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button onClick={onAccept} className="flex-1 bg-lime-500 text-black text-sm font-bold py-1 rounded hover:bg-lime-400 transition-colors">Accept</button>
            <button onClick={onDecline} className="flex-1 bg-zinc-700 text-zinc-300 text-sm font-bold py-1 rounded hover:bg-zinc-600 transition-colors">Decline</button>
        </div>
    </div>
);


const GroupListView: React.FC<GroupListViewProps> = ({ currentUser, groups, onSelectGroup, isConnected, onOpenCreateGroupModal, onOpenProfileModal, invitations, onAcceptInvitation, onDeclineInvitation }) => {
  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col">
        <UserProfileHeader 
            currentUser={currentUser}
            isConnected={isConnected} 
            onOpenProfileModal={onOpenProfileModal}
        />
        <div className="flex-1 overflow-y-auto">
            {invitations.length > 0 && (
                <div className="my-2">
                     <h2 className="text-sm font-semibold uppercase text-zinc-500 tracking-wider p-3">Invitations</h2>
                     <div className="space-y-2">
                        {invitations.map(inv => (
                            <InvitationItem 
                                key={inv.id} 
                                invitation={inv} 
                                onAccept={() => onAcceptInvitation(inv)} 
                                onDecline={() => onDeclineInvitation(inv.id)}
                            />
                        ))}
                     </div>
                </div>
            )}

            <div className="p-3">
                <h2 className="text-sm font-semibold uppercase text-zinc-500 tracking-wider">Groups</h2>
            </div>
            <ul className="space-y-1">
                {groups.map(group => (
                    <GroupListItem 
                        key={group.id}
                        group={group}
                        onClick={() => onSelectGroup(group.id)}
                    />
                ))}
            </ul>
        </div>

        <button 
            onClick={onOpenCreateGroupModal}
            className="absolute bottom-6 right-6 bg-lime-500 text-black rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:bg-lime-400 transition-transform duration-200 hover:scale-105"
            aria-label="Create new group"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
  );
};

export default GroupListView;