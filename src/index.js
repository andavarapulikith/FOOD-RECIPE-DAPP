import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import dotenv from 'dotenv';

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(document.getElementById('root'));
dotenv.config();
root.render(
  // <React.StrictMode>
  <BrowserRouter>
  <App />
  <Toaster richColors/>
  </BrowserRouter>
   
  // </React.StrictMode>
);


reportWebVitals();
