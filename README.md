# My Questionnaire - Frontend

A React-based questionnaire application that allows users to create, edit, reorder, and delete questions and answers with auto-save functionality. This is the frontend part of the My Questionnaire App.

## 🚀 Features

- Create up to 10 questions per questionnaire
- Add unlimited answers to each question
- Reorder questions and answers with intuitive up/down arrows
- Delete questions and answers
- Auto-save with visual feedback (Saving... / Saved / Unable to Save)
- Responsive design (mobile-first approach)
- Real-time validation for empty questions and answers
- Clean, modern UI with custom CSS (no UI libraries)

## 🛠️ Tech Stack

- **React.js** (Create React App)
- **React Router** for navigation between Home and Questionnaire pages
- **React Icons** for UI elements (arrows, delete, user icons)
- **CSS3** for styling (mobile-first approach)
- **Fetch API** for HTTP requests to backend

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Backend server (questionnaire_app-api) running on port 3000

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/ckapsalis2710/questionnaire_app.git
cd questionnaire_app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

The project uses two environment files:
- **`.env.development`** - For development environment (used with `npm start`)
- **`.env.production`** - For production builds (used with `npm run build`)

Create a `.env.development` file in the root directory:

```bash
# On Mac/Linux:
touch .env.development

# On Windows (Git Bash):
touch .env.development
# Or create the file manually
```

Add the following configuration to `.env.development`:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

For production, create `.env.production` with your production API URL:
```env
REACT_APP_API_URL=https://your-production-api.com/api
```

> **Note**: The `.env.development` file is for local development. The frontend will use this URL to connect to your backend API. Make sure the backend server is running on the specified port (default: 3000). Never commit these files to git (they are already in `.gitignore`).

### 4. Start the development server
```bash
npm start
```

The application will open at `http://localhost:3001`

## 📁 Project Structure

```
questionnaire_app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.js
│   │   │   └── Header.css
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   ├── Questionnaire/
│   │   │   ├── Questionnaire.js
│   │   │   └── Questionnaire.css
│   │   ├── Question/
│   │   │   ├── Question.js
│   │   │   └── Question.css
│   │   └── Answer/
│   │       ├── Answer.js
│   │       └── Answer.css
│   ├── services/
│   │   └── api.js          # API service for backend communication
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env.development
├── .env.production
├── .gitignore
└── package.json
```

## 🎯 Usage Guide

### Home Page
- Visit `http://localhost:3001`
- Click "Create my questionnaire" to start

### Questionnaire Page
- **Header**: Shows app logo, info message, save status, and user menu
- **Add Question**: Click "Add new question" button (max 10 questions)
- **Edit Question**: Type in the question input field (saves on blur or Enter)
- **Add Answers**: Type in "Type an answer..." field
  - New answer field appears automatically when you start typing
- **Reorder**: Use ↑ ↓ arrows next to each question/answer
- **Delete**: Use 🗑️ icons to remove questions/answers
- **Validation**: 
  - Questions cannot be empty (shows error message)
  - Answers cannot be empty (shows error message)

### Auto-save
- Changes are saved automatically when you:
  - Press Enter
  - Click outside an input field (blur event)
- Visual feedback in header:
  - "Saving..." (orange with animation) - changes are being saved
  - "Saved" (green) - changes saved successfully
  - "Unable to Save" (red) - save failed

## 🔌 API Integration

This frontend communicates with the backend API on port 3000. Make sure the backend server is running before using the application.

### API Endpoints Used

#### Questions
- `GET /api/questions` - Load all questions
- `POST /api/questions` - Create new question
- `PATCH /api/questions/:id` - Update question text
- `DELETE /api/questions/:id` - Delete question
- `PATCH /api/questions/:id/reorder` - Reorder question

#### Answers
- `POST /api/answers` - Create new answer
- `PATCH /api/answers/:id` - Update answer text
- `DELETE /api/answers/:id` - Delete answer
- `PATCH /api/answers/:id/reorder` - Reorder answer

## ⚙️ Configuration

### Environment Variables (.env.development)
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🧪 Testing the API Connection

To verify the frontend can connect to the backend:

1. Start the backend server (on port 3000)
2. Start the frontend (on port 3001)
3. Open browser console (F12)
4. You should see API calls being made successfully

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Optimized for small screens (≤ 768px)
- **Desktop**: Enhanced layout for larger screens (≥ 768px)

## 🤝 Dependencies

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.x
- `react-icons`: ^4.x
- `react-scripts`: 5.x

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to backend"**
   - Ensure backend server is running on port 3000
   - Check `REACT_APP_API_URL` in `.env.development`
   - Verify CORS is enabled in backend

2. **"Module not found" errors**
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then reinstall

3. **Blank page after start**
   - Check browser console for errors
   - Ensure all environment variables are set

4. **Changes not saving**
   - Check that you're using PATCH endpoints (not PUT)
   - Verify the backend is running and accessible