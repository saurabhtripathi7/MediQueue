import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AppContextProvider>
  </BrowserRouter>,
)
