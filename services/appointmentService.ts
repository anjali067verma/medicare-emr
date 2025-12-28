import { Appointment, AppointmentFilters, AppointmentStatus, AppointmentMode, CreateAppointmentInput } from '../types';

/**
 * NOTE: This file is the TypeScript equivalent of the `appointment_service.py` file.
 * It is used to make the React application functional in the browser environment
 * where Python cannot be executed directly.
 */

// 1. Data Mocking
let mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Rajesh Kumar',
    date: '2025-12-28', // Today's mock date
    time: '09:00',
    duration: 30,
    doctorName: 'Dr. Sarah Johnson',
    status: AppointmentStatus.Upcoming,
    mode: AppointmentMode.InPerson,
    type: 'General Checkup'
  },
  {
    id: '2',
    patientName: 'Priya Sharma',
    date: '2025-12-28',
    time: '09:30',
    duration: 30,
    doctorName: 'Dr. Michael Chen',
    status: AppointmentStatus.Upcoming,
    mode: AppointmentMode.Video,
    type: 'Follow-up'
  },
  {
    id: '3',
    patientName: 'Amit Patel',
    date: '2025-12-28',
    time: '10:00',
    duration: 45,
    doctorName: 'Dr. Sarah Johnson',
    status: AppointmentStatus.Completed,
    mode: AppointmentMode.InPerson,
    type: 'Lab Results'
  },
  {
    id: '4',
    patientName: 'Sneha Reddy',
    date: '2025-12-28',
    time: '10:30',
    duration: 30,
    doctorName: 'Dr. David Lee',
    status: AppointmentStatus.Upcoming,
    mode: AppointmentMode.Video,
    type: 'Consultation'
  },
  {
    id: '5',
    patientName: 'Vikram Singh',
    date: '2025-12-28',
    time: '11:00',
    duration: 60,
    doctorName: 'Dr. Emily White',
    status: AppointmentStatus.Cancelled,
    mode: AppointmentMode.InPerson,
    type: 'Surgery Prep'
  },
  {
    id: '6',
    patientName: 'John Doe',
    date: '2025-12-29',
    time: '09:00',
    duration: 30,
    doctorName: 'Dr. Sarah Johnson',
    status: AppointmentStatus.Scheduled,
    mode: AppointmentMode.InPerson,
    type: 'General Checkup'
  },
  {
    id: '7',
    patientName: 'Jane Smith',
    date: '2025-12-27',
    time: '14:00',
    duration: 30,
    doctorName: 'Dr. Michael Chen',
    status: AppointmentStatus.Completed,
    mode: AppointmentMode.Phone,
    type: 'Consultation'
  },
  {
    id: '8',
    patientName: 'Robert Brown',
    date: '2025-12-30',
    time: '11:00',
    duration: 45,
    doctorName: 'Dr. Sarah Johnson',
    status: AppointmentStatus.Scheduled,
    mode: AppointmentMode.InPerson,
    type: 'Physical Therapy'
  },
  {
    id: '9',
    patientName: 'Emily Davis',
    date: '2025-12-28',
    time: '15:00',
    duration: 30,
    doctorName: 'Dr. Sarah Johnson',
    status: AppointmentStatus.Confirmed,
    mode: AppointmentMode.Video,
    type: 'Follow-up'
  },
  {
    id: '10',
    patientName: 'Michael Wilson',
    date: '2025-12-28',
    time: '16:00',
    duration: 30,
    doctorName: 'Dr. David Lee',
    status: AppointmentStatus.Scheduled,
    mode: AppointmentMode.InPerson,
    type: 'Dental Checkup'
  },
  {
    id: '11',
    patientName: 'Sarah Connor',
    date: '2025-12-28',
    time: '13:00',
    duration: 15,
    doctorName: 'Dr. Emily White',
    status: AppointmentStatus.Scheduled,
    mode: AppointmentMode.InPerson,
    type: 'Urgent Care - Stitches'
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for time calculation (Same as parse_time_minutes in Python)
const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// 2. Query Function
export const get_appointments = async (filters: AppointmentFilters = {}): Promise<Appointment[]> => {
  await delay(300); // Simulate network latency

  return mockAppointments.filter(app => {
    let matches = true;
    if (filters.date && app.date !== filters.date) matches = false;
    if (filters.status && app.status !== filters.status) matches = false;
    if (filters.doctorName && app.doctorName !== filters.doctorName) matches = false;
    return matches;
  });
};

// 3. Mutation Function
export const update_appointment_status = async (id: string, new_status: AppointmentStatus): Promise<Appointment> => {
  await delay(300);
  
  const index = mockAppointments.findIndex(a => a.id === id);
  if (index === -1) throw new Error("Appointment not found");

  mockAppointments[index] = { ...mockAppointments[index], status: new_status };
  return mockAppointments[index];
};

// 4. Create Function
export const create_appointment = async (payload: CreateAppointmentInput): Promise<Appointment> => {
  await delay(500);

  // Validation
  // Added 'type' to validation as per Python implementation
  if (!payload.patientName || !payload.date || !payload.time || !payload.duration || !payload.doctorName || !payload.mode || !payload.type) {
    throw new Error("Missing required fields");
  }

  // Overlap Detection
  // Logic: (NewStart < ExistingEnd) and (NewEnd > ExistingStart)
  const newStart = parseTime(payload.time);
  const newEnd = newStart + payload.duration;

  const hasConflict = mockAppointments.some(app => {
    if (app.doctorName !== payload.doctorName) return false;
    if (app.date !== payload.date) return false;
    if (app.status === AppointmentStatus.Cancelled) return false;

    const existingStart = parseTime(app.time);
    const existingEnd = existingStart + app.duration;

    return (newStart < existingEnd && newEnd > existingStart);
  });

  if (hasConflict) {
    throw new Error(`Time conflict detected with existing appointment for ${payload.doctorName}`);
  }

  const newAppointment: Appointment = {
    id: Math.random().toString(36).substr(2, 9),
    ...payload,
    status: AppointmentStatus.Scheduled // Default status
  };

  mockAppointments.push(newAppointment);
  return newAppointment;
};