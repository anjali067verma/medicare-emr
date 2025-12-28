# MediCare EMR - Appointment & Queue Management

This repository contains the implementation for the "Appointment Scheduling and Queue Management" feature (Feature B). It provides a full-stack experience with a React frontend and a Python backend implementation of the core business logic.

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
3.  **Conflict Detection**: Attempting to book a slot that overlaps with an existing one to ensure the logic `(NewStart < ExistingEnd) and (NewEnd > ExistingStart)` functions correctly.
4.  **Updates**: Changing the status of an appointment.

## 📂 Project Structure

*   **`src/`**: React Frontend source code.
    *   `services/appointmentService.ts`: **Frontend Logic**. A TypeScript mirror of the backend logic used to make the browser UI functional without a live server connection.
*   **`appointment_service.py`**: **Backend Logic**. The Python implementation of the service.
    *   `Appointment` Class
    *   `mock_appointments` (In-memory storage)
    *   `create_appointment` (Contains the Conflict Detection Algorithm)
*   **`metadata.json`**: Application metadata configuration.

## 🧩 Implementation Details

### Conflict Detection Algorithm
Implemented in `appointment_service.py` inside the `create_appointment` function.

**Logic:**
The system prevents double-booking by ensuring no two appointments for the same doctor overlap in time.

**Formula:**
An overlap exists if:
```python
(NewStart < ExistingEnd) and (NewEnd > ExistingStart)
```
Where time is converted to minutes from midnight for accurate comparison.

### Data Models
*   **Appointment**: Core entity containing patient details, time, doctor, and status.
*   **AppointmentStatus**: Enum (`Scheduled`, `Confirmed`, `Upcoming`, `Completed`, `Cancelled`).
*   **AppointmentMode**: Enum (`In-Person`, `Video`, `Phone`).

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
*   **Backend**: Python 3 (Standard Library).
