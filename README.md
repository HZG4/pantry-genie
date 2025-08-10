# 🧞‍♂️ Pantry Genie

An AI-powered recipe generator that transforms your available ingredients into delicious, personalized recipes. Built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- **AI Recipe Generation**: Input your available ingredients and get complete recipes with instructions, ingredients, and cooking times
- **Dietary Preferences**: Filter recipes by dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- **Cuisine Selection**: Choose your preferred cuisine style
- **Recipe Library**: Save and organize your favorite recipes
- **Responsive Design**: Beautiful, mobile-first interface
- **Mock AI Service**: Currently uses mock data, ready for real AI integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pantry-genie
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🎯 Core Components

### Recipe Generator
- Dynamic ingredient input with add/remove functionality
- Dietary preference selection
- Cuisine and serving size options
- Real-time form validation

### Recipe Card
- Beautiful recipe display with all details
- Ingredient lists with quantities
- Step-by-step instructions
- Cooking time and difficulty indicators
- Save and edit functionality

### AI Service
- Mock AI service that generates realistic recipes
- Supports different ingredient combinations
- Adjusts recipes based on preferences
- Ready for real AI API integration

## 🔧 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Form Handling**: React Hook Form (ready to integrate)
- **Validation**: Zod (ready to integrate)
- **Database**: Supabase (ready to integrate)
- **AI Integration**: Mock service (ready for OpenAI/Gemini)

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] Recipe generation form
- [x] Mock AI service
- [x] Recipe display
- [x] Basic navigation
- [x] Recipe library page

### Phase 2: Authentication & Database
- [ ] Supabase integration
- [ ] User authentication
- [ ] Recipe saving functionality
- [ ] User profile management

### Phase 3: Real AI Integration
- [ ] OpenAI/Gemini API integration
- [ ] Advanced recipe generation
- [ ] Recipe variations
- [ ] Nutritional information

### Phase 4: Enhanced Features
- [ ] Recipe sharing
- [ ] Meal planning
- [ ] Shopping list generation
- [ ] Recipe ratings and reviews
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and Tailwind CSS
- Inspired by the need to reduce food waste and make cooking more accessible
- Ready for real AI integration with OpenAI, Gemini, or other providers
