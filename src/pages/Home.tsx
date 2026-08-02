import React, { useEffect, useRef, useState } from 'react';
import { useBookings } from '../context/BookingContext';
import photo1Url from '../../photo1.png';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  setSelectedVillaId: (id: string | null) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage, setSelectedVillaId }) => {
  const { villas } = useBookings();

  const residences = villas
    .filter((v) => ['residence-2', 'residence-3', 'residence-4', 'residence-5', 'residence-6', 'residence-7'].includes(v.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  const selectVilla = (id: string) => {
    setSelectedVillaId(id);
    setCurrentPage('details');
  };

  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftEmblemRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const hotspot1Ref = useRef<HTMLDivElement>(null);
  const hotspot2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const animDuration = heroHeight * 0.2;
      const progress = Math.min(Math.max(scrollY / animDuration, 0), 1);

      if (bgRef.current) {
        bgRef.current.style.transform = `scale(${1 + progress * 0.08})`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(-${progress * 180}px) scale(${1 - progress * 0.22})`;
        contentRef.current.style.opacity = `${1 - progress}`;
      }
      if (leftEmblemRef.current) {
        leftEmblemRef.current.style.transform = `translateY(-${progress * 50}px)`;
        leftEmblemRef.current.style.opacity = `${1 - progress}`;
      }
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = `${1 - progress}`;
      }
      if (hotspot1Ref.current) {
        hotspot1Ref.current.style.opacity = `${1 - progress}`;
      }
      if (hotspot2Ref.current) {
        hotspot2Ref.current.style.opacity = `${1 - progress}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FAF7F2] pb-20 relative min-h-screen text-navy-900 overflow-hidden">
      {/* Background Botanical Watermarks (Fixed position) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.03] text-emerald-800">
        <div className="absolute top-[20%] left-[-8%] w-[45vw] h-[45vw] max-w-[450px]">
          <PalmBranchSVG />
        </div>
        <div className="absolute top-[50%] right-[-8%] w-[50vw] h-[50vw] max-w-[500px] transform rotate-[135deg]">
          <PalmBranchSVG />
        </div>
        <div className="absolute top-[80%] left-[-10%] w-[55vw] h-[55vw] max-w-[550px] transform -rotate-[45deg]">
          <PalmBranchSVG />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[120vh] z-10">
        <section className="sticky top-0 h-screen w-full flex flex-col justify-between items-center text-white select-none overflow-hidden bg-navy-950">
          {/* Background Image / Gradient Overlay */}
          <div 
            ref={bgRef}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-100 will-change-transform" 
            style={{ backgroundImage: `url(${photo1Url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/60 z-0" />
          </div>

          {/* Rotating Circular Emblem (Left side) */}
          <div ref={leftEmblemRef} className="absolute top-32 left-8 sm:left-16 z-20 hidden md:flex flex-col items-center select-none pointer-events-none">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_25s_linear_infinite] text-white/80">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text className="text-[9px] font-sans font-medium tracking-[0.22em] fill-current uppercase">
                  <textPath href="#circlePath">
                    Palm Aura • Résidence • Palm Aura • Résidence •
                  </textPath>
                </text>
              </svg>
              <div className="absolute w-8 h-8 flex items-center justify-center text-white/95 text-lg font-light">
                🌴
              </div>
            </div>
            {/* Slide Indicator */}
            <div className="flex flex-col items-center mt-24 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-white/60">00</span>
              <div className="w-[1px] h-20 bg-white/30"></div>
            </div>
          </div>

          {/* Vertical Scroll Indicator (Bottom Left) */}
          <div ref={scrollIndicatorRef} className="absolute bottom-10 left-8 sm:left-16 z-20 hidden md:flex flex-col items-center space-y-4 pointer-events-none">
            <span className="text-[9px] font-sans font-light tracking-[0.35em] uppercase text-white/60 [writing-mode:vertical-lr]">
              SCROLL
            </span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>

          {/* Pulsing Hotspots (Inspired by real-estate mockups) */}
          {/* Hotspot 1 (Left Area) */}
          <div ref={hotspot1Ref} className="absolute bottom-[28%] left-[28%] z-20 group hidden md:block">
            <div className="relative w-8 h-8 flex items-center justify-center cursor-pointer">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-white shadow-md border border-azure-500 transition-transform group-hover:scale-110"></span>
            </div>
            <div className="absolute left-1/2 bottom-12 transform -translate-x-1/2 bg-navy-900/90 text-white text-[10px] tracking-wider py-2 px-3.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none backdrop-blur-sm">
              Architecture Épurée & Prestige
            </div>
          </div>

          {/* Hotspot 2 (Right Area) */}
          <div ref={hotspot2Ref} className="absolute bottom-[24%] right-[22%] z-20 group hidden md:block">
            <div className="relative w-8 h-8 flex items-center justify-center cursor-pointer">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-white shadow-md border border-azure-500 transition-transform group-hover:scale-110"></span>
            </div>
            <div className="absolute left-1/2 bottom-12 transform -translate-x-1/2 bg-navy-900/90 text-white text-[10px] tracking-wider py-2 px-3.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none backdrop-blur-sm">
              Piscines & Accès Privé Mer
            </div>
          </div>

          {/* Main Title / Content (Centered) */}
          <div ref={contentRef} className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 max-w-4xl mt-12 will-change-transform">
            <div className="flex flex-col items-center relative animate-fade-in-up">
              <h1 className="font-serif text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[5.5vw] font-bold tracking-[0.12em] leading-[0.85] text-white uppercase drop-shadow-sm">
                PALM
              </h1>
              <h1 className="font-serif text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[5.5vw] font-bold tracking-[0.12em] leading-[0.85] text-white uppercase drop-shadow-sm mt-1 sm:mt-2">
                AURA
              </h1>
              <span className="font-['Alex_Brush'] text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] text-azure-300 select-none drop-shadow-md -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-16 capitalize">
                Jacqueville
              </span>
            </div>

            {/* Slogans grid */}
            <div className="w-full max-w-3xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center text-[10px] sm:text-xs tracking-[0.25em] font-light text-white/80 animate-fade-in-up [animation-delay:200ms] uppercase border-t border-b border-white/15 py-4 md:py-5">
              <div className="md:text-left">UN HAVRE</div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-[1px] bg-white/20 hidden md:block"></div>
                <span className="font-semibold text-azure-200">ENTRE MER & LAGUNE</span>
                <div className="w-6 h-[1px] bg-white/20 hidden md:block"></div>
              </div>
              <div className="md:text-right">DE SÉRÉNITÉ</div>
            </div>
          </div>

          {/* Empty bottom element to align centering */}
          <div className="h-20 w-full pointer-events-none"></div>
        </section>
      </div>



      {/* Villa Catalog (Zigzag Layout) */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <ScrollRevealSection className="space-y-3">
            <span className="text-xs font-semibold text-[#c5a880] uppercase tracking-widest block font-sans">
              Collection Privée
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy-950 font-medium">
              Nos Demeures d'Exception
            </h2>
            <div className="w-24 h-[1px] bg-[#c5a880] mx-auto mt-4"></div>
          </ScrollRevealSection>
        </div>

        <div className="space-y-32">
          {residences.map((villa) => {
            const isEven = parseInt(villa.id.replace('residence-', '')) % 2 === 0;

            return (
              <section key={villa.id} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollRevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  {isEven ? (
                    <>
                      {/* GAUCHE: Texte (Résidences PAIR) */}
                      <div className="lg:col-span-6 space-y-6">
                        <span className="font-['Alex_Brush'] text-3xl sm:text-4xl text-[#c5a880] block">
                          {villa.subtitle}
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-navy-950 uppercase leading-tight">
                          {villa.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-navy-500 uppercase tracking-widest font-medium border-y border-[#c5a880]/20 py-3 font-sans">
                          <span>À partir de {villa.pricePerNight.toLocaleString('fr-FR')} FCFA / nuit</span>
                        </div>
                        <p className="text-navy-600 text-sm sm:text-base leading-relaxed font-light font-sans max-w-xl">
                          {villa.description}
                        </p>
                        <div className="pt-2">
                          <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c5a880] mb-3 font-sans">Équipements de prestige</h4>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-w-md">
                            {villa.amenities.slice(0, 4).map((amenity, i) => (
                              <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm text-navy-700 font-light font-sans">
                                <span className="text-[#c5a880]">✦</span>
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-6">
                          <button 
                            onClick={() => selectVilla(villa.id)}
                            className="group relative inline-flex items-center justify-center py-3.5 px-8 overflow-hidden rounded-full border border-[#c5a880] text-xs font-semibold tracking-[0.2em] uppercase text-navy-900 transition-all duration-300 hover:text-white font-sans"
                          >
                            <span className="absolute inset-0 bg-[#c5a880] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                            <span className="relative z-10 flex items-center space-x-2">
                              <span>Découvrir la résidence</span>
                              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* DROITE: Image (Résidences PAIR) */}
                      <div className="lg:col-span-6 flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] p-3 bg-white border border-[#c5a880]/15 shadow-2xl rounded-t-full overflow-hidden group/img">
                          <div className="w-full h-full rounded-t-full overflow-hidden relative">
                            <img 
                              src={villa.imageUrl} 
                              alt={villa.title} 
                              className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-navy-950/5 group-hover/img:bg-transparent transition-colors duration-500" />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* GAUCHE: Image (Résidences IMPAIR) */}
                      <div className="lg:col-span-6 flex justify-center order-last lg:order-first">
                        <div className="relative w-full max-w-md aspect-[3/4] p-3 bg-white border border-[#c5a880]/15 shadow-2xl rounded-t-full overflow-hidden group/img">
                          <div className="w-full h-full rounded-t-full overflow-hidden relative">
                            <img 
                              src={villa.imageUrl} 
                              alt={villa.title} 
                              className="w-full h-full object-cover transition-transform duration-1000 scale-100 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-navy-950/5 group-hover/img:bg-transparent transition-colors duration-500" />
                          </div>
                        </div>
                      </div>

                      {/* DROITE: Texte (Résidences IMPAIR) */}
                      <div className="lg:col-span-6 space-y-6">
                        <span className="font-['Alex_Brush'] text-3xl sm:text-4xl text-[#c5a880] block">
                          {villa.subtitle}
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-navy-950 uppercase leading-tight">
                          {villa.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-navy-500 uppercase tracking-widest font-medium border-y border-[#c5a880]/20 py-3 font-sans">
                          <span>À partir de {villa.pricePerNight.toLocaleString('fr-FR')} FCFA / nuit</span>
                        </div>
                        <p className="text-navy-600 text-sm sm:text-base leading-relaxed font-light font-sans max-w-xl">
                          {villa.description}
                        </p>
                        <div className="pt-2">
                          <h4 className="text-xs uppercase tracking-widest font-semibold text-[#c5a880] mb-3 font-sans">Équipements de prestige</h4>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-w-md">
                            {villa.amenities.slice(0, 4).map((amenity, i) => (
                              <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm text-navy-700 font-light font-sans">
                                <span className="text-[#c5a880]">✦</span>
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-6">
                          <button 
                            onClick={() => selectVilla(villa.id)}
                            className="group relative inline-flex items-center justify-center py-3.5 px-8 overflow-hidden rounded-full border border-[#c5a880] text-xs font-semibold tracking-[0.2em] uppercase text-navy-900 transition-all duration-300 hover:text-white font-sans"
                          >
                            <span className="absolute inset-0 bg-[#c5a880] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                            <span className="relative z-10 flex items-center space-x-2">
                              <span>Découvrir la résidence</span>
                              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </ScrollRevealSection>
              </section>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-12 border-t border-[#c5a880]/15">
        <ScrollRevealSection className="space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#c5a880] uppercase tracking-widest block font-sans">Témoignages</span>
            <h2 className="text-3xl font-serif font-bold text-navy-950">Ils ont séjourné chez nous</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl border border-[#c5a880]/15 shadow-sm space-y-4">
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <p className="text-sm text-navy-600 leading-relaxed italic font-sans">
                "Un week-end fantastique en famille. La Villa L'Étoile d'Azur est magnifique, la propreté est irréprochable et le gestionnaire est extrêmement disponible. Nous reviendrons sans hésiter."
              </p>
              <div className="font-semibold text-navy-950 text-sm font-sans">Franck A. (Abidjan)</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl border border-[#c5a880]/15 shadow-sm space-y-4">
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <p className="text-sm text-navy-600 leading-relaxed italic font-sans">
                "La vue sur l'océan depuis le transat est tout simplement magique. L'endroit est très sécurisé et le calme permet une vraie déconnexion."
              </p>
              <div className="font-semibold text-navy-950 text-sm font-sans">Amélie C. (Paris)</div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl border border-[#c5a880]/15 shadow-sm space-y-4">
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <p className="text-sm text-navy-600 leading-relaxed italic font-sans">
                "Le système de réservation par formulaire est simple. Le gestionnaire m'a appelé par WhatsApp 15 minutes après ma soumission pour valider la caution et m'expliquer le chemin."
              </p>
              <div className="font-semibold text-navy-950 text-sm font-sans">Yasmine K. (Bouaké)</div>
            </div>
          </div>
        </ScrollRevealSection>
      </section>
    </div>
  );
};

// Scroll Reveal Wrapper Component utilizing IntersectionObserver
const ScrollRevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-12 blur-[1px]'
      }`}
    >
      {children}
    </div>
  );
};

// Premium botanical watermark pattern (vector palm branch SVG)
const PalmBranchSVG: React.FC = () => (
  <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 110 C 35 90, 85 45, 110 10" />
    <path d="M30 90 C 25 78, 20 48, 15 38 C 25 48, 30 73, 30 90 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M42 78 C 37 66, 32 36, 27 26 C 37 36, 42 61, 42 78 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M55 65 C 50 53, 45 23, 40 13 C 50 23, 55 48, 55 65 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M70 50 C 65 38, 60 13, 58 3 C 65 13, 70 36, 70 50 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M45 95 C 55 90, 80 80, 90 75 C 80 85, 60 92, 45 95 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M57 83 C 67 78, 92 68, 102 63 C 92 73, 72 80, 57 83 Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M70 70 C 80 65, 105 55, 115 50 C 105 60, 85 67, 70 70 Z" fill="currentColor" fillOpacity="0.25" />
  </svg>
);
