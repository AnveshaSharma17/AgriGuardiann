<div align="center">

# 🌱 KrishiRakshak

### AI-Powered Smart Pest Management for Indian Farmers

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

*Empowering farmers with AI-driven pest identification, weather-based alerts, and community support*

[Live Demo](https://krishirakshak.vercel.app) • [Report Bug](https://github.com/AnveshaSharma17/AgriGuardiann/issues) • [Request Feature](https://github.com/AnveshaSharma17/AgriGuardiann/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🌾 About the Project

**KrishiRakshak** (कृषि रक्षक - Crop Protector) is an intelligent pest management system designed specifically for Indian farmers. It combines AI-powered pest identification, real-time weather-based alerts, and a supportive community platform to help farmers protect their crops effectively.

### 🎯 Problem Statement

Indian farmers lose approximately **15-25% of their crop yield** annually due to pest attacks. Traditional pest identification methods are:
- Time-consuming and often inaccurate
- Dependent on expensive agricultural experts
- Unable to provide preventive measures

### 💡 Our Solution

KrishiRakshak provides:
- **Instant AI-powered pest identification** from crop images
- **Weather-based pest outbreak predictions**
- **Comprehensive pest database** with 50+ pests across 10 major crops
- **Multilingual support** (English & Hindi)
- **Community-driven knowledge sharing**

---

## ✨ Features

### 🔍 AI Pest Identification
- Upload crop images for instant pest detection
- Get detailed information about identified pests
- Receive AI-generated treatment recommendations

### 🌤️ Smart Weather Alerts
- Real-time weather data integration
- Pest outbreak risk predictions based on weather conditions
- Location-based personalized alerts

### 📚 Comprehensive Pest Database
- 50+ pests covering 10 major Indian crops
- Detailed pest lifecycle, symptoms, and damage information
- Available in English and Hindi

### 💬 AI Chatbot Assistant
- 24/7 farming advice powered by Google Gemini AI
- Context-aware responses based on user's crops and location
- Conversation history for reference

### 👥 Farmer Community
- Share experiences and ask questions
- Upvote helpful answers
- Connect with farmers across India

### 📊 Spray Log Tracker
- Track pesticide usage
- Maintain application history
- Get reminders for re-application

### 🌐 Bilingual Support
- Full English and Hindi translations
- Easy language switching
- Culturally appropriate content

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| shadcn/ui | Component Library |
| React Router v6 | Navigation |
| i18next | Internationalization |
| React Query | Data Fetching |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | API Framework |
| MongoDB Atlas | Database |
| JWT | Authentication |
| Google Gemini AI | AI Services |
| OpenWeatherMap | Weather Data |
| Cloudinary | Image Storage |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Google AI Studio API key
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnveshaSharma17/AgriGuardiann.git
   cd AgriGuardiann
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables** (see [Environment Variables](#-environment-variables))

5. **Seed the database**
   ```bash
   cd server
   node scripts/seedPestDatabase.js
   ```

6. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

7. **Open** http://localhost:8080 in your browser

---

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (`server/.env`)
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/krishirakshak

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Weather
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key

# Image Upload (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📖 API Documentation

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user |

### Pests
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pests` | GET | Get all pests |
| `/api/pests/:id` | GET | Get pest by ID |

### Crops
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/crops` | GET | Get all crops |
| `/api/user/crops` | GET | Get user's crops |
| `/api/user/crops` | POST | Add crop to user |

### AI Services
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Chat with AI assistant |
| `/api/ai/identify-image` | POST | Identify pest from image |

### Alerts
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts/ai-alerts` | GET | Get AI-generated alerts |

---

## 📁 Project Structure

```
AgriGuardiann/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and configs
│   │   ├── api.ts         # API client
│   │   └── i18n.ts        # Translations
│   └── pages/             # Page components
│       ├── Dashboard.tsx
│       ├── Identify.tsx
│       ├── Alerts.tsx
│       ├── Community.tsx
│       └── ...
├── server/
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   └── scripts/          # Utility scripts
├── index.html
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Team

<div align="center">

| <img src="https://github.com/AnveshaSharma17.png" width="100" style="border-radius: 50%"> | <img src="https://github.com/harshchauhan.png" width="100" style="border-radius: 50%"> | <img src="https://github.com/vaishnavishukla.png" width="100" style="border-radius: 50%"> |
|:---:|:---:|:---:|
| **Anvesha Sharma** | **Harsh Chauhan** | **Vaishnavi Shukla** |
| Frontend Developer | Backend Developer | UI/UX Designer |

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Indian farming community for inspiration and feedback

---

<div align="center">

**Made with ❤️ for Indian Farmers**

🌱 *Protecting crops, empowering farmers* 🌾

</div>
