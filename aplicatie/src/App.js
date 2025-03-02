import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './context/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import ArtistList from './components/ArtistList';
import ExpositionList from './components/ExpositionList';
import ArtistsArtworks from './components/ArtistsArtworks';
import Footer from './components/Footer';

const AppContent = () => {
  const { token } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {token ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/expositions" element={<ExpositionList />} />
            <Route path="/artists" element={<ArtistList />} />
            <Route path="/artworks" element={<ArtistsArtworks />} />
            <Route path="/products" element={<ProductList />} />

            <Route path="/productlist" element={<ProductList />} />
            <Route path="/" element={<Navigate to="/artworks" />} />
            <Route path="*" element={<Navigate to="/artworks" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProductList />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
