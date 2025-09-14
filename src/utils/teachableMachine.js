import * as tmImage from '@teachablemachine/image';

class TeachableMachineService {
  constructor() {
    this.emotionModel = null;
    this.characteristicsModel = null;
    this.isLoading = false;
    this.emotionMaxPredictions = 0;
    this.characteristicsMaxPredictions = 0;
  }

  async loadModels() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // Load emotion model (angry/normal)
      console.log('Loading emotion model...');
      const emotionModelURL = 'https://teachablemachine.withgoogle.com/models/cXtszqwo0/model.json';
      const emotionMetadataURL = 'https://teachablemachine.withgoogle.com/models/cXtszqwo0/metadata.json';
      
      this.emotionModel = await tmImage.load(emotionModelURL, emotionMetadataURL);
      this.emotionMaxPredictions = this.emotionModel.getTotalClasses();
      console.log('Emotion model loaded. Classes:', this.emotionMaxPredictions);
      
      // Load characteristics model
      console.log('Loading characteristics model...');
      const characteristicsModelURL = 'https://teachablemachine.withgoogle.com/models/-P2mBKM75/model.json';
      const characteristicsMetadataURL = 'https://teachablemachine.withgoogle.com/models/-P2mBKM75/metadata.json';
      
      this.characteristicsModel = await tmImage.load(characteristicsModelURL, characteristicsMetadataURL);
      this.characteristicsMaxPredictions = this.characteristicsModel.getTotalClasses();
      console.log('Characteristics model loaded. Classes:', this.characteristicsMaxPredictions);
      
      console.log('Both models loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading models:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async classifyImage(imageElement) {
    if (!this.emotionModel || !this.characteristicsModel) {
      throw new Error('Models not loaded. Please wait for models to load.');
    }

    try {
      // Run emotion classification
      console.log('Running emotion classification...');
      const emotionPrediction = await this.emotionModel.predict(imageElement);
      
      // Sort predictions by confidence (highest first)
      const sortedEmotionPredictions = Array.from(emotionPrediction)
        .sort((a, b) => b.probability - a.probability);
      
      // Get the top prediction
      const emotionResult = {
        class: sortedEmotionPredictions[0].className,
        confidence: sortedEmotionPredictions[0].probability
      };

      // Run characteristics classification
      console.log('Running characteristics classification...');
      const characteristicsPrediction = await this.characteristicsModel.predict(imageElement);
      
      // Sort predictions by confidence (highest first)
      const sortedCharacteristicsPredictions = Array.from(characteristicsPrediction)
        .sort((a, b) => b.probability - a.probability);
      
      // Get the top prediction
      const characteristicsResult = {
        class: sortedCharacteristicsPredictions[0].className,
        confidence: sortedCharacteristicsPredictions[0].probability
      };

      console.log('Classification results:', {
        emotion: emotionResult,
        characteristics: characteristicsResult,
        allEmotionPredictions: sortedEmotionPredictions,
        allCharacteristicsPredictions: sortedCharacteristicsPredictions
      });

      return {
        emotion: emotionResult,
        characteristics: characteristicsResult,
        allEmotionPredictions: sortedEmotionPredictions,
        allCharacteristicsPredictions: sortedCharacteristicsPredictions
      };
    } catch (error) {
      console.error('Error during classification:', error);
      throw error;
    }
  }

  isModelLoaded() {
    return this.emotionModel !== null && this.characteristicsModel !== null;
  }

  getModelInfo() {
    return {
      emotionClasses: this.emotionMaxPredictions,
      characteristicsClasses: this.characteristicsMaxPredictions,
      emotionModel: this.emotionModel,
      characteristicsModel: this.characteristicsModel
    };
  }
}

export default new TeachableMachineService();
