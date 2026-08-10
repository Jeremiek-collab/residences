/**
 * Formatage universel des dates au format strict JJ/MM/AAAA (DD/MM/YYYY)
 */

export function formatDateDDMMYYYY(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';

  try {
    if (typeof dateInput === 'string') {
      // Si la date est déjà au format DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput.trim())) {
        return dateInput.trim();
      }

      // Si la date est au format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
        const [year, month, day] = dateInput.trim().split('-');
        return `${day}/${month}/${year}`;
      }

      // Pour les dates ISO ou chaînes compréhensibles par Date
      const parsedDate = new Date(dateInput);
      if (!isNaN(parsedDate.getTime())) {
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } else if (dateInput instanceof Date) {
      if (!isNaN(dateInput.getTime())) {
        const day = String(dateInput.getDate()).padStart(2, '0');
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const year = dateInput.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }
  } catch (e) {
    console.warn("Erreur de formatage de date:", e);
  }

  return String(dateInput);
}

/**
 * Formatage universel avec Heure : JJ/MM/AAAA à HH:mm
 */
export function formatDateTimeDDMMYYYY(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} à ${hours}:${minutes}`;
    }
  } catch (e) {}
  return formatDateDDMMYYYY(dateInput);
}

/**
 * Analyse universelle des dates (compatible YYYY-MM-DD et JJ/MM/AAAA)
 */
function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const str = dateStr.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // DD/MM/YYYY ou DD-MM-YYYY
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(str)) {
    const parts = str.split(/[\/\-]/).map(Number);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calcule exactement le nombre de nuits entre deux dates (quelle que soit leur écriture)
 */
export function calculateNightsBetween(startStr: string, endStr: string): number {
  const start = parseFlexibleDate(startStr);
  const end = parseFlexibleDate(endStr);
  if (!start || !end) return 0;
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
