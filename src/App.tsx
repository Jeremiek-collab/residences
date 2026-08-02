import React, { useState, useEffect } from 'react';
import { BookingProvider } from './context/BookingContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VillasList } from './pages/VillasList';
import { VillaDetails } from './pages/VillaDetails';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedVillaId, setSelectedVillaId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedVillaId={setSelectedVillaId} 
          />
        );
      case 'villas':
        return (
          <VillasList 
            setCurrentPage={setCurrentPage} 
            setSelectedVillaId={setSelectedVillaId} 
          />
        );
      case 'details':
        return (
          <VillaDetails 
            villaId={selectedVillaId || 'residence-2'} 
            setCurrentPage={setCurrentPage} 
          />
        );
      default:
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedVillaId={setSelectedVillaId} 
          />
        );
    }
  };

  return (
    <BookingProvider>
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
      </Layout>
    </BookingProvider>
  );
};

export default App;
