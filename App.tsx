import React, { useState, useEffect } from 'react';
import GroupListView from './components/GroupListView';
import ChatView from './components/ChatView';
import CreateGroupModal from './components/CreateGroupModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import { MOCK_GROUPS, MOCK_INVITATIONS, currentUser as initialUser } from './constants';
import { Group, MessageType, User, Contact, Invitation } from './types';

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [justSentMessageIds, setJustSentMessageIds] = useState(new Set<string>());

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  
  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, options: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  useEffect(() => {
    if (isConnected && activeGroupId) {
        setIsSyncing(true);
        console.log('Reconnected. Syncing with peer nodes...');
        setTimeout(() => {
          setGroups(prevGroups => {
            return prevGroups.map(group => {
              if (group.id === activeGroupId) {
                const newSyncMessage = {
                  id: `sync-${Date.now()}`,
                  authorId: 'system',
                  type: MessageType.SYSTEM,
                  content: `Context updated from peer nodes.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                 const anotherNewMessage = {
                  id: `msg-${Date.now()}`,
                  authorId: 'user-2',
                  type: MessageType.TEXT,
                  content: 'Oh, I just pushed an update to the design files. Make sure you pull the latest version.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                return { ...group, messages: [...group.messages, newSyncMessage, anotherNewMessage] };
              }
              return group;
            });
          });
          setIsSyncing(false);
          console.log('Sync complete.');
        }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setGroups(prevGroups => prevGroups.map(g => g.id === groupId ? {...g, unreadCount: 0} : g));
  };

  const handleBackToGroups = () => {
    setActiveGroupId(null);
  }
  
  const handleSendMessage = (content: string) => {
    if (!activeGroupId || !content.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      authorId: currentUser.id,
      type: MessageType.TEXT,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setJustSentMessageIds(prev => new Set(prev).add(newMessage.id));

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
  };

  const handleCreateGroup = (groupName: string, invitedContacts: Contact[]) => {
    if (!groupName.trim() || invitedContacts.length === 0) return;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const initialMessages: any[] = [
        {
          id: `msg-create-${Date.now()}`,
          authorId: 'system',
          type: MessageType.SYSTEM,
          content: `You created the network "${groupName}".`,
          timestamp,
        },
        ...invitedContacts.map((contact, index) => {
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
            }
        })
    ];

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupName,
      members: [currentUser],
      unreadCount: 0,
      messages: initialMessages,
    };

    setGroups(prevGroups => [...prevGroups, newGroup]);
    setActiveGroupId(newGroup.id);
    setCreateGroupModalOpen(false);
  };

  const handleAcceptInvitation = (invitation: Invitation) => {
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };
    setGroups(prev => [...prev, groupWithCurrentUser]);
    setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    setActiveGroupId(group.id);
  };

  const handleDeclineInvitation = (invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };
  
  const handleUpdateProfile = (name: string, avatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, name, avatarUrl }));
    setProfileModalOpen(false);
  };

  return (
    <>
      <div className="h-screen w-screen text-zinc-300 bg-zinc-950 font-mono overflow-hidden">
        <div className="relative h-full w-full">
            <GroupListView 
              currentUser={currentUser}
              groups={groups} 
              onSelectGroup={handleSelectGroup}
              isConnected={isConnected}
              onOpenCreateGroupModal={() => setCreateGroupModalOpen(true)}
              onOpenProfileModal={() => setProfileModalOpen(true)}
              invitations={invitations}
              onAcceptInvitation={handleAcceptInvitation}
              onDeclineInvitation={handleDeclineInvitation}
            />

            {activeGroup && (
                <div className="absolute top-0 left-0 w-full h-full animate-slide-in-from-right">
                    <ChatView 
                      group={activeGroup} 
                      isSyncing={isSyncing}
                      isConnected={isConnected}
                      onSendMessage={handleSendMessage}
                      justSentMessageIds={justSentMessageIds}
                      onBack={handleBackToGroups}
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
    </>
  );
};

export default App;