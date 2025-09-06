import { MOCK_GROUPS, users as MOCK_USERS, currentUser } from '../constants';
import { Group, Message, MessageType, User } from '../types';

/**
 * This class simulates a live P2P network, holding the "canonical" state.
 * In a real-world application, this logic would be replaced by actual peer-to-peer
 * networking code (e.g., using WebRTC or libp2p).
 */
export class P2PNetwork {
  private groups: Group[];
  private users: { [key: string]: User };

  constructor() {
    // Deep copy initial data and augment it with new properties for reactions/reads
    const initialGroups: Group[] = JSON.parse(JSON.stringify(MOCK_GROUPS));
    this.groups = initialGroups.map(group => ({
        ...group,
        messages: group.messages.map(message => ({
            ...message,
            reactions: message.reactions || {},
            readBy: message.readBy || [message.authorId],
        }))
    }));
    this.users = JSON.parse(JSON.stringify(MOCK_USERS));
  }
  
  addGroup(group: Group) {
    this.groups.push(group);
  }

  createGroup(groupName: string, members: User[], initialMessages: Message[]): Group {
    const newGroup: Group = {
      id: `group-net-${Date.now()}`,
      name: groupName,
      members,
      messages: initialMessages,
      unreadCount: 0,
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  /**
   * Returns the entire network state. The UI polls this method for updates.
   */
  getGroupsState(): Group[] {
    return JSON.parse(JSON.stringify(this.groups));
  }
  
  /**
   * Adds a message to the network's state.
   * @returns The canonical message object with a generated ID and timestamp.
   */
  sendMessage(
    groupId: string, 
    authorId: string,
    type: MessageType,
    content: string, 
    fileInfo?: { fileName: string, fileSize: string },
    payload?: any
  ): Message {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) throw new Error(`[P2PNetwork] Group not found: ${groupId}`);

    const newMessage: Message = {
      id: `msg-net-${Date.now()}`,
      authorId,
      type,
      content,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: [authorId], // Sender has read it by default
      ...(fileInfo && { fileName: fileInfo.fileName, fileSize: fileInfo.fileSize }),
      ...(payload || {}),
    };
    group.messages.push(newMessage);
    return newMessage;
  }

  deleteMessage(groupId: string, messageId: string) {
    const group = this.groups.find(g => g.id === groupId);
    if (group) {
        const messageIndex = group.messages.findIndex(m => m.id === messageId);
        if (messageIndex > -1) {
            group.messages.splice(messageIndex, 1);
        }
    }
  }
  
  /**
   * Toggles a reaction for a user on a specific message.
   */
  toggleReaction(groupId: string, messageId: string, userId: string, emoji: string) {
    const group = this.groups.find(g => g.id === groupId);
    const message = group?.messages.find(m => m.id === messageId);

    if (!message) return;

    if (!message.reactions[emoji]) {
        message.reactions[emoji] = [];
    }
    
    const userIndex = message.reactions[emoji].indexOf(userId);

    if (userIndex > -1) {
        // User has already reacted, so remove reaction
        message.reactions[emoji].splice(userIndex, 1);
        if (message.reactions[emoji].length === 0) {
            delete message.reactions[emoji];
        }
    } else {
        // Add user's reaction
        message.reactions[emoji].push(userId);
    }
  }

  voteOnPoll(groupId: string, messageId: string, optionIndex: number, userId: string) {
    const group = this.groups.find(g => g.id === groupId);
    const message = group?.messages.find(m => m.id === messageId);

    if (!message || message.type !== MessageType.POLL || !message.poll) return;
    
    const targetOption = message.poll.options[optionIndex];
    if (!targetOption) return;

    const currentVote = message.poll.options.find(opt => opt.votes.includes(userId));

    // If user clicks the same option they already voted for, remove the vote (toggle off)
    if (currentVote === targetOption) {
        const userIndex = targetOption.votes.indexOf(userId);
        targetOption.votes.splice(userIndex, 1);
        return;
    }

    // If user is changing their vote, remove old vote
    if (currentVote) {
        const userIndex = currentVote.votes.indexOf(userId);
        currentVote.votes.splice(userIndex, 1);
    }

    // Add new vote
    targetOption.votes.push(userId);
  }


  /**
   * Simulates peers sending messages, reading messages, and reacting.
   */
  simulatePeerActivity() {
    // 1 in 3 chance of a new message, otherwise simulate a read
    if (Math.random() < 0.33) {
      this.simulatePeerMessage();
    } else {
      this.simulatePeerRead();
    }
  }

  private simulatePeerMessage() {
    const peerIds = Object.keys(this.users).filter(id => id !== currentUser.id);
    if (peerIds.length === 0) return;

    const randomPeerId = peerIds[Math.floor(Math.random() * peerIds.length)];
    const peerGroups = this.groups.filter(g => g.members.some(m => m.id === randomPeerId));
    if (peerGroups.length === 0) return;

    const randomGroup = peerGroups[Math.floor(Math.random() * peerGroups.length)];
    
    const phrases = ["Just checking in on this.", "Looks good, thanks!", "I'll review this shortly.", "Let's sync up on this tomorrow."];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    const newMessage: Message = {
      id: `msg-sim-${Date.now()}`,
      authorId: randomPeerId,
      type: MessageType.TEXT,
      content: randomPhrase,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: [randomPeerId],
    };
    
    randomGroup.messages.push(newMessage);
  }

  private simulatePeerRead() {
    const peerIds = Object.keys(this.users).filter(id => id !== currentUser.id);
    if (peerIds.length === 0) return;
    const randomPeerId = peerIds[Math.floor(Math.random() * peerIds.length)];

    // Find a message in a group the peer is in, that the peer hasn't read yet
    const groupWithUnread = this.groups.find(g => 
        g.members.some(m => m.id === randomPeerId) &&
        g.messages.some(msg => !msg.readBy.includes(randomPeerId))
    );

    if (groupWithUnread) {
        const unreadMessage = groupWithUnread.messages.find(msg => !msg.readBy.includes(randomPeerId));
        if (unreadMessage) {
            unreadMessage.readBy.push(randomPeerId);
        }
    }
  }
}