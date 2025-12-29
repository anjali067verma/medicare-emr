# MediCare EMR - Appointment & Queue Management

This repository contains the implementation for the "Appointment Scheduling and Queue Management" feature. It features a modern React frontend with a simulated backend service layer that mimics real-world API interactions and business logic.

## 🚀 Quick Start

### 1. Frontend (React Application)

The frontend acts as the main user interface. It communicates with a TypeScript service layer (`appointmentService.ts`) that replicates the logic defined in the Python backend assignment.

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### 2. Backend Logic (Python)

The `appointment_service.py` file contains the canonical implementation of the business logic, data models, and conflict detection algorithms.

To run the logic verification suite:

```bash
# Run the python script
python appointment_service.py
```

_Note: In this browser-based demo, the React app uses `services/appointmentService.ts` to mimic this Python logic directly in the browser._

## 🧩 Implemented Features

### 1. Advanced Data Fetching & Filtering

The application implements a hybrid filtering approach:

- **Server-Side Simulation**: When a specific date is selected via the **Calendar**, the service is queried specifically for that date (`get_appointments({ date: ... })`).
- **Client-Side Refinement**: When switching between **Upcoming** and **Past** tabs, the application fetches broader datasets and filters them based on the **Mock System Time** (set to Dec 28, 2025, 12:00 PM).

### 2. Calendar Widget Integration (Task 2)

- Clicking a date on the sidebar calendar updates the local state (`selectedDate`).
- This triggers a specific data fetch for the selected date.
- The view automatically switches to **"Day View"** to display the specific appointments for that day.

### 3. Tab Navigation Logic (Task 3)

- **Upcoming**: Shows appointments scheduled _after_ the mock system time.
- **Day View**: Shows appointments strictly matching the selected calendar date.
- **Past**: Shows appointments _before_ the mock system time or with status 'Completed'.
- **All**: Shows the complete history.

### 4. Conflict Detection

Both the Python script and the TypeScript service implement conflict detection:

- Logic: `(NewStart < ExistingEnd) and (NewEnd > ExistingStart)`
- Prevents booking a doctor for overlapping time slots during appointment creation.

### 5. View Filters

Sidebar checkboxes allow filtering by appointment mode:

- **In-Person**
- **Video**
- **Urgent Care** (Filters by appointment type text)

## 📂 Project Structure

- **`src/components/AppointmentManagementView.tsx`**: Main controller. Handles state, tab logic, and coordinates data fetching.
- **`src/components/CalendarWidget.tsx`**: Renders the calendar grid and handles date selection events.
- **`src/services/appointmentService.ts`**: The "Mock Backend". It implements `get_appointments`, `create_appointment`, and `update_appointment_status` with artificial network delay.
- **`appointment_service.py`**: The reference Python implementation of the business logic.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide React (Icons).
- **Backend Logic**: Python 3.
