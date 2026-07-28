import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "../src/context/AuthContext";
import Clarity from '@microsoft/clarity';

Clarity.init('xhl9buesxy');
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
  </BrowserRouter>

  </StrictMode>,
)
