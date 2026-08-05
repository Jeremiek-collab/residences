import { formatDateDDMMYYYY } from './dateUtils';

export interface ConfirmationEmailParams {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  villaName: string;
  startDate: string;
  endDate: string;
}

export const OFFICIAL_SITE_EMAIL = "yirekouassi@gmail.com";
export const OFFICIAL_SITE_WHATSAPP = "+225 01 72 70 70 00";
export const OFFICIAL_SITE_WHATSAPP_CLEAN = "2250172707000";
export const OFFICIAL_MAPS_LOCATION = "https://maps.google.com/?q=R%C3%A9sidences+Palm+Aura+Jacqueville";

/**
 * Envoie un email de confirmation officiel directement à l'adresse du client
 * au nom de Palm aura (yirekouassi@gmail.com)
 */
export async function sendOfficialConfirmationEmail(params: ConfirmationEmailParams): Promise<boolean> {
  const formattedStart = formatDateDDMMYYYY(params.startDate);
  const formattedEnd = formatDateDDMMYYYY(params.endDate);

  const emailPayload = {
    _replyto: OFFICIAL_SITE_EMAIL,
    to: params.clientEmail,
    client_name: params.clientName,
    villa_name: params.villaName,
    start_date: formattedStart,
    end_date: formattedEnd,
    subject: `Confirmation de réservation - ${params.villaName} | Palm aura Jacqueville`,
    message: `Bonjour ${params.clientName},

Nous avons le plaisir de vous informer que votre demande de réservation pour la résidence "${params.villaName}" à Jacqueville a été CONFIRMÉE par l'administration Palm aura.

Détails du séjour :
- Résidence : ${params.villaName}
- Dates : Du ${formattedStart} au ${formattedEnd}
- Emplacement : Jacqueville, Quartier Millionnaire Est
📍 Lien Google Maps : ${OFFICIAL_MAPS_LOCATION}

Pour toute question ou pour préparer votre arrivée, vous pouvez nous joindre directement au ${OFFICIAL_SITE_WHATSAPP} ou par email à ${OFFICIAL_SITE_EMAIL}.

Cordialement,
L'équipe Palm aura Jacqueville`
  };

  try {
    const response = await fetch("https://formspree.io/f/xknkyoky", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    return response.ok;
  } catch (error) {
    console.error("[Email API Service Error]:", error);
    return false;
  }
}

/**
 * Génère le lien Mailto officiel avec expéditeur yirekouassi@gmail.com
 */
export function getOfficialMailtoUrl(params: ConfirmationEmailParams): string {
  const formattedStart = formatDateDDMMYYYY(params.startDate);
  const formattedEnd = formatDateDDMMYYYY(params.endDate);

  const subject = encodeURIComponent(`Confirmation de votre réservation - ${params.villaName} | Palm aura Jacqueville`);
  const body = encodeURIComponent(
`Bonjour ${params.clientName},

Nous avons le plaisir de vous informer que votre demande de réservation pour la résidence "${params.villaName}" à Jacqueville a été CONFIRMÉE par l'administration Palm aura !

Détails de votre séjour :
----------------------------------------
- Résidence : ${params.villaName}
- Dates du séjour : Du ${formattedStart} au ${formattedEnd}
- Emplacement : Jacqueville, Quartier Millionnaire Est
📍 Localisation Google Maps : ${OFFICIAL_MAPS_LOCATION}

Notre équipe vous attend avec impatience ! Pour préparer votre arrivée ou pour toute question, vous pouvez nous contacter à tout moment par téléphone ou WhatsApp au ${OFFICIAL_SITE_WHATSAPP} ou par email à ${OFFICIAL_SITE_EMAIL}.

Cordialement,
L'équipe Palm aura Jacqueville
${OFFICIAL_SITE_EMAIL}`
  );
  return `mailto:${params.clientEmail}?cc=${OFFICIAL_SITE_EMAIL}&subject=${subject}&body=${body}`;
}

/**
 * Génère le lien d'envoi WhatsApp officiel depuis le numéro de contact Palm aura +225 01 72 70 70 00
 */
export function getOfficialWhatsAppUrl(params: ConfirmationEmailParams): string {
  const formattedStart = formatDateDDMMYYYY(params.startDate);
  const formattedEnd = formatDateDDMMYYYY(params.endDate);

  let cleanClientPhone = params.clientPhone ? params.clientPhone.replace(/\D/g, '') : '';
  if (cleanClientPhone.startsWith('0')) {
    cleanClientPhone = '225' + cleanClientPhone;
  } else if (cleanClientPhone.length === 10 && !cleanClientPhone.startsWith('225')) {
    cleanClientPhone = '225' + cleanClientPhone;
  }

  const text = encodeURIComponent(
`Bonjour ${params.clientName},

Nous avons le plaisir de vous informer que votre demande de réservation pour la résidence "${params.villaName}" (du ${formattedStart} au ${formattedEnd}) à Jacqueville a été CONFIRMÉE avec succès par l'administration Palm aura !

📍 Localisation Google Maps de la résidence :
${OFFICIAL_MAPS_LOCATION}

Pour préparer votre arrivée ou pour toute question, vous pouvez nous contacter directement au ${OFFICIAL_SITE_WHATSAPP}.

Cordialement,
L'équipe Palm aura Jacqueville`
  );

  return `https://wa.me/${cleanClientPhone}?text=${text}`;
}
