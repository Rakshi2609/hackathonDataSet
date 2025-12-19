# Backend - Healthcare Assessment API

Node.js/Express backend server for the Healthcare Assessment Platform.

## 🚀 Features

- RESTful API with Express.js
- MongoDB Atlas integration
- JWT-based authentication
- File upload handling with Multer
- AI model integration
- Chat functionality with Mistral API

## 📦 Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_secret_key_here
MISTRAL_API_KEY=your_mistral_api_key
```

## 🏃 Running the Server

```bash
# Development
npm start

# The server will run on http://localhost:5000
```

## 📁 Project Structure

```
backend/
├── index.js                    # Entry point
├── db.js                       # MongoDB connection
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── chatController.js       # Chat functionality
│   └── healthFormController.js # Health form CRUD + AI integration
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── models/
│   ├── User.js                 # User schema
│   ├── Form.js                 # Health form schema
│   └── ChatHistory.js          # Chat history schema
├── routes/
│   ├── authRoutes.js           # /api/auth endpoints
│   ├── chatRoutes.js           # /api/chat endpoints
│   └── healthFormRoutes.js     # /api/forms endpoints
└── uploads/                    # Uploaded images storage
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Health Forms
- `POST /api/forms` - Create health form (multipart/form-data)
- `GET /api/forms` - Get all user forms
- `GET /api/forms/:id` - Get specific form

### Chat
- `POST /api/chat` - General chat with AI
- `POST /api/chat/form/:formId` - Chat about specific form
- `GET /api/chat/history` - Get chat history

## 🤖 AI Model Integration

The backend communicates with FastAPI AI services:

- **Throat Disease Model**: `http://127.0.0.1:8000/predict/throat`
- **Eye Disease Model**: `http://127.0.0.1:8000/predict/eye`

When a form with an image is submitted, the backend:
1. Receives the image via Multer
2. Forwards it to the appropriate AI model endpoint
3. Receives the prediction result
4. Stores the result with the form data in MongoDB

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashed, required),
  dob: Date,
  phone: String
}
```

### HealthForm
```javascript
{
  userId: ObjectId (ref: User),
  heartRate: Number,
  spo2: Number,
  temperature: Number,
  bloodPressure: { systolic: Number, diastolic: Number },
  problemArea: String,
  bodyPart: String,
  imageUrl: String,
  result: String (AI prediction),
  throat: Object,
  eye: Object,
  respiratory: Object,
  cardiovascular: Object,
  diabetes: Object,
  createdAt: Date (default: Date.now)
}
```

### ChatHistory
```javascript
{
  userId: ObjectId (ref: User),
  formId: ObjectId (ref: HealthForm),
  message: String,
  sender: String (enum: ['user', 'ai']),
  timestamp: Date (default: Date.now)
}
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Token sent to client
4. Client includes token in Authorization header: `Bearer <token>`
5. Protected routes verify token via middleware

## 📝 Dependencies

```json
{
  "express": "^5.0.1",
  "mongoose": "^8.11.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "multer": "^1.4.5-lts.1",
  "axios": "^1.7.9",
  "form-data": "^4.0.1"
}
```

## 🛠️ Development Tips

- Use Postman or Thunder Client to test API endpoints
- Monitor MongoDB Atlas for database queries
- Check AI model services are running before testing form submission
- Use `console.log` statements for debugging (already included in controllers)

## 🚨 Error Handling

All endpoints return JSON responses:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 📞 Support

For issues or questions, contact the development team.
