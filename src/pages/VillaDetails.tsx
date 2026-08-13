import React, { useState, useMemo } from 'react';
import { useBookings } from '../context/BookingContext';
import { BookingCalendar } from '../components/BookingCalendar';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { 
  Bed, Bath, ArrowLeft, Check, Calendar, Info, Play, Image as ImageIcon, Sparkles,
  ChevronLeft, ChevronRight, X, Maximize2
} from 'lucide-react';

interface VillaDetailsProps {
  villaId: string;
  setCurrentPage: (page: string) => void;
}

export const VillaDetails: React.FC<VillaDetailsProps> = ({ villaId, setCurrentPage }) => {
  const { villas, getVillaBookedDates, addBooking } = useBookings();
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // UI States
  const [activeMedia, setActiveMedia] = useState<'video' | 'image'>('video');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find villa
  const villa = useMemo(() => {
    return villas.find(v => v.id === villaId);
  }, [villas, villaId]);

  // Booked dates
  const bookedDates = useMemo(() => {
    return getVillaBookedDates(villaId);
  }, [getVillaBookedDates, villaId, bookingSuccess]);

  if (!villa) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">Villa introuvable</h2>
        <button onClick={() => setCurrentPage('villas')} className="btn-primary mt-4">
          Retour au catalogue
        </button>
      </div>
    );
  }

  // Calculate nights
  const nights = useMemo(() => {
    if (!selectedStart || !selectedEnd) return 0;
    const start = new Date(selectedStart);
    const end = new Date(selectedEnd);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [selectedStart, selectedEnd]);

  // Calculate total price
  const totalCost = nights * villa.pricePerNight;

  const handleDateChange = (start: string | null, end: string | null) => {
    setSelectedStart(start);
    setSelectedEnd(end);
    setErrorMessage('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedStart || !selectedEnd) {
      setErrorMessage("Veuillez sélectionner vos dates d'arrivée et de départ sur le calendrier.");
      return;
    }
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires (Nom, Email, Téléphone).");
      return;
    }

    setIsSubmitting(true);

    try {
      await addBooking({
        villaId: villa.id,
        clientName,
        clientEmail,
        clientPhone,
        startDate: selectedStart,
        endDate: selectedEnd,
        totalPrice: totalCost,
        notes: notes
      });

      // Envoi de l'alerte e-mail instantanée au gestionnaire (yirekouassi@gmail.com)
      try {
        const formData = new FormData();
        formData.append('_subject', `🚨 Nouvelle Réservation : ${villa.title} - Palm aura Jacqueville`);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        formData.append('_replyto', clientEmail);
        formData.append('Résidence', villa.title);
        formData.append('Nom du Client', clientName);
        formData.append('Email du Client', clientEmail);
        formData.append('Téléphone du Client', clientPhone);
        formData.append('Date d\'Arrivée', formatDateDDMMYYYY(selectedStart));
        formData.append('Date de Départ', formatDateDDMMYYYY(selectedEnd));
        formData.append('Nombre de nuits', `${nights} nuit(s)`);
        formData.append('Montant Total', `${totalCost.toLocaleString('fr-FR')} FCFA`);
        const directImportUrl = `https://palmaura-residences.com/admin.html?action=import&villaId=${villa.id}&clientName=${encodeURIComponent(clientName)}&clientEmail=${encodeURIComponent(clientEmail)}&clientPhone=${encodeURIComponent(clientPhone)}&startDate=${selectedStart}&endDate=${selectedEnd}&totalPrice=${totalCost}&notes=${encodeURIComponent(notes || '')}`;
        formData.append('Tableau de Bord Gestionnaire (Cliquez ici pour réimporter)', directImportUrl);

        await fetch('https://formsubmit.co/ajax/c875384cc3f2f3da10c20ac2640136db', {
          method: 'POST',
          body: formData
        });
      } catch (emailErr) {
        console.warn("L'alerte e-mail n'a pas pu être délivrée instantanément :", emailErr);
      }

      setBookingSuccess(true);
      // Reset form
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setNotes('');
      setSelectedStart(null);
      setSelectedEnd(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Une erreur est survenue lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Back link */}
      <button
        onClick={() => setCurrentPage('villas')}
        className="flex items-center space-x-2 text-navy-500 hover:text-azure-600 transition-colors mb-8 text-sm font-semibold group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>Retour au catalogue</span>
      </button>

      {/* Villa Heading */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-semibold text-azure-500 uppercase tracking-widest block mb-1">
            {villa.location}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 mb-2">
            {villa.title}
          </h1>
          <p className="text-navy-600 font-light italic">{villa.subtitle}</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-sand-100 shadow-sm flex flex-col items-end">
          <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">À partir de</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-azure-600">
              {villa.pricePerNight.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-navy-500">FCFA / nuit</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column Media / Info, Right Column Reservation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column (8 cols in LG) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Custom Media Player */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] bg-navy-950 rounded-3xl overflow-hidden shadow-md group">
              {activeMedia === 'video' ? (
                <video
                  src={villa.videoUrl}
                  key={villa.videoUrl} // force reload on change
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative w-full h-full cursor-zoom-in group/img"
                >
                  <img
                    src={villa.images && villa.images.length > 0 ? villa.images[selectedImageIndex] : villa.imageUrl}
                    key={selectedImageIndex} // force reload/animation on change
                    alt={villa.title}
                    className="w-full h-full object-cover animate-fade-in-up transition-transform duration-500 group-hover/img:scale-105"
                  />
                  {/* Hover overlay indicator */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-4 transform scale-90 group-hover/img:scale-100 transition-all duration-300">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {/* Floating Action Badge */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white/95 text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/10 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Agrandir</span>
                  </div>
                </div>
              )}
            </div>

            {/* Media Selector Thumbnails */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveMedia('video')}
                  className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    activeMedia === 'video'
                      ? 'border-azure-500 bg-azure-50 text-azure-600'
                      : 'border-sand-200 hover:border-sand-300 text-navy-600'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>Vidéo de Visite</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMedia('image');
                    setSelectedImageIndex(0);
                  }}
                  className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    activeMedia === 'image'
                      ? 'border-azure-500 bg-azure-50 text-azure-600'
                      : 'border-sand-200 hover:border-sand-300 text-navy-600'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>Photos de Présentation</span>
                </button>
              </div>
            </div>

            {/* Gallery Thumbnail Row (Only visible when activeMedia === 'image' and has multiple images) */}
            {activeMedia === 'image' && villa.images && villa.images.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-4 pt-2 border-t border-sand-100">
                {villa.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-[#c5a880] scale-95 shadow-md shadow-[#c5a880]/10' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Villa description and stats */}
          <div className="bg-white p-8 rounded-3xl border border-sand-100 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-6 py-6 border-b border-sand-100 text-navy-800 text-center">
              <div className="border-r border-sand-100">
                <span className="text-xs text-navy-400 block uppercase font-semibold mb-1">Chambres</span>
                <div className="flex items-center justify-center space-x-1.5 font-semibold text-lg">
                  <Bed className="w-5 h-5 text-azure-500 shrink-0" />
                  <span>{villa.bedrooms} Chambre</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-navy-400 block uppercase font-semibold mb-1">Salles de bain</span>
                <div className="flex items-center justify-center space-x-1.5 font-semibold text-lg">
                  <Bath className="w-5 h-5 text-azure-500 shrink-0" />
                  <span>{villa.bathrooms} Salle de bain</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-navy-900">À propos de ce séjour</h3>
              <p className="text-navy-600 text-base leading-relaxed font-light whitespace-pre-line">
                {villa.description}
              </p>
            </div>

            {/* Amenities list */}
            <div className="space-y-6 pt-6 border-t border-sand-100">
              <h3 className="font-serif text-2xl font-bold text-navy-900">Équipements et prestations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {villa.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-navy-700 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-azure-50 flex items-center justify-center text-azure-500 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="bg-white p-8 rounded-3xl border border-sand-100 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-navy-900">Emplacement & Quartier</h3>
            <p className="text-navy-600 text-sm leading-relaxed font-light">
              La villa se situe à <strong>{villa.location}</strong>. Jacqueville offre une faune côtière luxuriante et des spots privilégiés. La route depuis Abidjan se fait via le pont moderne Philippe-Grégoire-Yacé, rendant le trajet fluide et rapide (environ 1h). Le gestionnaire vous guidera précisément pour l'accès.
            </p>
          </div>
        </div>

        {/* Right Column (4 cols in LG) - Reservation Calendar & Form */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {bookingSuccess ? (
            // Success view
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-6 shadow-sm animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mx-auto mb-2">
                🎉
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-900">Demande de réservation reçue !</h3>
              <p className="text-emerald-800 text-sm leading-relaxed font-light">
                Votre demande de réservation a été soumise avec succès pour la résidence <strong>{villa.title}</strong>.
              </p>

              {/* Encadré d'instructions Wave */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left text-xs text-navy-800 space-y-2.5 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <span>💳 Dépôt de réservation obligatoire</span>
                </div>
                <p className="leading-relaxed">
                  Pour valider définitivement vos dates, vous devez effectuer un dépôt de réservation de <strong className="text-navy-950">20 000 FCFA</strong> (non remboursable) sur le numéro Wave suivant :
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-center font-mono font-bold text-base text-azure-700 select-all shadow-sm">
                  📲 Wave : 05 55 78 78 55
                </div>
                <p className="text-[11px] text-navy-500 italic leading-normal">
                  * Indiquez votre nom en référence ou envoyez la capture d'écran du paiement par WhatsApp au <strong className="text-navy-900">+225 01 72 70 70 00</strong>.
                </p>
              </div>

              <div className="bg-white border border-emerald-100 rounded-2xl p-4 text-left text-xs text-navy-600 space-y-2">
                <p className="font-semibold text-navy-900 text-sm border-b border-sand-100 pb-2 mb-2">Prochaines étapes :</p>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-azure-600">1.</span>
                  <span>Effectuez votre transfert Wave de 20 000 FCFA sur le 05 55 78 78 55.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-azure-600">2.</span>
                  <span>Le gestionnaire valide la réception et confirme votre statut sur le tableau de bord.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-azure-600">3.</span>
                  <span>Vous recevrez la confirmation officielle du séjour.</span>
                </div>
              </div>
              <button
                onClick={() => setBookingSuccess(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors active:scale-95 text-sm shadow-md"
              >
                Faire une autre demande
              </button>
            </div>
          ) : (
            // Reservation panel
            <div className="bg-white rounded-3xl border border-sand-100 shadow-md p-6 space-y-6">
              <h3 className="font-serif text-xl font-bold text-navy-900 flex items-center space-x-2 border-b border-sand-100 pb-3">
                <Calendar className="w-5 h-5 text-azure-500" />
                <span>Réserver cette villa</span>
              </h3>

              {/* Calendrier de choix des dates */}
              <div>
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-2">
                  1. Choisissez vos dates de séjour
                </label>
                <BookingCalendar
                  villaId={villa.id}
                  bookedDates={bookedDates}
                  onDateChange={handleDateChange}
                />
              </div>

              {/* Date display & total */}
              {selectedStart && selectedEnd && (
                <div className="bg-sand-50/70 border border-sand-100 rounded-2xl p-4.5 space-y-3.5 animate-fade-in-up">
                  <div className="flex justify-between text-xs text-navy-500 font-medium">
                    <span>Du : <strong className="text-navy-900">{formatDateDDMMYYYY(selectedStart)}</strong></span>
                    <span>Au : <strong className="text-navy-900">{formatDateDDMMYYYY(selectedEnd)}</strong></span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold border-t border-sand-100 pt-3 text-navy-900">
                    <span className="flex items-center space-x-1 font-light text-navy-500">
                      <span>{villa.pricePerNight.toLocaleString()} F × {nights} nuit{nights > 1 ? 's' : ''}</span>
                    </span>
                    <span className="text-lg font-serif font-bold text-azure-600">
                      {totalCost.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* User details form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block -mb-1">
                  2. Coordonnées de contact
                </label>
                
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom complet *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-sm py-3 px-3.5 rounded-xl border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Téléphone / WhatsApp *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full text-sm py-3 px-3.5 rounded-xl border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Adresse email *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full text-sm py-3 px-3.5 rounded-xl border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Message / Demandes particulières (Optionnel)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full text-sm py-3 px-3.5 rounded-xl border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50 resize-none"
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100 flex items-start space-x-1.5">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-azure-600 hover:bg-azure-500 disabled:bg-navy-300 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-azure-600/10 hover:shadow-lg active:scale-95 text-center flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    {isSubmitting ? "Soumission en cours..." : "Demander la réservation"}
                  </span>
                </button>

                {/* Bouton WhatsApp direct */}
                <div className="pt-3 border-t border-sand-100">
                  <a
                    href={`https://wa.me/2250172707000?text=Bonjour%20Palm%20aura,%20je%20souhaite%20des%20informations%20ou%20r%C3%A9server%20la%20${encodeURIComponent(villa.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 text-center flex items-center justify-center space-x-2 text-sm"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
                    <span>Discuter sur WhatsApp (+225 01 72 70 70 00)</span>
                  </a>
                </div>

                <p className="text-[10px] text-navy-400 text-center leading-relaxed font-light">
                  Aucun paiement immédiat n'est exigé en ligne. Le gestionnaire prendra contact avec vous directement pour finaliser.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && activeMedia === 'image' && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 text-white/85 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 border border-white/10 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left arrow */}
          {villa.images && villa.images.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => (prev === 0 ? villa.images.length - 1 : prev - 1));
              }}
              className="absolute left-6 z-50 text-white/85 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 border border-white/10 shadow-lg active:scale-95 cursor-pointer hidden sm:block"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right arrow */}
          {villa.images && villa.images.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(prev => (prev === villa.images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-6 z-50 text-white/85 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 border border-white/10 shadow-lg active:scale-95 cursor-pointer hidden sm:block"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main Image in Lightbox */}
          <div className="relative max-h-[85vh] max-w-[90vw] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={villa.images && villa.images.length > 0 ? villa.images[selectedImageIndex] : villa.imageUrl} 
              alt={villa.title}
              key={selectedImageIndex} // restart animation on switch
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10 select-none animate-fade-in"
            />
            {/* Index indicator */}
            {villa.images && villa.images.length > 1 && (
              <div className="mt-4 text-white/70 font-mono text-sm tracking-widest bg-white/5 border border-white/10 py-1.5 px-4 rounded-full select-none">
                {selectedImageIndex + 1} / {villa.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
