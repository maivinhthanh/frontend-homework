import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ReduxProvider from './redux/ReduxProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
);
