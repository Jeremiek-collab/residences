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
