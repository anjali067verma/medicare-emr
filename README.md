# MediCare EMR - Appointment & Queue Management

This repository contains the implementation for the "Appointment Scheduling and Queue Management" feature (Feature B). It provides a full-stack experience with a React frontend and a Python backend implementation of the core business logic.

## 🛠 Prerequisites

- **Node.js** (v18 or higher) - Required to run the React Frontend.
- **Python** (v3.8 or higher) - Required to run the backend logic script.

## 🚀 Quick Start

### 1. Frontend (React Application)

The frontend simulates a complete user experience in the browser.

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### 2. Backend (Python Service)

The `appointment_service.py` file contains the canonical implementation of the business logic, data models, and conflict detection algorithms as required by the assessment.

To run the service and its built-in verification test suite:

```bash
# Run the python script
python appointment_service.py
```

This script acts as the server implementation. When executed directly, it runs a "Test Suite" that demonstrates:

1.  **Fetching**: Retrieving a list of existing appointments.
2.  **Creation**: Successfully creating a new valid appointment.
3.  **Conflict Detection**: Attempting to book a slot that overlaps with an existing one.
4.  **Updates**: Changing the status of an appointment.

## 📂 Project Structure

- **`src/components/AppointmentManagementView.tsx`**: Main UI controller. Handles:
  - **Calendar Filtering**: Fetches data specifically for the selected date from the service.
  - **Tab Filtering**: Fetches data and filters it by time (Upcoming/Past) relative to the mock system time.
- **`src/services/appointmentService.ts`**: **Frontend Service Layer**. A TypeScript mirror of the backend logic used to make the browser UI functional without a live server connection. It mimics network latency and API responses.
- **`appointment_service.py`**: **Backend Logic**. The Python reference implementation of the service.

## 🧩 Key Features Implemented

1.  **Calendar Integration**: Clicking a date on the sidebar calendar triggers a specific query to the service to fetch appointments for that day.
2.  **Tabular Views**:
    - **Upcoming**: Shows appointments after the current system time (Mocked to Dec 28, 12:00 PM).
    - **Day View**: Shows appointments for the specifically selected calendar date.
    - **Past**: Shows completed or past appointments.
3.  **Conflict Detection**: Logic exists in both the Python backend and TypeScript service to prevent double-booking doctors.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **Backend**: Python 3 (Standard Library).