# EcoLearn - Gamified Climate Education Platform

## 🌍 About EcoLearn

EcoLearn is an interactive, gamified climate education platform designed to make learning about environmental science engaging and fun. Through interactive lessons, games, and achievements, users can master climate science while earning points and badges.

## ✨ Features

### 📚 Interactive Learning
- **Structured Learning Paths**: Progress through 4 comprehensive categories
- **20+ Lessons**: From climate basics to advanced ecosystem protection
- **Progressive Difficulty**: Easy to advanced lessons with proper prerequisites
- **XP & Leveling System**: Earn experience points and level up as you learn

### 🎮 Educational Games
- **Climate Quiz Challenge**: Test your knowledge with timed questions
- **Climate Action Simulator**: Lead global climate policy decisions
- **Carbon Footprint Calculator**: Calculate and reduce your environmental impact
- **Eco Match Challenge**: Drag-and-drop environmental categorization game
- **Green Sweep**: Fast-paced park cleanup and waste sorting arcade game

### 🏆 Gamification Elements
- **Achievement System**: Unlock badges for learning milestones
- **Streak Tracking**: Maintain daily learning streaks
- **Leaderboards**: Compete with other climate learners
- **Progress Analytics**: Track your learning journey

### 🤖 AI Assistant
- **EcoBot**: Interactive climate learning chatbot
- **Instant Help**: Get answers to climate science questions
- **Educational Support**: Contextual learning assistance

### 🌟 Additional Features
- **Weather Integration**: Real-time weather data with climate connections
- **Responsive Design**: Works perfectly on desktop and mobile
- **Custom Cursor**: Beautiful eco-themed cursor animations
- **Parallax Effects**: Engaging visual design elements

## 🎯 Learning Categories

### 1. Climate Basics (Beginner)
- What is Climate Change?
- The Greenhouse Effect
- Carbon Footprint Basics
- Global Temperature Trends
- Ice Caps and Sea Levels

### 2. Renewable Energy (Intermediate)
- Solar Power Fundamentals
- Wind Energy Systems
- Hydroelectric Power
- Geothermal Energy
- Energy Storage Solutions

### 3. Waste Management (Intermediate)
- The 3 R's: Reduce, Reuse, Recycle
- Composting at Home
- Plastic Pollution Solutions
- Circular Economy Principles
- Zero Waste Lifestyle

### 4. Ecosystem Protection (Advanced)
- Biodiversity Basics
- Forest Conservation
- Ocean Protection
- Wildlife Corridors
- Sustainable Agriculture

## 🎮 Games Overview

### Climate Quiz Challenge
- Multiple choice questions with instant feedback
- Streak bonuses for consecutive correct answers
- Two modes: Quick Quiz (5 questions) and Challenge Mode (8 questions)
- Difficulty-based scoring system

### Climate Action Simulator
- Strategic decision-making game
- Manage global climate policies
- Balance budget, environment, and population happiness
- Real-time consequences for your actions

### Carbon Footprint Calculator
- Personal environmental impact assessment
- Categories: Transportation, Energy, Food, Air Travel
- Personalized reduction recommendations
- Compare with global averages

### Eco Match Challenge
- Drag-and-drop categorization game
- Sort items into environmental categories
- Progressive difficulty levels
- Educational item descriptions

### Green Sweep
- Fast-paced arcade-style cleanup game
- Sort waste into correct bins (wet, dry, recyclable)
- Power-ups and obstacles
- Educational facts between rounds

## 🏗️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase credentials to .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **user_profiles**: User information and progress tracking
- **lesson_categories**: Learning path categories
- **lessons**: Individual lesson content
- **user_lesson_progress**: User completion tracking
- **achievements**: Available achievements
- **user_achievements**: User-earned achievements
- **daily_activity**: Daily learning activity tracking
- **quiz_attempts**: Quiz performance records

## 🎨 Design System

EcoLearn uses a nature-inspired design system with:

- **Primary Colors**: Green and emerald tones
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Animations**: Subtle micro-interactions and parallax effects
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── chatbot/        # AI chatbot components
│   └── layout/         # Layout components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Route components
└── index.css          # Global styles and design system
```

## 🌱 Environmental Impact

EcoLearn is designed to educate users about:

- **Climate Science**: Understanding global warming and greenhouse gases
- **Renewable Energy**: Solar, wind, hydro, and geothermal power
- **Waste Management**: Proper sorting, recycling, and waste reduction
- **Ecosystem Protection**: Biodiversity conservation and habitat preservation
- **Personal Action**: Individual steps to reduce environmental impact

## 🤝 Contributing

We welcome contributions to make climate education more accessible and engaging!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📱 Deployment

The application is deployed on Bolt Hosting with automatic deployments from the main branch.

To deploy your own instance:
1. Connect your repository to Bolt Hosting
2. Configure environment variables
3. Deploy with automatic build process

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Climate data and educational content sourced from reputable scientific organizations
- Weather data integration for real-world connections
- Gamification principles to enhance learning engagement
- Accessibility features for inclusive education

---

**Start your climate learning journey today and help save our planet! 🌍💚**