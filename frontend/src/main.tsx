import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import React from 'react';
import { ActivityProvider } from './contexts/ActivityContext';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <ActivityProvider>
        <App />
      </ActivityProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);