import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUp from './page/SignUp.jsx'
import Login from './page/Login.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  
  </StrictMode>,
)