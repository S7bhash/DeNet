import { User, Group, MessageType, Contact, Invitation } from './types';

export const currentUser: User = {
  id: 'user-1',
  name: 'You (Node 7B)',
  avatarUrl: 'https://picsum.photos/seed/you/100/100',
  isOnline: true,
};

export const users: { [key: string]: User } = {
  'user-1': currentUser,
  'user-2': {
    id: 'user-2',
    name: 'Alex (Node A4)',
    avatarUrl: 'https://picsum.photos/seed/alex/100/100',
    isOnline: true,
  },
  'user-3': {
    id: 'user-3',
    name: 'Sam (Node F9)',
    avatarUrl: 'https://picsum.photos/seed/sam/100/100',
    isOnline: true,
  },
  'user-4': {
    id: 'user-4',
    name: 'Casey (Node D1)',
    avatarUrl: 'https://picsum.photos/seed/casey/100/100',
    isOnline: false,
  },
};

export const MOCK_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'Project Phoenix',
    members: [users['user-1'], users['user-2'], users['user-3']],
    unreadCount: 3,
    messages: [
      { id: 'msg-1-1', authorId: 'user-2', type: MessageType.TEXT, content: 'Hey everyone, check out the latest design mockups.', timestamp: '10:30 AM' },
      { id: 'msg-1-2', authorId: 'user-2', type: MessageType.IMAGE, content: 'https://picsum.photos/seed/mockup/400/300', fileName: 'dashboard-v3.png', fileSize: '1.2 MB', timestamp: '10:31 AM' },
      { id: 'msg-1-3', authorId: 'user-3', type: MessageType.TEXT, content: 'Looks great! I especially like the new color palette.', timestamp: '10:35 AM' },
      { id: 'msg-1-4', authorId: 'user-1', type: MessageType.TEXT, content: 'Agreed. I will start implementing the sidebar component.', timestamp: '10:38 AM' },
      { id: 'msg-1-5', authorId: 'user-3', type: MessageType.FILE, content: '', fileName: 'project-specs.pdf', fileSize: '856 KB', timestamp: '11:05 AM' },
    ],
  },
  {
    id: 'group-2',
    name: 'Q3 Marketing',
    members: [users['user-1'], users['user-2'], users['user-4']],
    unreadCount: 0,
    messages: [
       { id: 'msg-2-1', authorId: 'user-4', type: MessageType.TEXT, content: 'What\'s the status on the video ad campaign?', timestamp: 'Yesterday' },
       { id: 'msg-2-2', authorId: 'user-2', type: MessageType.VIDEO, content: 'https://picsum.photos/seed/video/400/225', fileName: 'campaign-draft-v2.mp4', fileSize: '15.7 MB', timestamp: 'Yesterday' },
       { id: 'msg-2-3', authorId: 'user-1', type: MessageType.TEXT, content: 'Just reviewed it, adding my feedback now. Great work!', timestamp: '9:15 AM' },
    ],
  },
  {
    id: 'group-3',
    name: 'Weekend Plans',
    members: [users['user-1'], users['user-3']],
    unreadCount: 1,
    messages: [
      { id: 'msg-3-1', authorId: 'user-3', type: MessageType.TEXT, content: 'Anyone up for a hike this weekend?', timestamp: '1:20 PM' },
    ],
  },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'contact-1', name: 'Alex (Node A4)', avatarUrl: users['user-2'].avatarUrl, isUser: true },
    { id: 'contact-2', name: 'Casey (Node D1)', avatarUrl: users['user-4'].avatarUrl, isUser: true },
    { id: 'contact-3', name: 'Jordan', avatarUrl: 'https://picsum.photos/seed/jordan/100/100', isUser: false },
    { id: 'contact-4', name: 'Taylor', avatarUrl: 'https://picsum.photos/seed/taylor/100/100', isUser: false },
    { id: 'contact-5', name: 'Sam (Node F9)', avatarUrl: users['user-3'].avatarUrl, isUser: true },
];

export const MOCK_INVITATIONS: Invitation[] = [
    {
        id: 'invite-1',
        inviter: users['user-3'],
        group: {
            id: 'group-4-stealth',
            name: 'Stealth Ops',
            members: [users['user-3']],
            unreadCount: 1,
            messages: [
                { id: 'msg-4-1', authorId: 'user-3', type: MessageType.TEXT, content: 'Ready for the mission?', timestamp: '3:45 PM' },
            ],
        }
    }
]
