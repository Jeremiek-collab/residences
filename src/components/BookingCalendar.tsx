import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  villaId: string;
  bookedDates: string[]; // array of 'YYYY-MM-DD'
  onDateChange: (startDate: string | null, endDate: string | null) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookedDates,
  onDateChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Helper to format date as YYYY-MM-DD in local time
  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Get total days in month
  const getDaysInMonth = (y: number, m: number): number => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Get start day of month (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const getStartDayOfMonth = (y: number, m: number): number => {
    // We want Monday as 0, Sunday as 6
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check if date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is booked
  const isBooked = (date: Date): boolean => {
    const dateStr = formatDateString(date);
    return bookedDates.includes(dateStr);
  };

  // Check if range contains booked dates
  const doesRangeContainBooked = (start: Date, end: Date): boolean => {
    const current = new Date(start);
    while (current <= end) {
      if (isBooked(current)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  // Handle date click
  const handleDateClick = (dayNum: number) => {
    const clickedDate = new Date(year, month, dayNum);
    
    if (isPastDate(clickedDate) || isBooked(clickedDate)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // First click or reset
      setSelectedStart(clickedDate);
      setSelectedEnd(null);
      onDateChange(formatDateString(clickedDate), null);
    } else {
      // Second click
      if (clickedDate < selectedStart) {
        // Reset start if clicked date is before current start
        setSelectedStart(clickedDate);
        onDateChange(formatDateString(clickedDate), null);
      } else {
        // Check if there are booked dates in-between
        if (doesRangeContainBooked(selectedStart, clickedDate)) {
          // If range contains booked dates, reset start to clicked date
          setSelectedStart(clickedDate);
          onDateChange(formatDateString(clickedDate), null);
        } else {
          // Valid range selection
          setSelectedEnd(clickedDate);
          onDateChange(formatDateString(selectedStart), formatDateString(clickedDate));
        }
      }
    }
  };


  const isDateInRange = (date: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false;
    return date > selectedStart && date < selectedEnd;
  };

  // Build the grid
  const cells = [];
  
  // Empty slots for preceding month
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-10 sm:h-12 border border-transparent"></div>);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const past = isPastDate(thisDate);
    const booked = isBooked(thisDate);
    const inRange = isDateInRange(thisDate);
    const isStart = selectedStart && formatDateString(thisDate) === formatDateString(selectedStart);
    const isEnd = selectedEnd && formatDateString(thisDate) === formatDateString(selectedEnd);

    let cellClass = "h-10 sm:h-12 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative ";

    if (past) {
      cellClass += "text-navy-300 cursor-not-allowed bg-transparent";
    } else if (booked) {
      cellClass += "text-navy-300 line-through bg-sand-200 cursor-not-allowed";
    } else if (isStart) {
      cellClass += "bg-azure-600 text-white shadow-md shadow-azure-600/20";
    } else if (isEnd) {
      cellClass += "bg-azure-600 text-white shadow-md shadow-azure-600/20";
    } else if (inRange) {
      cellClass += "bg-azure-50 text-azure-700 hover:bg-azure-100 rounded-none";
    } else {
      cellClass += "text-navy-900 hover:bg-sand-100";
    }

    cells.push(
      <button
        key={`day-${d}`}
        type="button"
        disabled={past || booked}
        onClick={() => handleDateClick(d)}
        className={`${cellClass}`}
      >
        <span>{d}</span>
        {/* Visual dot indicator for check-in/out */}
        {isStart && !selectedEnd && (
          <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
        )}
      </button>
    );
  }

  const resetSelection = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    onDateChange(null, null);
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-sand-100 shadow-sm">
      {/* Month & Year header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-serif text-lg font-bold text-navy-900">
          {monthNames[month]} {year}
        </h4>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 hover:bg-sand-50 rounded-lg text-navy-600 border border-sand-100 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 hover:bg-sand-50 rounded-lg text-navy-600 border border-sand-100 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week days labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-xs font-semibold text-navy-400 py-1 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>

      {/* Booking selection status info */}
      <div className="mt-6 pt-4 border-t border-sand-100 text-xs flex flex-wrap items-center justify-between gap-3 text-navy-500">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 bg-white border border-sand-200 rounded-md block"></span>
            <span>Libre</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 bg-sand-200 line-through rounded-md block"></span>
            <span>Indisponible</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 bg-azure-600 rounded-md block"></span>
            <span>Sélectionné</span>
          </div>
        </div>
        {(selectedStart || selectedEnd) && (
          <button
            type="button"
            onClick={resetSelection}
            className="text-azure-600 font-semibold hover:text-azure-500 hover:underline"
          >
            Effacer
          </button>
        )}
      </div>
    </div>
  );
};
