# Healthcare Assessment Platform

A comprehensive healthcare assessment platform with AI-powered disease detection, medical record management, and intelligent chat assistance.

## 🏥 Project Overview

This platform combines modern web technologies with machine learning to provide:
- **Patient Health Assessment Forms** - Capture vital signs and symptoms
- **AI Disease Detection** - Image-based analysis for throat and eye conditions
- **Medical Records Management** - Secure storage and retrieval of health data
- **Mental Health Support** - Mood-adaptive AI chatbot that provides empathetic emotional support using Mistral API
- **Authentication System** - Secure JWT-based user authentication

## 🏗️ Architecture

```
hackathonDataSet/
├── backend/                 # Node.js/Express API Server
├── frontend/                # React + Vite + Tailwind UI
├── model-backend/
│   ├── nirvik/             # Throat Disease AI Model (FastAPI)
│   └── soumya/             # Eye Disease AI Model (FastAPI)
└── uploads/                # Uploaded medical images
```

## 🚀 Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **AI Integration**: Axios (for AI model communication)
- **Mental Health AI**: Mistral API with mood-adaptive personality

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

### AI Models
- **Framework**: FastAPI + TensorFlow Lite
- **Image Processing**: OpenCV
- **Models**: 
  - Throat Disease CNN (TFLite)
  - Eye Disease EfficientNet

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.10+
- MongoDB Atlas account
- Mistral API key

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Rakshi2609/hackathonDataSet.git
cd hackathonDataSet
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
# JWT_SECRET=your_jwt_secret
# MISTRAL_API_KEY=your_mistral_api_key

npm start
```
Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4. AI Model Backend Setup (Throat Disease)
```bash
cd model-backend/nirvik
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
Throat AI Model runs on: `http://127.0.0.1:8000`

### 5. AI Model Backend Setup (Eye Disease)
```bash
cd model-backend/soumya
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8001 --reload
```
Eye AI Model runs on: `http://127.0.0.1:8001`

## 🔑 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_secret_key_here
MISTRAL_API_KEY=your_mistral_api_key
```

## 📁 Project Structure

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Health Forms
- `POST /api/forms` - Create health assessment form (with image upload)
- `GET /api/forms` - Get all forms for logged-in user
- `GET /api/forms/:id` - Get specific form by ID

#### Chat
- `POST /api/chat` - Send message to mental health support AI (mood-adaptive)
- `POST /api/chat/form/:formId` - Chat about specific form
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/clear` - Clear chat history

### Frontend Routes
- `/` - Home page
- `/register` - User registration
- `/login` - User login
- `/dashboard` - User dashboard (protected)
- `/create-form` - Create health assessment form (protected)
- `/forms` - View all forms (protected)
- `/form/:id` - View specific form details (protected)
- `/chat` - Mental Health Support chat (protected)
- `/chat/form/:id` - Form-specific AI chat (protected)

## 🎨 Key Features

### 1. Multi-Step Health Form
- **Step 1**: Vital signs (Heart Rate, SpO2, Temperature, Blood Pressure) OR Photo upload
- **Step 2**: Problem area selection (Throat, Eye, Respiratory, Cardiovascular, Diabetes)
- **Step 3**: Detailed symptom checklist

### 2. AI Disease Detection
- Upload clinical images for automated analysis
- Throat disease screening with CNN model
- Eye disease detection with EfficientNet
- Risk assessment with confidence scores

### 3. Mental Health Support System
- Mood-adaptive AI chatbot that adjusts personality based on user's emotional state
- Asks about user's mood and provides empathetic support
- Detects emotional indicators (sad, anxious, stressed, happy, etc.)
- Switches between supportive, encouraging, or empathetic modes
- Provides coping strategies, validation, and emotional comfort
- Form-specific health analysis when needed
- Powered by Mistral API with dynamic system prompts

### 4. Secure Authentication
- JWT-based authentication
- Protected routes
- Session management
- Auto-logout on page refresh (configurable)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- File upload validation
- MongoDB injection prevention
- CORS configuration

## 🎯 API Integration Flow

```
Frontend → Backend API → AI Model Services
   ↓           ↓              ↓
React      Express.js      FastAPI
   ↓           ↓              ↓
 Axios    MongoDB Atlas   TensorFlow
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  phone: String,
  createdAt: Date
}
```

### Health Form Model
```javascript
{
  userId: ObjectId,
  heartRate: Number,
  spo2: Number,
  temperature: Number,
  bloodPressure: { systolic, diastolic },
  problemArea: String,
  bodyPart: String,
  imageUrl: String,
  result: String (AI analysis),
  [problemArea]: Object (detailed symptoms),
  createdAt: Date
}
```

### Chat History Model
```javascript
{
  userId: ObjectId,
  formId: ObjectId (optional),
  message: String,
  sender: String (user/ai),
  timestamp: Date
}
```

## 🚧 Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Throat AI Model
cd model-backend/nirvik && uvicorn app:app --reload

# Terminal 4 - Eye AI Model
cd model-backend/soumya && uvicorn app:app --reload
```

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
Deploy to your preferred hosting service (Heroku, AWS, Azure, etc.)

### AI Models
Deploy FastAPI services using Docker or cloud services

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is for educational and hackathon purposes.

## 👥 Team

- **Soumya** - AI Model Development (Eye Disease)
- **Rakshi** - Full Stack Development
- **Nirvik** - AI Model Development (Throat Disease)
- **Ayushi** - AI Model Development

## 🔗 Links

- GitHub Repository: [hackathonDataSet](https://github.com/Rakshi2609/hackathonDataSet)

---

**Note**: Make sure all services are running before testing the full application flow.
