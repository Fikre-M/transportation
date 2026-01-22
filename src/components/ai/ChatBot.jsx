import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Box, styled } from '@mui/material';
import { Message, Send, Close, SmartToy } from '@mui/icons-material';
import aiService from '../../services/aiService';

// Styled components for the chat
const ChatContainer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: '100px',
  right: '30px',
  width: '350px',
  maxWidth: '90vw',
  height: '500px',
  maxHeight: '70vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1300, // Higher than most elements
}));

const ChatHeader = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& h3': {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}));

const MessagesContainer = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const MessageBubble = styled('div')(({ isUser, theme }) => ({
  maxWidth: '80%',
  padding: '10px 16px',
  borderRadius: '18px',
  position: 'relative',
  wordBreak: 'break-word',
  fontSize: '0.9rem',
  lineHeight: 1.4,
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    width: '20px',
    height: '20px',
  },
  ...(isUser 
    ? {
        alignSelf: 'flex-end',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderTopRightRadius: '4px',
        '&:after': {
          right: '-10px',
          backgroundColor: theme.palette.primary.main,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
        },
      }
    : {
        alignSelf: 'flex-start',
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.text.primary,
        borderTopLeftRadius: '4px',
        '&:after': {
          left: '-10px',
          backgroundColor: theme.palette.grey[200],
          clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
        },
      }),
}));

const InputContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  padding: '12px',
  borderTop: `1px solid ${theme.palette.divider}`,
  '& input': {
    flex: 1,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '24px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    outline: 'none',
    '&:focus': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}80`,
    },
  },
  '& button': {
    marginLeft: '8px',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
}));

const SuggestionsContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '0 16px 16px',
});

const SuggestionChip = styled('button')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: '16px',
  padding: '6px 12px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    transform: 'translateY(-2px)',
  },
}));

const ChatBot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: ['Book a ride', 'Track driver', 'Get fare estimate', 'Help'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.sendChatMessage(inputValue, {
        userId: 'current_user',
        sessionId: 'chat_session_' + Date.now(),
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        suggestions: response.suggestions,
        confidence: response.confidence,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-4rem)] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-[1000] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
              <p className="text-white/80 text-sm">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.confidence && (
                    <p className="text-xs opacity-70 mt-1">
                      Confidence: {(message.confidence * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
                
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Chat Trigger Button
const ChatTrigger = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop pulsing after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-[999]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
      }}
    >
      <motion.div
        animate={isHovered ? { rotate: [0, -10, 10, -10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <svg 
          className="w-7 h-7" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </motion.div>
      
      {isPulsing && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
    </motion.button>
  );
};

export { ChatTrigger };
export default ChatBot;