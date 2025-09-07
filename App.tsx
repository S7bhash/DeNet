
import React, { useState, useEffect, useCallback } from 'react';
import GroupListView from './components/GroupListView';
import ChatView from './components/ChatView';
import CreateGroupModal from './components/CreateGroupModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import CreatePollModal from './components/CreatePollModal';
import CreateEventModal from './components/CreateEventModal';
import { MOCK_INVITATIONS, currentUser as initialUser } from './constants';
import { Group, Message, MessageType, User, Contact, Invitation } from './types';
import { P2PNetwork } from './services/p2p-network';

const App: React.FC = () => {
  // The P2PNetwork class instance holds the "true" network state.
  const [p2pNetwork] = useState(() => new P2PNetwork());
  
  // This is the user's local state, which might be out of sync when offline.
  const [groups, setGroups] = useState<Group[]>(() => p2pNetwork.getGroupsState());
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [activeGroupId, setActiveGroupId] = useState<string | null>('group-1');
  const [renderedGroupId, setRenderedGroupId] = useState<string | null>('group-1');
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isCreatePollModalOpen, setCreatePollModalOpen] = useState(false);
  const [isCreateEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [justSentMessageIds, setJustSentMessageIds] = useState(new Set<string>());

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const renderedGroup = groups.find(g => g.id === renderedGroupId) || null;
  
  // Effect to manage which chat view is rendered for smooth animations
  useEffect(() => {
    if (activeGroupId) {
        setRenderedGroupId(activeGroupId);
    }
  }, [activeGroupId]);

  const handleTransitionEnd = useCallback(() => {
    if (!activeGroupId) {
        setRenderedGroupId(null);
    }
  }, [activeGroupId]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Effect for polling for real-time updates when connected
  useEffect(() => {
    if (!isConnected) return;

    const pollInterval = window.setInterval(() => {
      const networkState = p2pNetwork.getGroupsState();
      setGroups(networkState);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isConnected, p2pNetwork]);

  // Simulate network activity when the user is OFFLINE
  useEffect(() => {
    let simulationInterval: number | null = null;
    if (!isConnected) {
      simulationInterval = window.setInterval(() => {
        p2pNetwork.simulatePeerActivity();
      }, 4000); // Simulate a message from a peer every 4 seconds
    }
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [isConnected, p2pNetwork]);

  const handleSetConnection = useCallback((shouldBeConnected: boolean) => {
    if (shouldBeConnected && !isConnected) { // Going from Offline -> Online
      setIsSyncing(true);
      
      // Simulate network delay for sync
      setTimeout(() => {
        const networkState = p2pNetwork.getGroupsState();
        setGroups(networkState); // Perform a full state sync
        setIsConnected(true);
        setIsSyncing(false);
      }, 1500);

    } else if (!shouldBeConnected && isConnected) { // Going from Online -> Offline
      setIsConnected(false);
    }
  }, [isConnected, p2pNetwork]);

  const showNotification = (title: string, options: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  const handleSelectGroup = useCallback((groupId: string) => {
    setActiveGroupId(groupId);
    setGroups(prevGroups => prevGroups.map(g => g.id === groupId ? {...g, unreadCount: 0} : g));
  }, []);

  const handleBackToGroups = useCallback(() => {
    setActiveGroupId(null);
  }, []);
  
  const handleSendMessage = useCallback((
    type: MessageType, 
    content: string, 
    fileInfo?: { fileName: string, fileSize: string },
    payload?: any
  ) => {
    if (!activeGroupId || !isConnected) return;
    if (type === MessageType.TEXT && !content.trim()) return;

    const newMessage = p2pNetwork.sendMessage(activeGroupId, currentUser.id, type, content, fileInfo, payload);

    setJustSentMessageIds(prev => new Set(prev).add(newMessage.id));
    
    // Optimistically update UI
    setGroups(prevGroups => prevGroups.map(group => 
      group.id === activeGroupId 
        ? { ...group, messages: [...group.messages, newMessage] } 
        : group
    ));
    
    setTimeout(() => {
        setJustSentMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(newMessage.id);
            return newSet;
        });
    }, 600);
  }, [activeGroupId, isConnected, currentUser.id, p2pNetwork]);

  const handleDeleteMessage = useCallback((groupId: string, messageId: string) => {
    if (!isConnected) return;
    p2pNetwork.deleteMessage(groupId, messageId);

    // Optimistically update UI
    setGroups(prevGroups => prevGroups.map(group => 
      group.id === groupId 
        ? { ...group, messages: group.messages.filter(m => m.id !== messageId) } 
        : group
    ));
  }, [isConnected, p2pNetwork]);
  
  const handleToggleReaction = useCallback((groupId: string, messageId: string, emoji: string) => {
    if (!isConnected) return;
    p2pNetwork.toggleReaction(groupId, messageId, currentUser.id, emoji);
    // Optimistic update
    const networkState = p2pNetwork.getGroupsState();
    setGroups(networkState);
  }, [isConnected, currentUser.id, p2pNetwork]);
  
  const handleVoteOnPoll = useCallback((groupId: string, messageId: string, optionIndex: number) => {
    if (!isConnected) return;
    p2pNetwork.voteOnPoll(groupId, messageId, optionIndex, currentUser.id);
    const networkState = p2pNetwork.getGroupsState();
    setGroups(networkState);
  }, [isConnected, currentUser.id, p2pNetwork]);

  const handleCreateGroup = (groupName: string, selectedContacts: Contact[]) => {
    const newMembers = [currentUser, ...selectedContacts
      .map(c => Object.values(initialUser).find(u => u.name === c.name))
      .filter((u): u is User => u !== undefined)
    ];

    const welcomeMessage: Message = {
      id: `msg-sys-${Date.now()}`,
      authorId: 'system',
      type: MessageType.SYSTEM,
      content: `${currentUser.name} created the group "${groupName}".`,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: newMembers.map(m => m.id)
    };

    const newGroup = p2pNetwork.createGroup(groupName, newMembers, [welcomeMessage]);
    
    setGroups(prev => [...prev, newGroup]);
    setCreateGroupModalOpen(false);
    setActiveGroupId(newGroup.id);
  };
  
  const handleUpdateProfile = (name: string, avatarUrl: string) => {
    setCurrentUser(prev => ({...prev, name, avatarUrl}));
    setProfileModalOpen(false);
  };

  const handleCreatePoll = (question: string, options: string[]) => {
      const pollPayload = {
        poll: {
            question,
            options: options.map(opt => ({ text: opt, votes: [] }))
        }
      };
      handleSendMessage(MessageType.POLL, `Poll: ${question}`, undefined, pollPayload);
      setCreatePollModalOpen(false);
  };
  
  const handleCreateEvent = (title: string, dateTime: string, location: string) => {
      const eventPayload = {
          event: { title, dateTime, location }
      };
      handleSendMessage(MessageType.EVENT, `Event: ${title}`, undefined, eventPayload);
      setCreateEventModalOpen(false);
  };
  
  const handleAcceptInvitation = (invitation: Invitation) => {
      const newGroup: Group = {
          ...invitation.group,
          members: [...invitation.group.members, currentUser]
      };
      p2pNetwork.addGroup(newGroup);
      setGroups(prev => [...prev, newGroup]);
      setInvitations(prev => prev.filter(i => i.id !== invitation.id));
      setActiveGroupId(newGroup.id);
  };
  
  const handleDeclineInvitation = (invitationId: string) => {
      setInvitations(prev => prev.filter(i => i.id !== invitationId));
  };
  
  return (
    <div className="w-full h-full bg-zinc-950 text-zinc-200 flex justify-center">
      <div className="w-full h-full flex overflow-hidden relative md:max-w-screen-lg lg:max-w-screen-xl md:border-x md:border-zinc-800">
        <div className={`w-full h-full absolute md:static md:w-[350px] lg:w-[400px] md:flex-shrink-0 inset-0 transition-transform duration-300 ease-in-out z-20 ${activeGroupId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
           <GroupListView 
              currentUser={currentUser}
              groups={groups}
              onSelectGroup={handleSelectGroup}
              isConnected={isConnected}
              onToggleConnection={() => handleSetConnection(!isConnected)}
              onOpenCreateGroupModal={() => setCreateGroupModalOpen(true)}
              onOpenProfileModal={() => setProfileModalOpen(true)}
              invitations={invitations}
              onAcceptInvitation={handleAcceptInvitation}
              onDeclineInvitation={handleDeclineInvitation}
           />
        </div>
        <main className={`flex-1 transition-transform duration-300 ease-in-out md:translate-x-0 absolute inset-0 md:static z-10 ${activeGroupId ? 'translate-x-0' : 'translate-x-full'}`} onTransitionEnd={handleTransitionEnd}>
            {renderedGroup ? (
                <ChatView 
                  group={renderedGroup} 
                  currentUser={currentUser}
                  isSyncing={isSyncing}
                  isConnected={isConnected}
                  onSendMessage={handleSendMessage}
                  onToggleReaction={handleToggleReaction}
                  onDeleteMessage={handleDeleteMessage}
                  onVoteOnPoll={handleVoteOnPoll}
                  justSentMessageIds={justSentMessageIds}
                  onBack={handleBackToGroups}
                  onOpenPollModal={() => setCreatePollModalOpen(true)}
                  onOpenEventModal={() => setCreateEventModalOpen(true)}
                />
            ) : (
               <div className="hidden md:flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-950">
                    <svg className="w-24 h-24 text-zinc-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-4 text-lg font-semibold">Select a conversation</p>
                    <p className="text-sm text-zinc-600">Choose from your existing groups to read and send messages.</p>
                </div>
            )}
        </main>
      </div>
        
        <CreateGroupModal 
          isOpen={isCreateGroupModalOpen}
          onClose={() => setCreateGroupModalOpen(false)}
          onCreate={handleCreateGroup}
        />
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onSave={handleUpdateProfile}
          currentUser={currentUser}
        />
        <CreatePollModal 
          isOpen={isCreatePollModalOpen}
          onClose={() => setCreatePollModalOpen(false)}
          onCreate={handleCreatePoll}
        />
        <CreateEventModal
          isOpen={isCreateEventModalOpen}
          onClose={() => setCreateEventModalOpen(false)}
          onCreate={handleCreateEvent}
        />
    </div>
  );
};

export default App;
