import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2 } from 'lucide-react';

const CHAT_RESPONSES = {
  greeting: [
    "Hello! Welcome to Aashirwad Fashion! How can I help you today?",
    "Hi there! I'm here to assist you with any questions about our products.",
    "Welcome! Need help finding the perfect outfit? I'm here to help!"
  ],
  products: [
    "We have a wide range of clothing including traditional wear, western outfits, and accessories. What are you looking for?",
    "Our collection includes sarees, kurtas, dresses, jeans, and much more. Any specific category you're interested in?",
    "You can browse our categories: Ladies, Men, Traditional, Jeans, T-shirts, and Shirts. What catches your eye?"
  ],
  orders: [
    "You can track your orders by clicking the package icon in the top navigation. Need help with a specific order?",
    "For order-related queries, please provide your order number and I'll help you track it.",
    "Orders typically ship within 2-3 business days. You'll receive tracking information via email."
  ],
  shipping: [
    "We offer free shipping on orders above ₹999. Standard delivery takes 3-5 business days.",
    "Shipping charges are ₹99 for orders below ₹999. Express delivery available for ₹199.",
    "We deliver pan-India. International shipping is available for select countries."
  ],
  returns: [
    "We have a 30-day return policy. Items should be unused with original tags.",
    "Returns are easy! Just contact us within 30 days and we'll arrange pickup.",
    "Refunds are processed within 5-7 business days after we receive the returned item."
  ],
  sizes: [
    "We have sizes from XS to XXL. Check our size guide for accurate measurements.",
    "Size chart is available on each product page. Need help with specific measurements?",
    "If you're unsure about sizing, I recommend checking our detailed size guide or contacting us."
  ],
  payment: [
    "We accept all major cards, UPI, net banking, and cash on delivery.",
    "Your payment information is secure with 256-bit SSL encryption.",
    "COD is available for orders up to ₹5000. Online payments get 2% extra discount."
  ],
  default: [
    "I understand your concern. Let me connect you with our support team for detailed assistance.",
    "That's a great question! Our team will get back to you with the best solution.",
    "I'm here to help! Could you please provide more details about your query?"
  ]
};

export default function LiveChat({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(CHAT_RESPONSES.greeting[0]);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    
    if (isMinimized) {
      setHasNewMessage(true);
    }
  };

  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return CHAT_RESPONSES.greeting[Math.floor(Math.random() * CHAT_RESPONSES.greeting.length)];
    }
    if (msg.includes('product') || msg.includes('cloth') || msg.includes('dress') || msg.includes('shirt')) {
      return CHAT_RESPONSES.products[Math.floor(Math.random() * CHAT_RESPONSES.products.length)];
    }
    if (msg.includes('order') || msg.includes('track') || msg.includes('delivery')) {
      return CHAT_RESPONSES.orders[Math.floor(Math.random() * CHAT_RESPONSES.orders.length)];
    }
    if (msg.includes('ship') || msg.includes('deliver') || msg.includes('courier')) {
      return CHAT_RESPONSES.shipping[Math.floor(Math.random() * CHAT_RESPONSES.shipping.length)];
    }
    if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
      return CHAT_RESPONSES.returns[Math.floor(Math.random() * CHAT_RESPONSES.returns.length)];
    }
    if (msg.includes('size') || msg.includes('fit') || msg.includes('measurement')) {
      return CHAT_RESPONSES.sizes[Math.floor(Math.random() * CHAT_RESPONSES.sizes.length)];
    }
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('card') || msg.includes('upi')) {
      return CHAT_RESPONSES.payment[Math.floor(Math.random() * CHAT_RESPONSES.payment.length)];
    }
    
    return CHAT_RESPONSES.default[Math.floor(Math.random() * CHAT_RESPONSES.default.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    const userMsg = inputMessage;
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(getResponse(userMsg));
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E50010, #FF4444)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(229, 0, 16, 0.3)',
          zIndex: 1000,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={hasNewMessage ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: hasNewMessage ? Infinity : 0 }}
      >
        <MessageCircle size={24} />
        {hasNewMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#FFD700',
            }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 20,
              width: 350,
              height: isMinimized ? 60 : 500,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #E50010, #FF4444)',
              color: '#fff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                    Support Assistant
                  </h3>
                  <p style={{ fontSize: 11, opacity: 0.9, margin: 0 }}>
                    Online • Typically replies instantly
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={toggleMinimize}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 4,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button
                  onClick={toggleChat}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 4,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div style={{
                  flex: 1,
                  padding: '16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {messages.map(message => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div style={{
                        maxWidth: '80%',
                        padding: '8px 12px',
                        borderRadius: 12,
                        background: message.sender === 'user' ? '#E50010' : '#f0f0f0',
                        color: message.sender === 'user' ? '#fff' : '#333',
                        fontSize: 13,
                        lineHeight: 1.4,
                      }}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: 12,
                        background: '#f0f0f0',
                        display: 'flex',
                        gap: 4,
                      }}>
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: '#999' }}
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: '#999' }}
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          style={{ width: 6, height: 6, borderRadius: '50%', background: '#999' }}
                        />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                  padding: '16px',
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  gap: 8,
                }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 20,
                      padding: '8px 16px',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    style={{
                      background: inputMessage.trim() ? '#E50010' : '#ccc',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Send size={16} color="#fff" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}