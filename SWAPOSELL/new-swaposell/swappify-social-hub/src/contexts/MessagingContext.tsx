// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { 
//   startConversation, 
//   sendMessage as sendMessageApi, 
//   getConversationMessages as getConversationMessagesApi,
//   getUserConversations as getUserConversationsApi
// } from '../server/api';
// import { useAuth } from '../server/AuthContext';

// type Message = {
//   id: string;
//   content: string;
//   sender_id: string;
//   created_at: string;
// };

// type Conversation = {
//   id: string;
//   product_id: string;
//   product_name: string;
//   product_image: string;
//   other_user: {
//     id: string;
//     name: string;
//     avatar: string;
//   };
//   last_message?: Message;
//   unread_count: number;
//   created_at: string;
// };

// type MessagingContextType = {
//   conversations: Conversation[];
//   currentConversation: Conversation | null;
//   messages: Message[];
//   loading: boolean;
//   error: string | null;
//   startNewConversation: (productId: string, recipientId: string) => Promise<Conversation>;
//   sendMessage: (conversationId: string, content: string) => Promise<void>;
//   loadConversation: (conversationId: string) => Promise<void>;
//   loadConversations: () => Promise<void>;
// };

// const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// export const MessagingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();

//   const loadConversations = async () => {
//     try {
//       setLoading(true);
//       const data = await getUserConversationsApi();
//       setConversations(data);
//     } catch (err) {
//       setError('Failed to load conversations');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadConversation = async (conversationId: string) => {
//     try {
//       setLoading(true);
//       const messages = await getConversationMessagesApi(conversationId);
//       setMessages(messages);
      
//       // Update current conversation
//       const conversation = conversations.find(c => c.id === conversationId);
//       if (conversation) {
//         setCurrentConversation(conversation);
//       }
//     } catch (err) {
//       setError('Failed to load conversation');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startNewConversation = async (productId: string, recipientId: string): Promise<Conversation> => {
//     try {
//       setLoading(true);
//       const newConversation = await startConversation(productId, recipientId);
//       await loadConversations();
//       return newConversation;
//     } catch (err) {
//       setError('Failed to start conversation');
//       console.error(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (conversationId: string, content: string) => {
//     try {
//       const newMessage = await sendMessageApi(conversationId, content);
//       setMessages(prev => [...prev, newMessage]);
      
//       // Update last message in conversations list
//       setConversations(prev => 
//         prev.map(conv => 
//           conv.id === conversationId 
//             ? { ...conv, last_message: newMessage }
//             : conv
//         )
//       );
//     } catch (err) {
//       setError('Failed to send message');
//       console.error(err);
//       throw err;
//     }
//   };

//   // Load conversations on mount
//   useEffect(() => {
//     if (user) {
//       loadConversations();
//     }
//   }, [user]);

//   return (
//     <MessagingContext.Provider
//       value={{
//         conversations,
//         currentConversation,
//         messages,
//         loading,
//         error,
//         startNewConversation,
//         sendMessage,
//         loadConversation,
//         loadConversations,
//       }}
//     >
//       {children}
//     </MessagingContext.Provider>
//   );
// };

// export const useMessaging = (): MessagingContextType => {
//   const context = useContext(MessagingContext);
//   if (context === undefined) {
//     throw new Error('useMessaging must be used within a MessagingProvider');
//   }
//   return context;
// };
