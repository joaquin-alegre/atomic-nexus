import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React applications.
import { StateProvider } from './context/StateContext';
import App from './App'; // Import the main application component.

import './index.css'; // Import global CSS styles.

/**
 * Renders the React application into the root element of the HTML document.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* StrictMode is a development tool that helps identify potential problems in the app */}
      <StateProvider>
      <App /> {/* Render the main App component */}
      </StateProvider>
  </React.StrictMode>
);