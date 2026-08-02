import React, { useState, useEffect } from 'react';
import { Menu, X, Home as HomeIcon, Hotel, Phone, Instagram, Facebook, CloudSun } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import logoUrl from '../../logo.jpeg';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;
      const threshold = currentPage === 'home' ? window.innerHeight * 0.8 : 50;
      if (scrollTop > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPage]);

  const navigation = [
    { name: 'Accueil', id: 'home', icon: HomeIcon },
    { name: 'Nos Villas', id: 'villas', icon: Hotel },
  ];

  const isTransparent = currentPage === 'home' && !isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 transition-all duration-500 z-50 ${
        isTransparent 
          ? 'bg-transparent text-white border-transparent py-4' 
          : 'glass-nav shadow-sm text-navy-900 border-b border-sand-100/50 py-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 bg-white border border-sand-200">
                <img src={logoUrl} alt="Palm aura logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className={`font-serif text-xl sm:text-2xl font-semibold tracking-wide transition-colors duration-200 ${
                  isTransparent ? 'text-white' : 'text-navy-900 group-hover:text-azure-600'
                }`}>
                  Palm aura<span className={`font-sans font-light text-xs tracking-widest block uppercase ${
                    isTransparent ? 'text-azure-200' : 'text-azure-500'
                  }`}>Jacqueville</span>
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); window.scrollTo(0, 0); }}
                    className={`flex items-center space-x-1.5 text-sm font-medium tracking-wide transition-all duration-200 py-2 border-b-2 ${
                      currentPage === item.id 
                        ? (isTransparent ? 'border-white text-white font-semibold' : 'border-azure-500 text-azure-600 font-semibold')
                        : (isTransparent 
                            ? 'border-transparent text-white/80 hover:text-white hover:border-white/30' 
                            : 'border-transparent text-navy-900 hover:text-azure-500 hover:border-sand-300')
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              <button 
                onClick={() => { setCurrentPage('villas'); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95 flex items-center space-x-2 ${
                  isTransparent 
                    ? 'border border-white text-white hover:bg-white hover:text-navy-900' 
                    : 'bg-azure-600 hover:bg-azure-500 text-white shadow-md shadow-azure-600/10 hover:shadow-lg'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Réserver</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isTransparent ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-sand-100'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-sand-100/50 animate-fade-in-up">
            <div className="px-2 pt-3 pb-4 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left text-base font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-azure-50 text-azure-600'
                        : 'text-navy-900 hover:bg-sand-100 hover:text-azure-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-azure-500" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    setCurrentPage('villas');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-azure-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-transform"
                >
                  <Phone className="w-5 h-5" />
                  <span>Réserver un séjour</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className={`flex-grow ${currentPage !== 'home' ? 'pt-20' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f1f2e] text-white/80 py-16 border-t border-[#c5a880]/20 font-sans relative overflow-hidden">
        {/* Motifs Décoratifs d'arrière-plan */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Lueurs d'ambiance Azur & Or */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-azure-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Motifs Géométriques Luxueux en filigrane */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0 C20 20 20 40 40 80 C60 40 60 20 40 0 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                <circle cx="40" cy="40" r="12" fill="none" stroke="#c5a880" strokeWidth="1" />
                <path d="M0 40 L80 40 M40 0 L40 80" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-pattern)" />
          </svg>

          {/* Motifs Floraux / Palmes Stylisées en coins */}
          <svg className="absolute -bottom-12 -right-12 w-96 h-96 text-[#c5a880]/[0.05] transform rotate-12" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C55 25 75 45 100 50C75 55 55 75 50 100C45 75 25 55 0 50C25 45 45 25 50 0Z"/>
          </svg>
          <svg className="absolute -top-12 -left-12 w-80 h-80 text-azure-400/[0.04] transform -rotate-12" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0C55 25 75 45 100 50C75 55 55 75 50 100C45 75 25 55 0 50C25 45 45 25 50 0Z"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12">
            
            {/* Colonne 1: Adresse (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-serif text-3xl text-white tracking-wide font-normal">Adresse</h3>
              <div className="text-sm text-white/60 space-y-1.5 font-light leading-relaxed">
                <p className="font-medium text-white/80">Palm aura Jacqueville</p>
                <p>Boulevard de la Plage</p>
                <p>Bord de Mer, Jacqueville</p>
                <p>Côte d'Ivoire</p>
              </div>
            </div>

            {/* Colonne 2: Contact (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-serif text-3xl text-white tracking-wide font-normal">Contact</h3>
              <div className="text-sm text-white/60 space-y-1.5 font-light">
                <p>
                  <a href="tel:+2250172707000" className="hover:text-white transition-colors underline decoration-white/20">
                    T +225 01 72 70 70 00
                  </a>
                </p>
                <p>
                  <a href="mailto:yirekouassi@gmail.com" className="hover:text-white transition-colors underline decoration-white/20">
                    yirekouassi@gmail.com
                  </a>
                </p>
              </div>
              
              {/* Bouton WhatsApp dans le bas de page */}
              <div className="pt-1">
                <a 
                  href="https://wa.me/2250172707000?text=Bonjour%20Palm%20aura,%20je%20souhaite%20des%20informations%20sur%20vos%20r%C3%A9sidences." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-5 rounded-full text-xs font-medium shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4.5 h-4.5 fill-current shrink-0" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>

              {/* Icônes Réseaux & Météo */}
              <div className="flex space-x-3 pt-2">
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-all bg-white/5 hover:bg-white/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
                <a 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-all bg-white/5 hover:bg-white/10"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
                <div 
                  className="w-10 h-10 rounded-full border border-white/10 text-white/40 flex items-center justify-center bg-white/5 cursor-default"
                  title="Météo Jacqueville : 28°C Ensoleillé"
                >
                  <CloudSun className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>

            {/* Colonne 3: Réservation (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-serif text-3xl text-white tracking-wide font-normal">Réservation</h3>
              <button 
                onClick={() => { setCurrentPage('villas'); window.scrollTo(0, 0); }}
                className="inline-flex items-center space-x-2 border border-white/20 hover:border-white py-2.5 px-6 rounded-full text-xs font-medium text-white/90 hover:text-white transition-all bg-white/5 hover:bg-white/10 active:scale-95 cursor-pointer"
              >
                <span>→ Réserver un séjour</span>
              </button>
            </div>

            {/* Colonne 4: Navigation (2 cols) */}
            <div className="md:col-span-2 md:text-right space-y-2.5 text-sm font-light text-white/50 pt-2 flex flex-col md:items-end">
              <button onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors text-left md:text-right">
                Accueil
              </button>
              <button onClick={() => { setCurrentPage('villas'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors text-left md:text-right">
                Nos Villas
              </button>
              <span className="text-white/25 pt-2 text-xs font-mono select-none block">
                FR / CI
              </span>
            </div>

          </div>

          {/* Barre inférieure de droits et localisation */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/30 tracking-[0.15em] uppercase font-mono">
            <p>© {new Date().getFullYear()} — Fondé par Palm aura</p>
            <p className="mt-2 sm:mt-0">Design Prestige &bull; Côte d'Ivoire</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
