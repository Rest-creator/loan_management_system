import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { MessageCard, MessageInput } from '../components/MessageCard';
import { sampleChats, sampleMessages, sampleProducts, sampleUsers } from '../data/dummyData';
import type { Chat, Message } from '../data/dummyData';
import Server from '../server/Server';
import { useAuth } from '../server/AuthContext';

export const Messages: React.FC = () => {
  const { auth } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations on component mount
  useEffect(() => {
    if (auth.user) {
      fetchConversations();
    }
  }, [auth.user]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      fetchMessages(parseInt(selectedChat.id));
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await Server.fetchUserConversations();
      if (response.data.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to sample data
      setConversations(sampleChats);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await Server.fetchConversationMessages(conversationId);
      if (response.data.success) {
        setMessages(response.data.messages || []);
        // Mark messages as read
        await Server.markMessagesRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to sample messages
      setMessages(sampleMessages);
    }
  };

  const filteredChats = (conversations.length > 0 ? conversations : sampleChats).filter(chat =>
    chat.participants?.some(participant =>
      participant.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSendMessage = async (content: string) => {
    if (!selectedChat || !auth.user) return;

    const otherParticipant = selectedChat.participants.find(p => p.id !== auth.user.id);
    if (!otherParticipant) return;

    try {
      const response = await Server.sendMessage({
        receiver_id: parseInt(otherParticipant.id),
        content: content
      });

      if (response.data.success) {
        // Add message to local state
        const newMessage: Message = {
          id: response.data.message.id,
          sender: auth.user,
          receiver: otherParticipant,
          content,
          timestamp: new Date().toISOString(),
          isRead: false,
          type: 'text'
        };

        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback: add message locally
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: auth.user,
        receiver: otherParticipant,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      };

      setMessages(prev => [...prev, newMessage]);
    }
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Chat List Sidebar */}
          <div className={`w-full lg:w-1/3 bg-white border-r border-neutral-200 flex flex-col ${
            selectedChat ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="p-4 border-b border-neutral-200">
              <h1 className="text-xl font-bold text-neutral-800 mb-4">Messages</h1>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-primary pl-10"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {filteredChats.map((chat) => {
                    const otherParticipant = chat.participants.find(p => p.id !== sampleUsers[0].id);
                    if (!otherParticipant) return null;

                    return (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                          selectedChat?.id === chat.id ? 'bg-brand-secondary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={otherParticipant.avatar}
                              alt={otherParticipant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {otherParticipant.isOnline && (
                              <div className="status-online absolute -bottom-0.5 -right-0.5" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-neutral-800 truncate">
                                {otherParticipant.name}
                              </h3>
                              <span className="text-xs text-neutral-500">
                                {formatLastMessageTime(chat.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-neutral-600 truncate">
                              {chat.lastMessage.content}
                            </p>
                            
                            {chat.product && (
                              <p className="text-xs text-brand-primary mt-1 truncate">
                                Re: {chat.product.title}
                              </p>
                            )}
                          </div>
                          
                          {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-brand-primary text-white text-xs rounded-full flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-6 h-6 text-neutral-400" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 mb-2">No conversations found</h3>
                  <p className="text-neutral-600">
                    {searchQuery ? 'Try a different search term' : 'Start a conversation by messaging a seller'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat View */}
          <div className={`flex-1 flex flex-col bg-white ${
            selectedChat ? 'flex' : 'hidden lg:flex'
          }`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="lg:hidden p-1 text-neutral-600 hover:text-neutral-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <img
                      src={selectedChat.participants.find(p => p.id !== sampleUsers[0].id)?.avatar}
                      alt="Chat participant"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    
                    <div>
                      <h2 className="font-semibold text-neutral-800">
                        {selectedChat.participants.find(p => p.id !== sampleUsers[0].id)?.name}
                      </h2>
                      {selectedChat.product && (
                        <p className="text-sm text-brand-primary">
                          About: {selectedChat.product.title}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Context */}
                {selectedChat.product && (
                  <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex gap-3 p-3 bg-white rounded-lg border border-neutral-200">
                      <img
                        src={selectedChat.product.images[0]}
                        alt={selectedChat.product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-800 line-clamp-1">
                          {selectedChat.product.title}
                        </h3>
                        <p className="text-brand-primary font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                          }).format(selectedChat.product.price)}
                        </p>
                        <span className="text-xs text-neutral-500">
                          {selectedChat.product.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages
                    .filter(msg => 
                      (msg.sender.id === sampleUsers[0].id && msg.receiver.id === selectedChat.participants.find(p => p.id !== sampleUsers[0].id)?.id) ||
                      (msg.receiver.id === sampleUsers[0].id && msg.sender.id === selectedChat.participants.find(p => p.id !== sampleUsers[0].id)?.id)
                    )
                    .map((message, index) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        product={message.productId ? sampleProducts.find(p => p.id === message.productId) : undefined}
                        isOwn={message.sender.id === sampleUsers[0].id}
                        showAvatar={index === 0 || messages[index - 1].sender.id !== message.sender.id}
                      />
                    ))}
                </div>

                {/* Message Input */}
                <MessageInput onSend={handleSendMessage} />
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-neutral-600 max-w-sm">
                    Choose a conversation from the sidebar to start messaging, or reach out to a seller from their product page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};