# Nano Banana Pro Setup Guide

## ✅ Implementation Complete!

The app has been updated to use **fal.ai's Nano Banana Pro** (Gemini 3 Pro Image) with reference image support.

## Features

- **4×4 Grid Generation**: Creates a single image showing you through 16 decades (1880s-2030s)
- **Reference Image Support**: Uses your uploaded photo for personalization
- **High Quality**: 2K resolution output ($0.15 per generation)
- **Download Button**: Save your generated images

## Setup Steps

### 1. Get fal.ai API Key

1. Visit **https://fal.ai/dashboard**
2. **Sign up** or **log in**
3. Click on **"API Keys"** in the sidebar
4. Click **"Create API Key"**
5. **Copy the key** (starts with `fal_...`)

### 2. Configure Environment

Create or update `.env` file in the project root:

```
FAL_KEY=your_fal_api_key_here
```

Replace `your_fal_api_key_here` with your actual API key.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. Use the App

1. Open **http://localhost:8000/static/index.html**
2. **Upload your photo**
3. Wait ~10-20 seconds for generation
4. The result shows **your face** styled through all 16 decades in a 4×4 grid!
5. Click **Download Image** to save

## Technical Details

- **Model**: `fal-ai/nano-banana-pro/edit` (image-to-image endpoint)
- **Resolution**: 2K (2048×2048)
- **Cost**: $0.15 per generation
- **Processing Time**: 10-20 seconds

## Pricing

| Usage | Cost |
|-------|------|
| 1 generation | $0.15 |
| 10 generations | $1.50 |
| 50 generations | $7.50 |
| 100 generations | $15.00 |

fal.ai offers a **free tier** with limited credits to get started.

## Troubleshooting

### "Missing FAL_KEY" error
- Make sure you added `FAL_KEY` to your `.env` file
- Restart the server after adding it

### "Authentication failed"
- Check that your API key is correct
- Make sure there are no extra spaces or quotes around the key in `.env`

### Image generation takes too long
- Nano Banana Pro can take 10-20 seconds
- Check your fal.ai account for rate limits or quota issues

### Generated image doesn't match my photo
- The model should preserve your facial features across all decades
- Try uploading a clear, well-lit photo of your face
- Check `debug.log` for any errors

## Debug Log

Check `debug.log` for detailed information about each generation attempt.
