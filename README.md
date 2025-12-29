# MediCare EMR - Appointment & Queue Management

This repository contains the implementation for the "Appointment Scheduling and Queue Management" feature. It features a modern React frontend and a Python backend service implementation.

## 🚀 Quick Start

### 1. Frontend (React Application)

The frontend acts as the main user interface. It communicates with a TypeScript service layer that replicates the logic defined in the Python backend.

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### 2. Backend Logic (Python)

The `appointment_service.py` file contains the canonical implementation of the business logic.

To run the logic verification suite:

```bash
# Run the python script
python appointment_service.py
```

## 🧩 Technical Implementation Details

### 1. Data Fetching & Query Structure

Instead of a raw REST endpoint, the application uses a structured **Filter Object** pattern (similar to a GraphQL query variable structure) to ensure efficient data retrieval.

The `get_appointments(filters)` function accepts a `filters` dictionary/object with the following structure:

```typescript
interface AppointmentFilters {
  date?: string; // Exact match (YYYY-MM-DD)
  status?: string; // Enum match (Confirmed, Upcoming, etc.)
  doctorName?: string; // Exact match
}
```

**How it works in the App:**

- **Calendar View**: When a user selects a date, the app dispatches a query: `{ date: "2025-12-28" }`. The backend filters the memory store and returns _only_ that day's records.
- **Tab Views**: For "Upcoming" or "Past" tabs, the app fetches a broader dataset (empty filter) and refines the view client-side using the mock system time.

### 2. Data Consistency & Conflict Detection

The `appointment_service.py` ensures data consistency through a strict **Conflict Detection Algorithm** that runs before any creation or update operation.

**The Logic:**
When a new appointment is requested, the system iterates through all existing active appointments (excluding cancelled ones) for that specific doctor and date. It enforces consistency using the following condition:

```python
if (new_start < existing_end) and (new_end > existing_start):
    raise ValueError("Time conflict detected...")
```

This ensures that:

1.  No doctor can be double-booked.
2.  Data integrity is maintained on the server side before writing to the database (or in-memory list).
3.  Race conditions in the UI are caught by the backend validation.

## 📂 Project Structure

- **`src/components/AppointmentManagementView.tsx`**: **Primary Frontend Implementation**. Handles the UI, state, and interaction logic.
- **`appointment_service.py`**: **Primary Backend Implementation**. Contains the Python logic for creating appointments and checking conflicts.
- **`src/services/appointmentService.ts`**: TypeScript mirror of the Python backend for browser simulation.
- **`src/components/CalendarWidget.tsx`**: Modular component for date selection.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **Backend**: Python 3.
