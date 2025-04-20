# Code Plagiarism Detection System

A full-stack application designed to monitor user input patterns and detect potential plagiarism in code editing environments. This system captures user interactions, analyzes input patterns, and provides similarity detection for identifying potential academic dishonesty.

## Features

- Real-time monitoring of user inputs (typing, copy/paste, tab switching)
- Advanced similarity detection using multiple algorithms
- Detailed admin dashboard with data visualization
- Comprehensive activity logging and reporting
- Line-by-line highlighting of suspicious code segments

## Project Structure

This project is organized as a monorepo with separate frontend and backend applications:

```
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React context providers
│   │   ├── pages/        # Page components
│   │   └── types.ts      # TypeScript type definitions
│   └── ...
├── backend/              # Node.js + Express backend
│   ├── src/
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── index.js      # Server entry point
│   └── ...
└── ...
```

## Tech Stack

### Frontend
- React with TypeScript
- Monaco Editor for code editing
- Chart.js for data visualization
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js with Express
- JWT authentication
- String similarity algorithms
- In-memory database (can be replaced with MongoDB)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start development servers:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## Development Roadmap

### Week 1: Project Setup + Input Monitoring
- ✅ Monorepo structure
- ✅ Frontend with React and Monaco Editor
- ✅ Input event capture (typing, copy/paste, tab switching)
- ✅ Backend API endpoints for logging activities

### Week 2: Similarity Detection Engine
- ✅ Text tokenization and preprocessing
- ✅ Multiple similarity metrics implementation
- ✅ Suspicious content flagging
- ✅ API for similarity checking

### Week 3: Admin Dashboard + Reporting
- ✅ Admin panel with authentication
- ✅ Data visualization
- ✅ Filtering and search capabilities
- ✅ Export functionality

### Week 4: Final Touches + Deployment
- ✅ Suspicious line highlighting
- ✅ Security enhancements
- ⬜ Unit testing
- ⬜ Dockerization
- ⬜ Production deployment

## License

MIT