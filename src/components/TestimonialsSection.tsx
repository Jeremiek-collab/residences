import React, { useState } from 'react';
import { useBookings } from '../context/BookingContext';
import { Star, MessageSquarePlus, CheckCircle, X, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { reviews, addReview, villas } = useBookings();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [residenceId, setResidenceId] = useState('');
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addReview({
      name: name.trim(),
      location: location.trim() || undefined,
      rating,
      comment: comment.trim(),
      residenceId: residenceId || undefined
    });

    setSubmittedSuccess(true);
    setName('');
    setLocation('');
    setComment('');
    setResidenceId('');
    setRating(5);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsFormOpen(false);
    }, 2500);
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-10 border-t border-[#c5a880]/15 font-sans">
      {/* Header */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-[#c5a880] uppercase tracking-widest block font-sans">Témoignages</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">Ils ont séjourné chez nous</h2>
        
        {/* Rating summary */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <div className="flex items-center space-x-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="text-sm font-bold text-navy-900">{avgRating} / 5</span>
          <span className="text-xs text-navy-400 font-light">• ({reviews.length} avis vérifiés)</span>
        </div>

        {/* Action button to open review form */}
        <div className="pt-3">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#c5a880]" />
            <span>{isFormOpen ? "Fermer le formulaire" : "Laisser votre avis"}</span>
          </button>
        </div>
      </div>

      {/* Review Form Drawer / Card */}
      {isFormOpen && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#c5a880]/30 shadow-xl space-y-6 animate-fade-in-up text-left relative">
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute top-4 right-4 text-navy-400 hover:text-navy-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-sand-100 pb-3">
            <h3 className="font-serif text-xl font-bold text-navy-950 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#c5a880]" />
              <span>Donnez votre avis sur votre séjour</span>
            </h3>
            <p className="text-xs text-navy-500 font-light mt-1">
              Partagez votre expérience avec nos futurs voyageurs.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-emerald-950">Merci pour votre avis !</h4>
              <p className="text-xs text-emerald-800 font-light">
                Votre commentaire a été publié avec succès et s'affiche désormais sur le site.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-semibold text-navy-600 block mb-1.5">
                  Votre note générale *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-current'
                            : 'text-sand-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-navy-700 ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-navy-600 block mb-1">
                    Votre Nom / Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Franck A."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-navy-600 block mb-1">
                    Votre Ville / Pays (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Abidjan, CI"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                  />
                </div>
              </div>

              {/* Residence selector (optional) */}
              <div>
                <label className="text-xs font-semibold text-navy-600 block mb-1">
                  Résidence concernée (Optionnel)
                </label>
                <select
                  value={residenceId}
                  onChange={(e) => setResidenceId(e.target.value)}
                  className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                >
                  <option value="">Séjour général chez Palm aura</option>
                  {villas.map((villa) => (
                    <option key={villa.id} value={villa.id}>
                      {villa.title} ({villa.subtitle})
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-semibold text-navy-600 block mb-1">
                  Votre commentaire / Avis *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Racontez votre expérience, l'accueil, le confort de la résidence..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-azure-600 hover:bg-azure-500 text-white font-medium py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs text-center uppercase tracking-wider"
              >
                Publier mon avis
              </button>
            </form>
          )}
        </div>
      )}

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => {
          const linkedVilla = rev.residenceId ? villas.find(v => v.id === rev.residenceId) : null;
          return (
            <div
              key={rev.id}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-[#c5a880]/20 shadow-sm space-y-4 flex flex-col justify-between text-left hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-current' : 'text-sand-200'
                        }`}
                      />
                    ))}
                  </div>
                  {linkedVilla && (
                    <span className="text-[10px] bg-azure-50 text-azure-700 px-2 py-0.5 rounded-full font-medium">
                      {linkedVilla.title}
                    </span>
                  )}
                </div>

                {/* Comment quote */}
                <p className="text-sm text-navy-700 leading-relaxed italic font-sans">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-navy-950 font-sans">
                  {rev.name} {rev.location ? `(${rev.location})` : ''}
                </span>
                <span className="text-navy-400 font-light text-[10px]">
                  {formatDate(rev.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

function formatDate(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return 'Récemment';
  }
}
