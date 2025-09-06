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

    // Optimistic UI update
    setGroups(prevGroups => prevGroups.map(group => 
        group.id === groupId
            ? { ...group, messages: group.messages.filter(m => m.id !== messageId) }
            : group
    ));
  }, [isConnected, p2pNetwork]);
  
  const handleToggleReaction = useCallback((groupId: string, messageId: string, emoji: string) => {
    if (!isConnected) return;

    p2pNetwork.toggleReaction(groupId, messageId, currentUser.id, emoji);
    setGroups(p2pNetwork.getGroupsState()); // Sync state after interaction
  }, [isConnected, currentUser.id, p2pNetwork]);

  const handleVoteOnPoll = useCallback((groupId: string, messageId: string, optionIndex: number) => {
    if (!isConnected) return;
    p2pNetwork.voteOnPoll(groupId, messageId, optionIndex, currentUser.id);
    setGroups(p2pNetwork.getGroupsState()); // Sync state after interaction
  }, [isConnected, currentUser.id, p2pNetwork]);

  const handleCreateGroup = useCallback((groupName: string, invitedContacts: Contact[]) => {
    if (!groupName.trim() || invitedContacts.length === 0) return;
    
    const timestamp = new Date().toISOString();
    
    const initialMessages: Message[] = [
        {
          id: `msg-create-${Date.now()}`,
          authorId: 'system',
          type: MessageType.SYSTEM,
          content: `You created the network "${groupName}".`,
          timestamp,
          reactions: {},
          readBy: [currentUser.id]
        },
        ...invitedContacts.map((contact, index): Message => {
            if (!contact.isUser) {
                 showNotification('New Network Invitation', {
                    body: `${currentUser.name} has invited you to join the network "${groupName}".`,
                    icon: currentUser.avatarUrl,
                });
            }
            return {
             id: `msg-invite-${Date.now()}-${index}`,
             authorId: 'system',
             type: MessageType.SYSTEM,
             content: `You invited ${contact.name}. A notification will be sent.`,
             timestamp,
             reactions: {},
             readBy: [currentUser.id]
            }
        })
    ];

    const newGroup = p2pNetwork.createGroup(groupName, [currentUser], initialMessages);

    setGroups(prevGroups => [...prevGroups, newGroup]);
    setActiveGroupId(newGroup.id);
    setCreateGroupModalOpen(false);
  }, [p2pNetwork, currentUser]);

  const handleAcceptInvitation = useCallback((invitation: Invitation) => {
    const { group } = invitation;
    const groupWithCurrentUser = {
      ...group,
      members: [...group.members, currentUser],
      messages: [
        ...group.messages,
        {
          id: `msg-join-${Date.now()}`,
          authorId: 'system',
          type: MessageType.SYSTEM,
          content: `${currentUser.name} joined the network.`,
          timestamp: new Date().toISOString(),
          reactions: {},
          readBy: [...group.members.map(m => m.id), currentUser.id],
        }
      ]
    };
    p2pNetwork.addGroup(groupWithCurrentUser);
    setGroups(prev => [...prev, groupWithCurrentUser]);
    setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    setActiveGroupId(group.id);
  }, [p2pNetwork, currentUser]);

  const handleDeclineInvitation = useCallback((invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  }, []);
  
  const handleUpdateProfile = useCallback((name: string, avatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, name, avatarUrl }));
    setProfileModalOpen(false);
  }, []);

  const handleCreatePoll = useCallback((question: string, options: string[]) => {
    if (!activeGroupId) return;
    const pollData = {
        question,
        options: options.map(opt => ({ text: opt, votes: [] }))
    };
    handleSendMessage(MessageType.POLL, `Poll: ${question}`, undefined, { poll: pollData });
    setCreatePollModalOpen(false);
  }, [activeGroupId, handleSendMessage]);

  const handleCreateEvent = useCallback((title: string, dateTime: string, location: string) => {
    if (!activeGroupId) return;
    const eventData = { title, dateTime, location };
    handleSendMessage(MessageType.EVENT, `Event: ${title}`, undefined, { event: eventData });
    setCreateEventModalOpen(false);
  }, [activeGroupId, handleSendMessage]);

  return (
    <>
      <div className="h-screen w-screen text-zinc-300 bg-zinc-950 font-mono overflow-hidden">
        <div className="relative h-full w-full">
            <div className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-out ${activeGroupId ? '-translate-x-full' : 'translate-x-0'}`}>
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

            {renderedGroup && (
                <div 
                    className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-out ${activeGroupId ? 'translate-x-0' : 'translate-x-full'}`}
                    onTransitionEnd={handleTransitionEnd}
                >
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
                </div>
            )}
        </div>
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
    </>
  );
};

export default App;