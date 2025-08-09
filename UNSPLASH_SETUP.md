# Unsplash API Setup Guide

## 🖼️ Getting Your Unsplash API Key

### Step 1: Create an Unsplash Developer Account
1. Go to [https://unsplash.com/developers](https://unsplash.com/developers)
2. Click "Register as a developer"
3. Sign up with your email or GitHub account

### Step 2: Create a New Application
1. After logging in, click "New Application"
2. Fill in the application details:
   - **Application name**: `Pantry Genie`
   - **Description**: `AI-powered recipe app that generates recipes from ingredients`
   - **What are you building?**: `A web application that helps users create recipes from available ingredients`
   - **Will your app be used in a commercial context?**: Choose based on your needs
   - **Will your app be used in a production environment?**: Yes (if deploying)

### Step 3: Get Your Access Key
1. After creating the application, you'll see your **Access Key**
2. Copy this key - it looks like: `abc123def456ghi789...`

### Step 4: Add to Environment Variables
Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### Step 5: Test the Integration
1. Restart your development server
2. Generate a new recipe
3. Check the console for Unsplash search logs
4. The recipe should now have a beautiful food image!

## 🎯 How It Works

- **Smart Search**: The app searches Unsplash using the recipe title and key ingredients
- **High-Quality Images**: Gets professional food photography
- **Fallback System**: If Unsplash fails, uses curated fallback images
- **Free Usage**: Unsplash provides 5,000 requests per hour for free

## 🔧 Benefits of This Approach

✅ **Free and Reliable**: No cost for reasonable usage  
✅ **High Quality**: Professional food photography  
✅ **Fast**: Direct image URLs, no base64 encoding  
✅ **Smart**: Contextual image selection based on recipe content  
✅ **Fallback**: Always shows an image, even if API fails  

## 🚀 Alternative: No API Key Required

If you don't want to set up an Unsplash account, the app will automatically use beautiful fallback images that are:
- Curated for different food types
- High quality and appetizing
- Automatically selected based on recipe content
- Always available

The fallback system ensures your app always has beautiful food images!
