import React, { useState, useEffect, useRef } from 'react';
import geminiChat from '../utils/geminiChat';

const ChatBot = ({ classificationResults, isVisible, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownAnalysis, setHasShownAnalysis] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial goose facts when component mounts
    if (isVisible && messages.length === 0) {
      loadInitialFacts();
    }
  }, [isVisible]);

  // Show analysis explanation when new results come in
  useEffect(() => {
    if (classificationResults && !hasShownAnalysis && isVisible) {
      showAnalysisExplanation();
    }
  }, [classificationResults, isVisible]);

  const loadInitialFacts = async () => {
    setIsLoading(true);
    try {
      const facts = await geminiChat.getGooseFacts();
      setMessages([{
        id: Date.now(),
        type: 'assistant',
        content: facts,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error loading initial facts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showAnalysisExplanation = async () => {
    if (!classificationResults) return;
    
    setIsLoading(true);
    setHasShownAnalysis(true);
    
    try {
      const explanation = await geminiChat.getAnalysisExplanation(classificationResults);
      const analysisMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `🔍 **Analysis Results:**\n\n${explanation}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error getting analysis explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiChat.sendMessage(inputMessage, classificationResults);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHasShownAnalysis(false);
    geminiChat.clearChatHistory();
  };

  const resetAnalysis = () => {
    setHasShownAnalysis(false);
    if (classificationResults) {
      showAnalysisExplanation();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>🦆 Goose Expert</h3>
        <div className="chatbot-controls">
          {classificationResults && (
            <button onClick={resetAnalysis} className="analysis-button" title="Re-explain analysis">
              🔍
            </button>
          )}
          <button onClick={clearChat} className="clear-button" title="Clear chat">
            🗑️
          </button>
          <button onClick={onToggle} className="close-button" title="Close chat">
            ✕
          </button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <strong key={index}>{line.slice(2, -2)}</strong>;
                }
                return <p key={index}>{line}</p>;
              })}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about geese..."
          disabled={isLoading}
          rows="2"
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
