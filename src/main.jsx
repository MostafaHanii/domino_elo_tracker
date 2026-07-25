import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { EloProvider } from './context/EloContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EloProvider>
      <App />
    </EloProvider>
  </React.StrictMode>,
);
