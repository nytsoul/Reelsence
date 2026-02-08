import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { clearProductionWarnings } from './utils/production';
import './index.css';

// Clear console warnings in production
clearProductionWarnings();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
