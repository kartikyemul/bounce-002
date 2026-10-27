import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { RequireRole } from './context/Auth'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Customer from './pages/Customer'
import Incharge from './pages/Incharge'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<RequireRole role="Customer"><Customer /></RequireRole>} />
        <Route path="/incharge" element={<RequireRole role="Court in-charge"><Incharge /></RequireRole>} />
        <Route path="/admin" element={<RequireRole role="Admin"><Admin /></RequireRole>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
