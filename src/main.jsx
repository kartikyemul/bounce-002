import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/Auth'
import { BookingsProvider } from './context/Bookings'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookingsProvider>
          <App />
        </BookingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
