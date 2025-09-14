import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import Results from './components/Results';
import ChatBot from './components/ChatBot';
import teachableMachine from './utils/teachableMachine';
import './index.css';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const initializeModels = async () => {
      try {
        setLoadingModels(true);
        const success = await teachableMachine.loadModels();
        if (success) {
          setModelsLoaded(true);
          setModelInfo(teachableMachine.getModelInfo());
          setError(null);
        } else {
          setError('Failed to load AI models. Please refresh the page and try again.');
        }
      } catch (err) {
        setError('Error loading AI models: ' + err.message);
      } finally {
        setLoadingModels(false);
      }
    };

    initializeModels();
  }, []);

  const handleFileUpload = async (imageElement) => {
    if (!imageElement) {
      setResults(null);
      return;
    }

    if (!modelsLoaded) {
      setError('AI models are still loading. Please wait...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const classificationResults = await teachableMachine.classifyImage(imageElement);
      setResults(classificationResults);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Error analyzing image: ' + err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  if (loadingModels) {
    return (
      <div className="container">
        <div className="header">
          <img src="/images/GooseSense.png" alt="GooseSense Logo" className="logo" />
          <h1>GooseSense</h1>
          <p>Loading AI models...</p>
        </div>
        <div className="results-container">
          <div className="loading">
            🤖 Initializing Teachable Machine models...
            <br />
            <small>This may take a moment on first load</small>
            <br />
            <small>Loading models from:</small>
            <br />
            <small>• Emotion: https://teachablemachine.withgoogle.com/models/cXtszqwo0/</small>
            <br />
            <small>• Characteristics: https://teachablemachine.withgoogle.com/models/-P2mBKM75/</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <img src="/images/GooseSense.png" alt="GooseSense Logo" className="logo" />
        <h1>GooseSense</h1>
        <p>AI-powered goose emotion and behavior analysis</p>
        <p>Upload a photo and let AI analyze the goose's emotions and behavior</p>
      </div>

      <div className="main-content">
        <Camera 
          onFileSelect={handleFileUpload}
          isProcessing={isLoading}
        />

        <Results 
          results={results}
          isLoading={isLoading}
          error={error}
          modelInfo={modelInfo}
        />
      </div>

      {!modelsLoaded && (
        <div className="results-container">
          <div className="error">
            ⚠️ AI models failed to load. Please refresh the page and try again.
          </div>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        title="Open Goose Expert Chat"
      >
        💬
      </button>

      {/* Chatbot */}
      <ChatBot 
        classificationResults={results}
        isVisible={showChatbot}
        onToggle={toggleChatbot}
      />
    </div>
  );
}

export default App;
