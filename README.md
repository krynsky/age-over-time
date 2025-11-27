# Decades Through Time

A web application that transforms your photo showing how you would look styled through different decades from the 1880s to 2030s.

## Features

- Upload your photo
- Generate a 4×4 grid showing you styled through 16 decades (1880s-2030s)
- AI-powered image generation using fal.ai's Nano Banana Pro
- Period-accurate styling including:
  - Clothing, fashion, and accessories
  - Hairstyles and grooming
  - Photography styles (sepia, B&W, color)
  - Era-appropriate backgrounds and props
- Download your generated image
- Beautiful, modern web interface

## Platform Support

✅ **Cross-platform compatible** - Works on:
- macOS
- Windows
- Linux

This application uses Pinokio's cross-platform API to ensure compatibility across all major operating systems.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up your fal.ai API key:
   - Create a `.env` file (see `.env.example`)
   - Get your API key from https://fal.ai/dashboard
   - Add to `.env`: `FAL_KEY=your_fal_api_key_here`

3. Run the application:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. Open your browser to:
   ```
   http://localhost:8000/static/index.html
   ```

## Requirements

- Python 3.8+
- fal.ai account (free tier available)
- Valid fal.ai API key

## Configuration

Create a `.env` file with:
```
FAL_KEY=your_fal_api_key_here
```

## Pricing

**fal.ai Nano Banana Pro:**
- 2K resolution: $0.15 per generation
- 4K resolution: $0.30 per generation

The app is configured to use 2K resolution for optimal quality at standard pricing.

## Note

This project is designed to work with Pinokio for easy installation and deployment.

## Security

⚠️ **Never commit** your `.env` file to version control. It contains your API key.
