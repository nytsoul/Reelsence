import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col bg-bg-primary text-txt-primary font-body">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommendations/:userId" element={<RecommendationsPage />} />
            <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
