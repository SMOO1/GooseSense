import React from 'react';

const Results = ({ results, isLoading, error, modelInfo }) => {
  if (isLoading) {
    return (
      <div className="results-section">
        <div className="results-container">
          <h2 className="results-title">🦆 Analysis Results</h2>
          <div className="results-content">
            <div className="loading">
              🦆 Analyzing goose behavior...
            </div>
          </div>
        </div>
        <div className="analysis-summary-container">
          <h2 className="analysis-summary-title">📊 Summary</h2>
          <div className="analysis-summary-content">
            <div className="loading">
              Processing...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-section">
        <div className="results-container">
          <h2 className="results-title">🦆 Analysis Results</h2>
          <div className="results-content">
            <div className="error">
              ❌ Error: {error}
            </div>
          </div>
        </div>
        <div className="analysis-summary-container">
          <h2 className="analysis-summary-title">📊 Summary</h2>
          <div className="analysis-summary-content">
            <div className="error">
              Analysis failed
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-section">
        <div className="results-container">
          <h2 className="results-title">🦆 Analysis Results</h2>
          <div className="results-content">
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px 20px',
              fontSize: '1rem'
            }}>
              Upload a photo to see analysis results
            </div>
          </div>
        </div>
        <div className="analysis-summary-container">
          <h2 className="analysis-summary-title">📊 Summary</h2>
          <div className="analysis-summary-content">
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px 20px',
              fontSize: '1rem'
            }}>
              No analysis available
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { emotion, characteristics, allEmotionPredictions, allCharacteristicsPredictions } = results;

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      'angry': '😡',
      'normal': '😌',
      'aggressive': '⚔️',
      'calm': '😌',
      'happy': '😊',
      'sad': '😢',
      'alert': '👀',
      'relaxed': '😌'
    };
    return emojiMap[emotion?.toLowerCase()] || '🦆';
  };

  const getCharacteristicsEmoji = (characteristic) => {
    const emojiMap = {
      'aggressive': '⚔️',
      'calm': '😌',
      'alert': '👀',
      'sleepy': '😴',
      'feeding': '🍞',
      'swimming': '🏊',
      'flying': '✈️',
      'standing': '🦵',
      'sitting': '🪑',
      'walking': '🚶',
      'preening': '🪶',
      'vocalizing': '🗣️'
    };
    return emojiMap[characteristic?.toLowerCase()] || '🦆';
  };

  const renderPredictionList = (predictions, title, emojiFunction) => {
    if (!predictions || predictions.length === 0) return null;

    return (
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ marginBottom: '10px', color: '#e2d4a7', fontSize: '1rem' }}>{title}</h4>
        {predictions.map((prediction, index) => (
          <div 
            key={index}
            className="result-item"
            style={{ 
              opacity: index === 0 ? 1 : 0.7,
              borderLeftColor: index === 0 ? '#e2d4a7' : '#666'
            }}
          >
            <span className="result-label">
              {emojiFunction(prediction.className)} {prediction.className}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="results-section">
      <div className="results-container">
        <h2 className="results-title">🦆 Analysis Results</h2>
        
        <div className="results-content">
          {/* Main Results */}
          <div className="result-item" style={{ background: '#2a2a2a', borderLeftColor: '#e2d4a7' }}>
            <span className="result-label">
              {getEmotionEmoji(emotion?.class)} Primary Emotion:
            </span>
            <span className="result-value">
              {emotion?.class}
            </span>
          </div>

          <div className="result-item" style={{ background: '#2a2a2a', borderLeftColor: '#e2d4a7' }}>
            <span className="result-label">
              {getCharacteristicsEmoji(characteristics?.class)} Primary Behavior:
            </span>
            <span className="result-value">
              {characteristics?.class}
            </span>
          </div>

          {/* Detailed Predictions */}
          {allEmotionPredictions && allEmotionPredictions.length > 1 && 
            renderPredictionList(allEmotionPredictions, "All Emotion Predictions:", getEmotionEmoji)
          }

          {allCharacteristicsPredictions && allCharacteristicsPredictions.length > 1 && 
            renderPredictionList(allCharacteristicsPredictions, "All Behavior Predictions:", getCharacteristicsEmoji)
          }
        </div>
      </div>

      <div className="analysis-summary-container">
        <h2 className="analysis-summary-title">📊 Summary</h2>
        <div className="analysis-summary-content">
          <div className="success">
            <strong>Analysis Complete!</strong><br />
            The goose appears to be <strong>{emotion?.class}</strong> and is showing <strong>{characteristics?.class}</strong> behavior.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
