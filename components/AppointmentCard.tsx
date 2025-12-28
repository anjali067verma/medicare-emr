import React from "react";
import { Appointment, AppointmentStatus } from "../types";
import {
  MapPin,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  User,
  Activity,
} from "lucide-react";

interface Props {
  appointment: Appointment;
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentCard: React.FC<Props> = ({
  appointment,
  onStatusUpdate,
}) => {
  const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Confirmed:
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          badge: "bg-green-100 text-green-800",
        };
      case AppointmentStatus.Upcoming:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          badge: "bg-blue-100 text-blue-800",
        };
      case AppointmentStatus.Scheduled:
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          badge: "bg-purple-100 text-purple-800",
        };
      case AppointmentStatus.Cancelled:
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          badge: "bg-red-100 text-red-800",
        };
      case AppointmentStatus.Completed:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Video":
        return <Video className="w-3.5 h-3.5" />;
      case "Phone":
        return <Phone className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const styles = getStatusStyles(appointment.status);

  // Format Date for display (e.g., "Dec 28")
  const dateObj = new Date(appointment.date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden`}
    >
      <div className="flex flex-1 p-4 gap-4">
        {/* Time Column */}
        <div className="flex flex-col items-center justify-start pt-1 min-w-[60px]">
          <span className="text-lg font-bold text-gray-900 leading-none">
            {appointment.time}
          </span>
          <span className="text-xs font-medium text-gray-500 mt-1">
            {appointment.duration}m
          </span>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
            {dateStr}
          </div>
        </div>

        {/* Separator */}
        <div className="w-px bg-gray-100 self-stretch" />

        {/* Details Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900 truncate pr-2">
              {appointment.patientName}
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}
            >
              {appointment.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            {appointment.type}
          </p>

          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center text-xs text-gray-500 gap-2">
              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-gray-600">
                <User className="w-3 h-3" /> {appointment.doctorName}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-2">
              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-gray-600">
                {getModeIcon(appointment.mode)} {appointment.mode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {(appointment.status === "Scheduled" ||
        appointment.status === "Upcoming" ||
        appointment.status === "Confirmed") && (
        <div className="border-t border-gray-100 flex divide-x divide-gray-100 bg-gray-50/50">
          {appointment.status !== "Confirmed" && (
            <button
              onClick={() =>
                onStatusUpdate(appointment.id, AppointmentStatus.Confirmed)
              }
              className="flex-1 py-2.5 flex items-center justify-center text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Confirm
            </button>
          )}
          <button
            onClick={() =>
              onStatusUpdate(appointment.id, AppointmentStatus.Cancelled)
            }
            className="flex-1 py-2.5 flex items-center justify-center text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
};
