import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import Registration from './routes/registration';
import ThankYou from './routes/thankyou';
import AdminDashboard from './routes/admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
