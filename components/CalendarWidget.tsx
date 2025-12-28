import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const CalendarWidget: React.FC<Props> = ({
  selectedDate,
  onDateSelect,
}) => {
  // Initialize view based on selectedDate (YYYY-MM-DD)
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, 1);
  });

  // Helper to change month
  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate);
  };

  // Helper date calculations
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Render constants
  const currentMonthName = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(viewDate);
  const startDayOffset = getFirstDayOfMonth(viewDate); // 0 = Sunday, 1 = Monday, etc.

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // We treat Dec 28, 2025 as "Today" for this assignment
  const MOCK_TODAY_STR = "2025-12-28";

  const handleDateClick = (day: number) => {
    const year = viewDate.getFullYear();
    const month = (viewDate.getMonth() + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${dayStr}`;
    onDateSelect(formattedDate);
  };

  const jumpToToday = () => {
    const [y, m] = MOCK_TODAY_STR.split("-").map(Number);
    // Update view to December 2025
    setViewDate(new Date(y, m - 1, 1));
    // Select the specific date
    onDateSelect(MOCK_TODAY_STR);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{currentMonthName}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(startDayOffset)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
        {dates.map((day) => {
          // Construct date string for this specific cell to compare with selection
          const cellYear = viewDate.getFullYear();
          const cellMonth = (viewDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const cellDay = day.toString().padStart(2, "0");
          const cellDateStr = `${cellYear}-${cellMonth}-${cellDay}`;

          const isSelected = selectedDate === cellDateStr;
          const isToday = cellDateStr === MOCK_TODAY_STR;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${
                  !isSelected && isToday
                    ? "border border-blue-600 text-blue-600 font-medium"
                    : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <button
          onClick={jumpToToday}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 w-full text-center"
        >
          Jump to Today
        </button>
      </div>
    </div>
  );
};
