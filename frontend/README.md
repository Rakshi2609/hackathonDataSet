# Frontend - Healthcare Assessment Platform

React-based frontend for the Healthcare Assessment Platform with modern UI/UX.

## 🚀 Features

- Modern, responsive UI built with React 19
- Tailwind CSS for styling
- Framer Motion animations
- Protected routes with authentication
- Toast notifications
- Multi-step form wizard
- Real-time chat interface
- Image upload for medical analysis

## 📦 Installation

```bash
npm install
```

## 🏃 Running the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on: `http://localhost:5173`

## 🔧 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx              # Entry point
│   ├── api/
│   │   └── axios.js          # Axios configuration
│   ├── components/
│   │   └── ProtectedRoute.jsx # Auth guard component
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── CreateForm.jsx    # Health form creation
│   │   ├── AllForms.jsx      # Forms list view
│   │   ├── FormDetails.jsx   # Single form view
│   │   ├── MainChat.jsx      # General AI chat
│   │   └── FormChat.jsx      # Form-specific chat
│   └── services/
│       ├── authService.js    # Authentication API calls
│       ├── chatService.js    # Chat API calls
│       └── formService.js    # Form API calls
├── public/                   # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## 🔐 Authentication Flow

1. User registers/logs in via Login/Register pages
2. JWT token stored in localStorage
3. AuthContext provides auth state globally
4. ProtectedRoute component guards authenticated routes
5. Axios interceptor adds token to all API requests

## 🎨 Key Pages

### Home (`/`)
- Landing page with app introduction
- Login/Register navigation

### Dashboard (`/dashboard`)
- Quick access to create forms
- Recent forms overview
- Navigation to chat and forms

### Create Form (`/create-form`)
**Multi-step wizard:**
- **Step 1**: Choose between manual vitals or photo upload
  - Manual: Heart Rate, SpO2, Temperature, Blood Pressure
  - Photo: Upload clinical image for AI analysis
- **Step 2**: Select problem area (Throat, Eye, Respiratory, Cardiovascular, Diabetes)
- **Step 3**: Detailed symptom checklist for selected area

### All Forms (`/forms`)
- Grid view of all submitted health forms
- Shows vitals or uploaded images
- AI analysis results
- Click to view details or chat about form

### Form Details (`/form/:id`)
- Complete form information
- AI prediction results
- Button to chat about the form

### Chat Pages
- **MainChat** (`/chat`): General health consultation
- **FormChat** (`/chat/form/:id`): Discussion about specific form
- Real-time messaging with AI assistant
- Chat history persistence

## 🎭 UI/UX Highlights

### Design System
- **Color Palette**: Warm stone/almond theme (#f2ede9, stone-900)
- **Typography**: Outfit font family
- **Animations**: Smooth transitions with Framer Motion
- **Notifications**: Toast messages for user feedback

### Components
- Custom input components with icons
- Styled checkboxes and radio buttons
- Loading states and error handling
- Responsive grid layouts
- Animated page transitions

## 🔌 API Integration

All API calls go through service files:

### authService.js
```javascript
registerUser(userData)
loginUser(credentials)
```

### formService.js
```javascript
createForm(formData)      // Multipart/form-data for image upload
getAllForms()
getFormById(id)
```

### chatService.js
```javascript
sendMessage(message)
sendFormMessage(formId, message)
getChatHistory()
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI elements
- Adaptive layouts

## 🚨 Error Handling

- Form validation with user feedback
- API error messages via toast notifications
- Loading states for async operations
- Fallback UI for missing data

## 🔄 State Management

- **AuthContext**: Global authentication state
- **React Router**: URL state management
- **Local State**: Component-level useState/useEffect
- **localStorage**: Token and user persistence

## 🎯 Protected Routes

Routes wrapped in `<ProtectedRoute>`:
- /dashboard
- /create-form
- /forms
- /form/:id
- /chat
- /chat/form/:id

Unauthenticated users redirected to `/login`

## 🛠️ Development Tips

- Use React DevTools for component inspection
- Check Network tab for API calls
- Toast notifications show all user feedback
- Hot Module Replacement (HMR) for fast development

## 📦 Build & Deployment

```bash
# Production build
npm run build

# Output directory: dist/
# Deploy dist/ folder to hosting service (Vercel, Netlify, etc.)
```

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize colors, fonts, breakpoints

### API Base URL
Change in `src/api/axios.js`:
```javascript
baseURL: "http://localhost:5000/api"
```

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Backend must allow frontend origin in CORS configuration

### Issue: Token Expired
**Solution**: User will be logged out automatically, need to login again

### Issue: Image Upload Fails
**Solution**: Check file size limits and accepted formats

## 📝 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "axios": "^1.13.2",
  "framer-motion": "^12.23.26",
  "lucide-react": "^0.562.0",
  "react-hot-toast": "^2.4.1"
}
```

## 🤝 Contributing

Follow the existing code style and component patterns.

---

**Note**: Ensure backend and AI model services are running before starting the frontend.
