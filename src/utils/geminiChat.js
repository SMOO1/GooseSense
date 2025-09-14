import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiChatService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.error('REACT_APP_GEMINI_API_KEY environment variable is not set');
      throw new Error('Gemini API key is required. Please set REACT_APP_GEMINI_API_KEY in your environment.');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.chatHistory = [];
  }

  async sendMessage(message, classificationResults = null) {
    try {
      let contextMessage = message;
      
      // If we have classification results, add them to the context
      if (classificationResults) {
        const { emotion, characteristics } = classificationResults;
        
        contextMessage = `You are a goose expert. Keep responses SHORT and CONCISE (2-3 sentences max).

Analysis: ${emotion.class} emotion (${(emotion.confidence * 100).toFixed(0)}%), ${characteristics.class} behavior (${(characteristics.confidence * 100).toFixed(0)}%)

Question: ${message}

Give a brief, helpful answer about geese. Be direct and to the point.`;
      } else {
        contextMessage = `You are a goose expert. Keep responses SHORT and CONCISE (2-3 sentences max). 

Question: ${message}

Give a brief, helpful answer about geese. Be direct and to the point.`;
      }

      const result = await this.model.generateContent(contextMessage);
      const response = await result.response;
      const text = response.text();

      // Add to chat history
      this.chatHistory.push({
        user: message,
        assistant: text,
        timestamp: new Date().toISOString()
      });

      return text;
    } catch (error) {
      console.error('Error with Gemini API:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  getChatHistory() {
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
  }

  async getGooseFacts() {
    const facts = await this.sendMessage('Give me 3 short, interesting facts about geese.');
    return facts;
  }

  async getAnalysisExplanation(classificationResults) {
    if (!classificationResults) return null;
    
    const explanation = await this.sendMessage('Briefly explain what these goose analysis results mean.', classificationResults);
    return explanation;
  }
}

export default new GeminiChatService();
