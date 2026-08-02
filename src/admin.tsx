import React from 'react';
import ReactDOM from 'react-dom/client';
import { BookingProvider } from './context/BookingContext';
import { AdminDashboard } from './pages/AdminDashboard';
import './index.css';
import logoUrl from '../logo.jpeg';

const AdminApp: React.FC = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col bg-sand-50">
        {/* Header indépendant pour l'Espace Gestionnaire */}
        <header className="bg-navy-950 text-white py-4 px-6 border-b border-navy-800 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-sand-200">
                <img src={logoUrl} alt="Palm aura logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-white tracking-wide">
                  Palm aura <span className="text-xs font-sans text-[#c5a880] uppercase tracking-widest block font-normal">Tableau de Bord Gestionnaire</span>
                </h1>
              </div>
            </div>
            <div>
              <span className="inline-block bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Espace Privé &bull; Confidentiel
              </span>
            </div>
          </div>
        </header>

        {/* Tableau de bord principal */}
        <main className="flex-grow py-8">
          <AdminDashboard />
        </main>

        {/* Footer indépendant */}
        <footer className="bg-navy-950 text-navy-400 py-6 border-t border-navy-800 text-center text-xs">
          <p>© {new Date().getFullYear()} Palm aura Jacqueville — Espace Gestionnaire Indépendant</p>
        </footer>
      </div>
    </BookingProvider>
  );
};

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
