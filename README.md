# Age Over Time

A web application that uses AI to show how a person might look at different ages.

## Features

- Upload a photo
- Generate age-progressed images using Google's Vertex AI
- View results in an interactive web interface

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up credentials:
   - Create a `.env` file with your configuration (see `.env.example`)
   - Add your Google Cloud service account key as `service-account-key.json`

3. Run the application:
   ```bash
   python main.py
   ```

## Requirements

- Python 3.8+
- Google Cloud account with Vertex AI enabled
- Valid service account credentials

## Configuration

Create a `.env` file with the following variables:
```
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
```

## Note

This project is designed to work with Pinokio for easy installation and deployment.

## Security

⚠️ **Never commit** your `.env` file or `service-account-key.json` to version control. These files contain sensitive credentials.
