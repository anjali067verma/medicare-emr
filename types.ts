export enum AppointmentStatus {
  Confirmed = "Confirmed",
  Scheduled = "Scheduled",
  Upcoming = "Upcoming",
  Cancelled = "Cancelled",
  Completed = "Completed",
}

export enum AppointmentMode {
  InPerson = "In-Person",
  Video = "Video",
  Phone = "Phone",
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  doctorName: string;
  status: AppointmentStatus;
  mode: AppointmentMode;
  type: string; // e.g., "General Checkup"
}

export interface CreateAppointmentInput {
  patientName: string;
  date: string;
  time: string;
  duration: number;
  doctorName: string;
  mode: AppointmentMode;
  type: string;
}

export interface AppointmentFilters {
  date?: string;
  status?: AppointmentStatus;
  doctorName?: string;
}
