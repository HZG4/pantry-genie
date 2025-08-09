# 🤖 AI Setup Guide for Pantry Genie

## Free AI Options for Recipe Generation

### Option 1: Hugging Face Inference API (Recommended - 30,000 free requests/month)

1. **Sign up for Hugging Face**:
   - Go to https://huggingface.co/
   - Click "Sign Up" and create a free account

2. **Get your API key**:
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Give it a name like "Pantry Genie"
   - Select "Read" role
   - Copy the generated token

3. **Add to your environment**:
   - Add this line to your `.env.local` file:
   ```
   NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_token_here
   ```

### Option 2: Google Gemini (15 requests/minute free)

1. **Get Google AI Studio API key**:
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add to your environment**:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBaTKkJKykhJ0cKzHrv4Lut0TcwfpgAsdA
   ```

### Option 3: Ollama (Completely Free - Local)

1. **Install Ollama**:
   - Go to https://ollama.ai/
   - Download and install for your OS

2. **Run a model locally**:
   ```bash
   ollama run llama2
   ```

3. **Update the AI service** to use local Ollama API

## Current Implementation

The app currently uses **Hugging Face Inference API** with fallback templates. If you don't add an API key, it will use the template-based recipe generation.

## Testing

1. **With API key**: Real AI-generated recipes
2. **Without API key**: Template-based recipes (still functional)

## Next Steps

Once you have an API key:
1. Add it to `.env.local`
2. Restart your development server
3. Test recipe generation on the `/generate` page

The AI will create unique recipes based on your ingredients! 🎯
