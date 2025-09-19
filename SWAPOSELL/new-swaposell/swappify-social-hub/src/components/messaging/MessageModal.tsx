import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Send, ArrowLeft, Loader2 } from 'lucide-react';
// import { useMessaging } from '../../server/AuthContext';
import { useAuth } from '@/server/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'failed';
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Conversation = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  other_user: User;
  last_message?: Message;
  unread_count: number;
  created_at: string;
};

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  recipientId?: string;
  recipientName?: string;
  productName?: string;
  productImage?: string;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  productId,
  recipientId,
  recipientName = 'Seller',
  productName = 'this item',
  productImage,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  // const { user } = useAuth();
  const { 
    user,
    messaging: { 
      conversations = [], 
      currentConversation, 
      messages = [], 
      loading, 
      error 
    },
    startNewConversation,
    sendMessage: sendMessageApi,
    loadConversation,
    loadConversations,
  } = useAuth();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showConversationList, setShowConversationList] = useState(!productId || !recipientId);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  // Combine server messages with optimistic updates
  const allMessages = useMemo(() => {
    const serverMessages = messages || [];
    return [...serverMessages, ...optimisticMessages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [messages, optimisticMessages]);

  // Handle initial load and conversation selection
  useEffect(() => {
    if (!isOpen) return;
  
    const initializeConversation = async () => {
      if (!isOpen) return;
    
      try {
        if (productId && recipientId) {
          // Ensure we have valid IDs
          if (!productId || !recipientId) {
            throw new Error('Missing required IDs for conversation');
          }
    
          // Find existing conversation
          const existingConversation = (conversations || []).find(
            conv => conv?.product_id === productId && conv?.other_user?.id === recipientId
          );
    
          if (existingConversation?.id) {
            console.log('Loading existing conversation:', existingConversation.id);
            setConversation(existingConversation);
            await loadConversation(existingConversation.id);
          } else {
            console.log('Creating new conversation with:', { productId, recipientId });
            const newConversation = await startNewConversation(productId, recipientId);
            if (newConversation?.id) {
              console.log('New conversation created:', newConversation.id);
              setConversation(newConversation);
              await loadConversation(newConversation.id);
            } else {
              throw new Error('Failed to create new conversation');
            }
          }
          setShowConversationList(false);
        } else {
          console.log('Loading conversation list');
          await loadConversations();
          setShowConversationList(true);
        }
      } catch (err) {
        console.error('Error initializing conversation:', err);
        toast.error(err.message || 'Failed to initialize conversation');
      }
    };
  
    initializeConversation();
  }, [isOpen, productId, recipientId, JSON.stringify(conversations || [])]); // Use JSON.stringify for array comparison

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = message.trim();
    if (!messageContent || !conversation || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      content: messageContent,
      sender_id: user?.id || '',
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    // Optimistically update UI
    setOptimisticMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsSending(true);

    try {
      await sendMessageApi(conversation.id, messageContent);
      // Remove the optimistic message once the real one arrives
      setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
    } catch (err) {
      console.error('Failed to send message:', err);
      // Update message status to failed
      setOptimisticMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      );
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleConversationSelect = async (selectedConversation: Conversation) => {
    try {
      setConversation(selectedConversation);
      await loadConversation(selectedConversation.id);
      setShowConversationList(false);
      // Reset scroll position when changing conversations
      setTimeout(() => scrollToBottom('auto'), 100);
    } catch (err) {
      console.error('Error loading conversation:', err);
      toast.error('Failed to load conversation');
    }
  };

  if (!isOpen) return null;

  // Show loading state
  if (loading && !conversation && !showConversationList) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p>Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mx-4">
          <div className="bg-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              {showConversationList ? (
                <h3 className="text-lg font-semibold text-gray-900">Your Conversations</h3>
              ) : (
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowConversationList(true)}
                    className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={conversation?.other_user?.avatar} alt={conversation?.other_user?.name} />
                      <AvatarFallback>
                        {conversation?.other_user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {conversation?.other_user?.name || recipientName}
                    </h3>
                  </div>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 text-sm border-b">
                {error}
              </div>
            )}

            {showConversationList ? (
              /* Conversation List View */
              <div className="h-[500px] overflow-y-auto">
                {loading && conversations.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start a conversation about an item to see it here</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleConversationSelect(conv)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                          conversation?.id === conv.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage src={conv.other_user.avatar} alt={conv.other_user.name} />
                            <AvatarFallback>
                              {conv.other_user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 truncate">
                                {conv.other_user.name}
                              </h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {conv.last_message && formatDistanceToNow(parseISO(conv.last_message.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{conv.product_name}</p>
                            <div className="flex items-center mt-1">
                              <p className="text-sm text-gray-600 truncate flex-1">
                                {conv.last_message?.content || 'No messages yet'}
                              </p>
                              {conv.unread_count > 0 && (
                                <span className="ml-2 bg-blue-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                  {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Message View */
              <>
                {/* Product Info */}
                <div className="border-b p-4 bg-gray-50">
                  <div className="flex items-center">
                    {conversation?.product_image ? (
                      <img
                        src={conversation.product_image}
                        alt={conversation.product_name}
                        className="h-12 w-12 rounded-md object-cover mr-3"
                      />
                    ) : productImage ? (
                      <img
                        src={productImage}
                        alt={conversation?.product_name || productName}
                        className="h-12 w-12 rounded-md object-cover mr-3"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-xs text-center">No Image</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">You're messaging about:</p>
                      <p className="font-medium text-gray-900">
                        {conversation?.product_name || productName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  ref={messageContainerRef}
                  className="h-[400px] overflow-y-auto p-4 space-y-4"
                >
                  {allMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                      <p className="text-lg font-medium text-gray-700 mb-2">No messages yet</p>
                      <p className="text-sm">Say hello to start the conversation!</p>
                    </div>
                  ) : (
                    allMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] lg:max-w-[65%] px-4 py-2 rounded-2xl ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          } ${msg.status === 'failed' ? 'opacity-75' : ''}`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <span className="text-xs opacity-70">
                              {formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true })}
                            </span>
                            {msg.sender_id === user?.id && (
                              <span className="text-xs opacity-70">
                                {msg.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin inline" />}
                                {msg.status === 'failed' && '❌'}
                                {msg.status === 'sent' && '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="pr-12 min-h-[40px] max-h-32 resize-none"
                        disabled={!conversation || isSending}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !conversation || isSending}
                      className="h-10 w-10 p-0 flex-shrink-0"
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">Send message</span>
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
