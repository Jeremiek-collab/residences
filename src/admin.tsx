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
        <header className="bg-[#09151c] text-white py-5 px-6 border-b border-[#c5a880]/30 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-[#c5a880] shadow-md shrink-0">
                <img src={logoUrl} alt="Palm aura logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
                  Palm aura
                </h1>
                <span className="text-xs font-sans font-bold text-[#e5c158] uppercase tracking-widest block mt-0.5">
                  Tableau de Bord Gestionnaire
                </span>
              </div>
            </div>
            <div>
              <span className="inline-block bg-[#c5a880]/20 text-[#f3d994] border border-[#c5a880]/40 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                🔒 Espace Privé &bull; Confidentiel
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
