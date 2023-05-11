import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContexProvider } from './context/authContext';

// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app inside the root element
root.render(
  <React.StrictMode> {/* Enable strict mode for better error handling */}
    <AuthContexProvider> {/* Wrap the app with the authentication context provider */}
      <App /> {/* Render the main app component */}
    </AuthContexProvider>
  </React.StrictMode>
);

