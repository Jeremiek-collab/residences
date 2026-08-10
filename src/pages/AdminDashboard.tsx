import React, { useState, useMemo } from 'react';
import { useBookings } from '../context/BookingContext';
import { 
  sendOfficialConfirmationEmail, getOfficialMailtoUrl, getOfficialWhatsAppUrl,
  OFFICIAL_SITE_EMAIL, OFFICIAL_SITE_WHATSAPP, OFFICIAL_MAPS_LOCATION
} from '../utils/emailService';
import { formatDateDDMMYYYY, formatDateTimeDDMMYYYY } from '../utils/dateUtils';
import { 
  Lock, Calendar, FileText, Settings, X, Trash2, ShieldCheck, Info, Plus, Mail, MessageCircle, Send, Edit2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    villas, bookings, addBooking, updateBookingStatus, updateBookingPricing, deleteBooking, blockDatesManually 
  } = useBookings();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'block' | 'catalog'>('bookings');

  // Block Dates Form State
  const [selectedVillaId, setSelectedVillaId] = useState(villas[0]?.id || '');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockSuccess, setBlockSuccess] = useState('');
  const [blockError, setBlockError] = useState('');

  // Email Notification Modal State
  const [emailModalBooking, setEmailModalBooking] = useState<{ booking: any; villaName: string } | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Pricing Edit Modal State
  const [editingPricingBooking, setEditingPricingBooking] = useState<any | null>(null);
  const [editTotalPrice, setEditTotalPrice] = useState<number>(0);
  const [editAdvancePaid, setEditAdvancePaid] = useState<number>(0);

  // Manual Add Booking Modal State
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [newVillaId, setNewVillaId] = useState(villas[0]?.id || 'residence-1');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newTotalPrice, setNewTotalPrice] = useState<number>(30000);
  const [newAdvancePaid, setNewAdvancePaid] = useState<number>(20000);
  const [newNotes, setNewNotes] = useState('');

  const triggerDirectEmail = async (b: any, villaName: string) => {
    updateBookingStatus(b.id, 'confirmed');
    setIsSendingEmail(true);
    setToastMessage(`Envoi de l'email officiel depuis ${OFFICIAL_SITE_EMAIL}...`);

    const sent = await sendOfficialConfirmationEmail({
      clientName: b.clientName,
      clientEmail: b.clientEmail,
      clientPhone: b.clientPhone,
      villaName,
      startDate: b.startDate,
      endDate: b.endDate,
      totalPrice: b.totalPrice,
      advancePaid: b.advancePaid || 0
    });

    setIsSendingEmail(false);
    if (sent) {
      setToastMessage(`✓ Email de confirmation transmis avec succès à ${b.clientEmail} !`);
    } else {
      setToastMessage(`📧 Mode de secours : Ouverture de votre messagerie (${OFFICIAL_SITE_EMAIL})...`);
      window.location.href = getOfficialMailtoUrl({
        clientName: b.clientName,
        clientEmail: b.clientEmail,
        clientPhone: b.clientPhone,
        villaName,
        startDate: b.startDate,
        endDate: b.endDate
      });
    }
    setTimeout(() => setToastMessage(''), 7000);
  };

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jacqueville2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Mot de passe incorrect. Réessayez.');
    }
  };

  // Block Dates handler
  const handleBlockDates = (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError('');
    setBlockSuccess('');

    if (!selectedVillaId || !blockStart || !blockEnd || !blockReason.trim()) {
      setBlockError('Tous les champs sont requis.');
      return;
    }

    const start = new Date(blockStart);
    const end = new Date(blockEnd);

    if (start >= end) {
      setBlockError("La date de fin doit être après la date de début.");
      return;
    }

    blockDatesManually(selectedVillaId, blockStart, blockEnd, blockReason);
    setBlockSuccess('Dates bloquées avec succès.');
    setBlockStart('');
    setBlockEnd('');
    setBlockReason('');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    
    // Revenue simulation (only confirmed ones)
    const revenue = bookings
      .filter(b => b.status === 'confirmed' && b.totalPrice > 0)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return { total, pending, confirmed, revenue };
  }, [bookings]);

  // Split normal bookings and admin blockings
  const normalBookings = useMemo(() => {
    return bookings.filter(b => b.clientEmail !== 'admin@residences.com');
  }, [bookings]);

  const adminBlockings = useMemo(() => {
    return bookings.filter(b => b.clientEmail === 'admin@residences.com' && b.status !== 'cancelled');
  }, [bookings]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-24 px-4">
        <div className="bg-white p-8 rounded-3xl border border-sand-150 shadow-md space-y-6 text-center">
          <div className="w-14 h-14 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-navy-900">Accès Administrateur</h2>
            <p className="text-xs text-navy-500 font-light">
              Entrez le mot de passe gestionnaire pour accéder au tableau de bord.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <input
                type="password"
                placeholder="Mot de passe *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm py-3 px-3.5 rounded-xl border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
              />
              <span className="text-[10px] text-navy-400 block mt-1">Hint: jacqueville2026</span>
            </div>
            {authError && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg text-center border border-red-100">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-md"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-sand-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">Tableau de Bord Gestionnaire</h1>
            <p className="text-xs text-navy-700 font-semibold mt-0.5">Gérez vos locations saisonnières et réservations à Jacqueville.</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs font-semibold border border-sand-200 bg-white hover:bg-sand-50 text-navy-700 py-2.5 px-4 rounded-xl transition-colors active:scale-95"
        >
          Déconnexion
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-sand-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-navy-400 block uppercase">Total Demandes</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-navy-900">{stats.total}</span>
            <span className="text-[10px] text-navy-500 font-semibold bg-sand-50 px-2 py-0.5 rounded-full">Reçues</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-sand-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-navy-400 block uppercase">En Attente</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">{stats.pending}</span>
            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">À traiter</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-sand-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-navy-400 block uppercase">Confirmées</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-600">{stats.confirmed}</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Validées</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-sand-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-navy-400 block uppercase">Chiffre d'Affaires</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-azure-600">
              {stats.revenue.toLocaleString()} F
            </span>
            <span className="text-[10px] text-azure-600 font-semibold bg-azure-50 px-2 py-0.5 rounded-full">Confirmé</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-sand-300">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center space-x-2 py-3.5 px-6 text-xs sm:text-sm font-bold tracking-wide border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-navy-950 text-navy-950 font-extrabold bg-sand-100/60 rounded-t-xl'
              : 'border-transparent text-navy-600 hover:text-navy-950'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Demandes clients ({normalBookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('block')}
          className={`flex items-center space-x-2 py-3.5 px-6 text-xs sm:text-sm font-bold tracking-wide border-b-2 transition-colors ${
            activeTab === 'block'
              ? 'border-navy-950 text-navy-950 font-extrabold bg-sand-100/60 rounded-t-xl'
              : 'border-transparent text-navy-600 hover:text-navy-950'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bloquer des dates ({adminBlockings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center space-x-2 py-3.5 px-6 text-xs sm:text-sm font-bold tracking-wide border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-navy-950 text-navy-950 font-extrabold bg-sand-100/60 rounded-t-xl'
              : 'border-transparent text-navy-600 hover:text-navy-950'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Tarifs & Catalogue</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        
        {/* PANEL: Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-sand-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sand-100 bg-sand-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-900">Demandes de Réservations</h3>
                <p className="text-xs text-navy-500 leading-normal">
                  Consultez, confirmez ou ajoutez manuellement vos réservations clients.
                </p>
              </div>
              <button
                onClick={() => setIsAddBookingModalOpen(true)}
                className="bg-azure-600 hover:bg-azure-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter manuellement une réservation</span>
              </button>
            </div>
            
            {normalBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sand-100/90 text-navy-950 text-xs font-bold border-b border-sand-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Villa</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Séjour & Dates</th>
                      <th className="px-6 py-4">Tarif Total</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100 text-navy-800">
                    {normalBookings.map((b) => {
                      const villaName = villas.find(v => v.id === b.villaId)?.title || "Villa supprimée";
                      return (
                        <tr key={b.id} className="hover:bg-sand-50/30">
                          {/* Villa */}
                          <td className="px-6 py-4 font-semibold text-navy-950">{villaName}</td>
                          {/* Client details */}
                          <td className="px-6 py-4 space-y-1">
                            <div className="font-semibold">{b.clientName}</div>
                            <div className="text-xs text-navy-500">{b.clientPhone}</div>
                            <div className="text-xs text-navy-500">{b.clientEmail}</div>
                            {b.notes && (
                              <div className="text-xs italic text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 max-w-xs block mt-1">
                                "{b.notes}"
                              </div>
                            )}
                          </td>
                          {/* Dates */}
                          <td className="px-6 py-4 space-y-1 text-xs">
                            <div className="flex items-center space-x-1 text-navy-950 font-semibold">
                              <span>Du {formatDateDDMMYYYY(b.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-navy-950 font-semibold">
                              <span>Au {formatDateDDMMYYYY(b.endDate)}</span>
                            </div>
                            {b.createdAt && (
                              <div className="text-[11px] text-navy-500 font-normal italic pt-1 border-t border-sand-100 mt-1">
                                Demandée le : {formatDateTimeDDMMYYYY(b.createdAt)}
                              </div>
                            )}
                          </td>
                          {/* Price & Advance */}
                          <td className="px-6 py-4 space-y-1 text-xs">
                            <div className="font-serif font-bold text-azure-700">
                              Total : {b.totalPrice.toLocaleString()} FCFA
                            </div>
                            <div className="text-emerald-700 font-semibold">
                              Avance : {(b.advancePaid || 0).toLocaleString()} FCFA
                            </div>
                            <div className="text-amber-800 font-bold">
                              Reste : {Math.max(0, b.totalPrice - (b.advancePaid || 0)).toLocaleString()} FCFA
                            </div>
                            <button
                              onClick={() => {
                                setEditingPricingBooking(b);
                                setEditTotalPrice(b.totalPrice);
                                setEditAdvancePaid(b.advancePaid || 0);
                              }}
                              className="inline-flex items-center space-x-1 text-[11px] font-bold text-azure-700 hover:text-azure-900 bg-azure-50 hover:bg-azure-100 px-2 py-1 rounded border border-azure-200 mt-1 cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>✏️ Modifier tarifs</span>
                            </button>
                          </td>
                          {/* Status */}
                          <td className="px-6 py-4">
                            {b.status === 'pending' && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
                                En attente
                              </span>
                            )}
                            {b.status === 'confirmed' && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                                Confirmé
                              </span>
                            )}
                            {b.status === 'cancelled' && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full uppercase">
                                Annulé
                              </span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {b.status === 'pending' && (
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => triggerDirectEmail(b, villaName)}
                                    disabled={isSendingEmail}
                                    className="px-2.5 py-1.5 bg-azure-600 hover:bg-azure-500 disabled:bg-navy-300 text-white rounded-lg transition-all text-xs font-semibold flex items-center space-x-1 shadow-sm cursor-pointer"
                                    title={`Confirmer et envoyer l'e-mail officiel depuis ${OFFICIAL_SITE_EMAIL}`}
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Envoyer Mail ({OFFICIAL_SITE_EMAIL})</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateBookingStatus(b.id, 'confirmed');
                                      setToastMessage(`💬 WhatsApp officiel (${OFFICIAL_SITE_WHATSAPP}) ouvert pour ${b.clientPhone}...`);
                                      const url = getOfficialWhatsAppUrl({
                                        clientName: b.clientName,
                                        clientEmail: b.clientEmail,
                                        clientPhone: b.clientPhone,
                                        villaName,
                                        startDate: b.startDate,
                                        endDate: b.endDate,
                                        totalPrice: b.totalPrice,
                                        advancePaid: b.advancePaid || 0
                                      });
                                      window.open(url, '_blank');
                                    }}
                                    className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg transition-all text-xs font-semibold flex items-center space-x-1 shadow-sm cursor-pointer"
                                    title={`Confirmer et contacter le client depuis le WhatsApp officiel ${OFFICIAL_SITE_WHATSAPP}`}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                    <span>WhatsApp ({OFFICIAL_SITE_WHATSAPP})</span>
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Rejeter la réservation"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              {b.status === 'confirmed' && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setEmailModalBooking({ booking: b, villaName })}
                                    className="p-1.5 bg-azure-50 hover:bg-azure-100 text-azure-600 rounded-lg transition-colors text-xs font-medium flex items-center space-x-1"
                                    title="Voir / Renvoyer l'e-mail de confirmation"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>E-mail</span>
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                    className="text-xs text-red-600 hover:text-red-500 hover:underline px-1.5 py-1"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm("Supprimer définitivement cette demande de la base ?")) {
                                    deleteBooking(b.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-sand-100 text-navy-400 hover:text-red-500 rounded-lg transition-colors"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-navy-400 font-light">
                <Info className="w-8 h-8 mx-auto mb-2 text-navy-300" />
                <span>Aucune demande de réservation trouvée.</span>
              </div>
            )}
          </div>
        )}

        {/* PANEL: Block Dates */}
        {activeTab === 'block' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Block Form */}
            <form 
              onSubmit={handleBlockDates}
              className="lg:col-span-4 bg-white p-6 rounded-3xl border border-sand-100 shadow-sm space-y-4"
            >
              <h3 className="font-serif text-lg font-bold text-navy-900 border-b border-sand-100 pb-3">
                Bloquer des dates (Entretien)
              </h3>
              
              <div>
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1.5">Villa *</label>
                <select
                  value={selectedVillaId}
                  onChange={(e) => setSelectedVillaId(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50 cursor-pointer font-medium"
                >
                  {villas.map((v) => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1.5">Date de début *</label>
                <input
                  type="date"
                  required
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1.5">Date de fin *</label>
                <input
                  type="date"
                  required
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block mb-1.5">Raison du blocage *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Travaux peinture piscine, maintenance..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-lg border border-sand-150 focus:outline-none focus:border-azure-500 text-navy-900 bg-sand-50"
                />
              </div>

              {blockError && (
                <div className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {blockError}
                </div>
              )}
              {blockSuccess && (
                <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  {blockSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Bloquer les dates</span>
              </button>
            </form>

            {/* Blockings List */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-sand-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-sand-100 bg-sand-50/50">
                <h3 className="font-serif text-lg font-bold text-navy-900">Dates Bloquées Actives</h3>
                <p className="text-xs text-navy-500">
                  Ci-dessous la liste des blocages manuels posés par l'administration. Les clients ne pourront pas sélectionner ces dates.
                </p>
              </div>

              {adminBlockings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-sand-50 text-navy-500 text-xs font-semibold border-b border-sand-100 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Villa</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4">Raison</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100 text-navy-800">
                      {adminBlockings.map((block) => {
                        const villaName = villas.find(v => v.id === block.villaId)?.title || "Villa supprimée";
                        return (
                          <tr key={block.id} className="hover:bg-sand-50/30">
                            <td className="px-6 py-4 font-semibold text-navy-950">{villaName}</td>
                            <td className="px-6 py-4 text-xs font-medium space-y-0.5">
                              <div>Du {block.startDate}</div>
                              <div>Au {block.endDate}</div>
                            </td>
                            <td className="px-6 py-4 text-xs text-navy-600 italic">
                              "{block.notes}"
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => deleteBooking(block.id)}
                                className="text-xs text-red-600 hover:text-red-500 hover:underline flex items-center space-x-1 justify-end ml-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                <span>Libérer</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-navy-400 font-light">
                  <Info className="w-8 h-8 mx-auto mb-2 text-navy-300" />
                  <span>Aucun blocage de date actuellement posé.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL: Catalog Settings */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl border border-sand-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sand-100 bg-sand-50/50">
              <h3 className="font-serif text-lg font-bold text-navy-900">Tarifs & Catalogue</h3>
              <p className="text-xs text-navy-500">
                Consultez et gérez les tarifs par nuitée des différentes résidences et villas.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand-50 text-navy-500 text-xs font-semibold border-b border-sand-100 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Villa</th>
                    <th className="px-6 py-4">Emplacement</th>
                    <th className="px-6 py-4">Capacité / Chambres</th>
                    <th className="px-6 py-4">Tarif / Nuitée</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 text-navy-800">
                  {villas.map((v) => (
                    <tr key={v.id} className="hover:bg-sand-50/30">
                      <td className="px-6 py-4 font-semibold text-navy-950">{v.title}</td>
                      <td className="px-6 py-4 text-xs text-navy-500">{v.location}</td>
                      <td className="px-6 py-4 text-xs">
                        {v.capacity} Voyageurs &bull; {v.bedrooms} Chambres
                      </td>
                      <td className="px-6 py-4 font-serif font-bold text-azure-600">
                        {v.pricePerNight.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 text-right text-xs">
                        <span className="text-navy-400 font-light italic">Modification locale simulée</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Toast alert banner */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center space-x-3 animate-fade-in-up">
            <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-white/60 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Confirmation Email Modal */}
        {emailModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-100 animate-fade-in-up relative text-left">
              <button
                onClick={() => setEmailModalBooking(null)}
                className="absolute top-5 right-5 text-navy-400 hover:text-navy-950 p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 border-b border-sand-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-navy-950">E-mail de confirmation client</h3>
                  <p className="text-xs text-emerald-600 font-semibold">Statut : CONFIRMÉ (Actif)</p>
                </div>
              </div>

              {/* Email template preview card */}
              <div className="bg-sand-50/80 rounded-2xl p-5 border border-sand-200 text-xs text-navy-800 space-y-3 font-mono">
                <div className="border-b border-sand-200 pb-2 space-y-1">
                  <p><span className="text-navy-400 font-sans font-semibold">De :</span> <strong className="text-azure-700 font-sans">Palm aura Jacqueville &lt;{OFFICIAL_SITE_EMAIL}&gt;</strong></p>
                  <p><span className="text-navy-400 font-sans font-semibold">À :</span> <strong className="text-navy-950 font-sans">{emailModalBooking.booking.clientEmail}</strong></p>
                  <p><span className="text-navy-400 font-sans font-semibold">Objet :</span> <strong className="text-navy-950 font-sans">Confirmation de réservation - {emailModalBooking.villaName} | Palm aura Jacqueville</strong></p>
                </div>

                <div className="space-y-2 leading-relaxed font-sans text-navy-700">
                  <p className="font-semibold text-navy-950">Bonjour {emailModalBooking.booking.clientName},</p>
                  <p>
                    Nous avons le plaisir de vous confirmer que votre demande de réservation pour la résidence <strong>{emailModalBooking.villaName}</strong> à Jacqueville est <strong>CONFIRMÉE</strong> !
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-sand-150 space-y-1 my-2">
                    <p>• <strong>Résidence :</strong> {emailModalBooking.villaName}</p>
                    <p>• <strong>Dates du séjour :</strong> Du {formatDateDDMMYYYY(emailModalBooking.booking.startDate)} au {formatDateDDMMYYYY(emailModalBooking.booking.endDate)}</p>
                    <p>• <strong>Emplacement :</strong> Jacqueville, Quartier Millionnaire Est</p>
                    <p>📍 <strong>Localisation Google Maps :</strong> <a href={OFFICIAL_MAPS_LOCATION} target="_blank" rel="noopener noreferrer" className="text-azure-600 underline">Résidences Palm Aura Jacqueville</a></p>
                  </div>
                  <p>
                    Pour toute question ou pour finaliser les détails de votre accueil, vous pouvez nous joindre directement par téléphone/WhatsApp au <strong>{OFFICIAL_SITE_WHATSAPP}</strong>.
                  </p>
                  <p className="pt-2 text-navy-500 font-light italic">Cordialement,<br/>L'équipe Palm aura Jacqueville ({OFFICIAL_SITE_EMAIL})</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => triggerDirectEmail(emailModalBooking.booking, emailModalBooking.villaName)}
                  disabled={isSendingEmail}
                  className="flex-1 bg-azure-600 hover:bg-azure-500 disabled:bg-navy-300 text-white py-3 px-4 rounded-xl text-xs font-semibold text-center flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer directement depuis {OFFICIAL_SITE_EMAIL}</span>
                </button>
                <a
                  href={getOfficialWhatsAppUrl({
                    clientName: emailModalBooking.booking.clientName,
                    clientEmail: emailModalBooking.booking.clientEmail,
                    clientPhone: emailModalBooking.booking.clientPhone,
                    villaName: emailModalBooking.villaName,
                    startDate: emailModalBooking.booking.startDate,
                    endDate: emailModalBooking.booking.endDate
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl text-xs font-semibold text-center flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Officiel ({OFFICIAL_SITE_WHATSAPP})</span>
                </a>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => setEmailModalBooking(null)}
                  className="text-xs text-navy-500 hover:text-navy-900 font-medium underline"
                >
                  Fermer la fenêtre
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Advance Edit Modal */}
        {editingPricingBooking && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-100 animate-fade-in-up relative text-left">
              <button
                onClick={() => setEditingPricingBooking(null)}
                className="absolute top-5 right-5 text-navy-400 hover:text-navy-950 p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 border-b border-sand-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-azure-50 border border-azure-100 flex items-center justify-center text-azure-600">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-navy-950">Modifier Tarifs & Avance</h3>
                  <p className="text-xs text-navy-500 font-semibold">{editingPricingBooking.clientName}</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBookingPricing(editingPricingBooking.id, editTotalPrice, editAdvancePaid);
                  setEditingPricingBooking(null);
                  setToastMessage("Tarif total et avance reçue enregistrés avec succès.");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    Tarif Total du séjour (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editTotalPrice}
                    onChange={(e) => setEditTotalPrice(Number(e.target.value))}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 font-semibold text-navy-950 bg-sand-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    Avance reçue du client (Wave, etc.) (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editAdvancePaid}
                    onChange={(e) => setEditAdvancePaid(Number(e.target.value))}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 font-semibold text-emerald-700 bg-emerald-50/50"
                  />
                </div>

                <div className="bg-sand-50 p-3.5 rounded-xl border border-sand-150 space-y-1 text-xs">
                  <div className="flex justify-between text-navy-600">
                    <span>Tarif Total :</span>
                    <span className="font-bold text-navy-950">{editTotalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Avance reçue :</span>
                    <span className="font-bold">{editAdvancePaid.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-amber-800 font-bold border-t border-sand-200 pt-1.5 mt-1 text-sm">
                    <span>Reste à payer :</span>
                    <span>{Math.max(0, editTotalPrice - editAdvancePaid).toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="pt-2 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingPricingBooking(null)}
                    className="flex-1 py-2.5 px-4 border border-sand-200 rounded-xl text-xs font-semibold text-navy-700 hover:bg-sand-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-azure-600 hover:bg-azure-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-md"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Manual Add Booking Modal */}
        {isAddBookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-100 animate-fade-in-up relative text-left">
              <button
                onClick={() => setIsAddBookingModalOpen(false)}
                className="absolute top-5 right-5 text-navy-400 hover:text-navy-950 p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 border-b border-sand-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-azure-50 border border-azure-100 flex items-center justify-center text-azure-600">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-navy-950">Ajouter une réservation</h3>
                  <p className="text-xs text-navy-500 font-semibold">Enregistrer un client directement</p>
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await addBooking({
                      villaId: newVillaId,
                      clientName: newClientName,
                      clientEmail: newClientEmail || "client@email.com",
                      clientPhone: newClientPhone,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      totalPrice: Number(newTotalPrice),
                      advancePaid: Number(newAdvancePaid),
                      notes: newNotes
                    });

                    setIsAddBookingModalOpen(false);
                    setToastMessage(`Réservation de ${newClientName} ajoutée avec succès.`);
                    setNewClientName('');
                    setNewClientEmail('');
                    setNewClientPhone('');
                    setNewNotes('');
                  } catch (err: any) {
                    alert(err.message || "Erreur lors de l'ajout.");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    Résidence choisie *
                  </label>
                  <select
                    value={newVillaId}
                    onChange={(e) => setNewVillaId(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 font-semibold text-navy-950 bg-sand-50"
                  >
                    {villas.map(v => (
                      <option key={v.id} value={v.id}>{v.title} ({v.pricePerNight.toLocaleString()} FCFA/nuit)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Nom complet du client *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Jean Kouassi"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +225 0102030405"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    Adresse e-mail (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="client@email.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Date d'arrivée *
                    </label>
                    <input
                      type="date"
                      required
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Date de départ *
                    </label>
                    <input
                      type="date"
                      required
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Tarif Total (FCFA) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newTotalPrice}
                      onChange={(e) => setNewTotalPrice(Number(e.target.value))}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 font-semibold text-navy-950 bg-sand-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      Avance reçue (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newAdvancePaid}
                      onChange={(e) => setNewAdvancePaid(Number(e.target.value))}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 font-semibold text-emerald-700 bg-emerald-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    Notes / Remarques
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Caution versée par Wave"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-sand-200 focus:outline-none focus:border-azure-500 text-navy-950 bg-sand-50"
                  />
                </div>

                <div className="pt-2 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddBookingModalOpen(false)}
                    className="flex-1 py-2.5 px-4 border border-sand-200 rounded-xl text-xs font-semibold text-navy-700 hover:bg-sand-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-azure-600 hover:bg-azure-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-md"
                  >
                    Enregistrer la réservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


