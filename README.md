# 🦆 GooseSense - AI Goose Classifier

A web application that uses Teachable Machine models to classify goose emotions and characteristics from photos.

## Features

- �� **Camera Integration**: Take photos directly using your device's camera
- 📁 **File Upload**: Upload existing images from your device
- 🤖 **AI Classification**: Uses two Teachable Machine models:
  - **Emotion Model**: Classifies geese as angry or normal
  - **Characteristics Model**: Identifies behavior patterns (aggressive, calm, alert, etc.)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Models Used

- **Emotion Classification**: [https://teachablemachine.withgoogle.com/models/cXtszqwo0/](https://teachablemachine.withgoogle.com/models/cXtszqwo0/)
- **Characteristics Classification**: [https://teachablemachine.withgoogle.com/models/-P2mBKM75/](https://teachablemachine.withgoogle.com/models/-P2mBKM75/)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- A modern web browser (Chrome, Safari, Firefox)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd GooseSense
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Google Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```
   Get your API key from: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

5. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build` directory.

## How to Use

1. **Load the App**: Open the application in your browser
2. **Wait for Models**: The AI models will load automatically (this may take a moment on first use)
3. **Take a Photo**: 
   - Click "Start Camera" to use your device's camera
   - Or click "Upload Image" to select a file from your device
4. **Capture**: If using camera, click "Capture Photo" when ready
5. **View Results**: The app will analyze the image and show:
   - Goose emotion (angry/normal) with confidence percentage
   - Behavior characteristics with confidence percentage

## Technical Details

- **Framework**: React 18
- **AI Library**: TensorFlow.js
- **Models**: Teachable Machine (Google)
- **Styling**: CSS3 with modern gradients and animations
- **Camera API**: MediaDevices.getUserMedia()

## Browser Compatibility

- Chrome (recommended)
- Safari
- Firefox
- Edge

**Note**: Camera functionality requires HTTPS in production environments.

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions
- Try refreshing the page
- Check if your browser supports camera access

### Models Not Loading
- Check your internet connection
- Ensure the Teachable Machine model URLs are accessible
- Try refreshing the page

### Poor Classification Results
- Ensure the image clearly shows a goose
- Try different angles or lighting
- Make sure the goose is the main subject of the photo

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!
