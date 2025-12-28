import datetime
import uuid
from enum import Enum
from typing import List, Optional, Dict, Any

# --- Data Models ---

class AppointmentStatus(str, Enum):
    Confirmed = 'Confirmed'
    Scheduled = 'Scheduled'
    Upcoming = 'Upcoming'
    Cancelled = 'Cancelled'
    Completed = 'Completed'

class AppointmentMode(str, Enum):
    InPerson = 'In-Person'
    Video = 'Video'
    Phone = 'Phone'

class Appointment:
    def __init__(self, 
                 patient_name: str, 
                 date: str, 
                 time: str, 
                 duration: int, 
                 doctor_name: str, 
                 mode: AppointmentMode, 
                 type: str,
                 status: AppointmentStatus = AppointmentStatus.Scheduled,
                 id: Optional[str] = None):
        self.id = id if id else str(uuid.uuid4())
        self.patient_name = patient_name
        self.date = date  # YYYY-MM-DD
        self.time = time  # HH:mm
        self.duration = duration  # minutes
        self.doctor_name = doctor_name
        self.status = status
        self.mode = mode
        self.type = type

    def to_dict(self):
        return {
            "id": self.id,
            "patientName": self.patient_name,
            "date": self.date,
            "time": self.time,
            "duration": self.duration,
            "doctorName": self.doctor_name,
            "status": self.status,
            "mode": self.mode,
            "type": self.type
        }

# --- In-Memory Database ---

mock_appointments: List[Appointment] = [
    Appointment(id='1', patient_name='Rajesh Kumar', date='2025-12-28', time='09:00', duration=30, doctor_name='Dr. Sarah Johnson', status=AppointmentStatus.Upcoming, mode=AppointmentMode.InPerson, type='General Checkup'),
    Appointment(id='2', patient_name='Priya Sharma', date='2025-12-28', time='09:30', duration=30, doctor_name='Dr. Michael Chen', status=AppointmentStatus.Upcoming, mode=AppointmentMode.Video, type='Follow-up'),
    Appointment(id='3', patient_name='Amit Patel', date='2025-12-28', time='10:00', duration=45, doctor_name='Dr. Sarah Johnson', status=AppointmentStatus.Completed, mode=AppointmentMode.InPerson, type='Lab Results'),
    Appointment(id='4', patient_name='Sneha Reddy', date='2025-12-28', time='10:30', duration=30, doctor_name='Dr. David Lee', status=AppointmentStatus.Upcoming, mode=AppointmentMode.Video, type='Consultation'),
    Appointment(id='5', patient_name='Vikram Singh', date='2025-12-28', time='11:00', duration=60, doctor_name='Dr. Emily White', status=AppointmentStatus.Cancelled, mode=AppointmentMode.InPerson, type='Surgery Prep'),
    Appointment(id='6', patient_name='John Doe', date='2025-12-29', time='09:00', duration=30, doctor_name='Dr. Sarah Johnson', status=AppointmentStatus.Scheduled, mode=AppointmentMode.InPerson, type='General Checkup'),
    Appointment(id='7', patient_name='Jane Smith', date='2025-12-27', time='14:00', duration=30, doctor_name='Dr. Michael Chen', status=AppointmentStatus.Completed, mode=AppointmentMode.Phone, type='Consultation'),
    Appointment(id='8', patient_name='Robert Brown', date='2025-12-30', time='11:00', duration=45, doctor_name='Dr. Sarah Johnson', status=AppointmentStatus.Scheduled, mode=AppointmentMode.InPerson, type='Physical Therapy'),
    Appointment(id='9', patient_name='Emily Davis', date='2025-12-28', time='15:00', duration=30, doctor_name='Dr. Sarah Johnson', status=AppointmentStatus.Confirmed, mode=AppointmentMode.Video, type='Follow-up'),
    Appointment(id='10', patient_name='Michael Wilson', date='2025-12-28', time='16:00', duration=30, doctor_name='Dr. David Lee', status=AppointmentStatus.Scheduled, mode=AppointmentMode.InPerson, type='Dental Checkup')
]

# --- Helper Functions ---

def parse_time_minutes(time_str: str) -> int:
    """Converts 'HH:mm' string to minutes from midnight."""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes

# --- Service Functions ---

def get_appointments(filters: Dict[str, Any] = None) -> List[Appointment]:
    """Retrieves appointments based on optional filters."""
    if filters is None:
        filters = {}
    
    results = []
    for app in mock_appointments:
        matches = True
        if 'date' in filters and app.date != filters['date']:
            matches = False
        if 'status' in filters and app.status != filters['status']:
            matches = False
        if 'doctorName' in filters and app.doctor_name != filters['doctorName']:
            matches = False
        
        if matches:
            results.append(app)
            
    return results

def create_appointment(data: Dict[str, Any]) -> Appointment:
    """
    Creates a new appointment with conflict detection.
    Raises ValueError if a time conflict exists.
    """
    # 1. Validation
    required_fields = ['patientName', 'date', 'time', 'duration', 'doctorName', 'mode', 'type']
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing field: {field}")

    # 2. Parse Inputs
    new_date = data['date']
    new_doctor = data['doctorName']
    new_start_time = parse_time_minutes(data['time'])
    new_duration = int(data['duration'])
    new_end_time = new_start_time + new_duration

    # 3. Conflict Detection Algorithm
    # Logic: (NewStart < ExistingEnd) and (NewEnd > ExistingStart)
    for app in mock_appointments:
        if app.doctor_name != new_doctor:
            continue
        if app.date != new_date:
            continue
        if app.status == AppointmentStatus.Cancelled:
            continue

        existing_start = parse_time_minutes(app.time)
        existing_end = existing_start + app.duration

        if (new_start_time < existing_end) and (new_end_time > existing_start):
            raise ValueError(f"Time conflict detected with existing appointment for {new_doctor} at {app.time}")

    # 4. Create Object
    new_appointment = Appointment(
        patient_name=data['patientName'],
        date=data['date'],
        time=data['time'],
        duration=new_duration,
        doctor_name=data['doctorName'],
        mode=AppointmentMode(data['mode']),
        type=data['type'],
        status=AppointmentStatus.Scheduled
    )

    mock_appointments.append(new_appointment)
    return new_appointment

def update_appointment_status(appointment_id: str, new_status: AppointmentStatus) -> Optional[Appointment]:
    """Updates the status of an appointment."""
    for app in mock_appointments:
        if app.id == appointment_id:
            app.status = new_status
            return app
    raise ValueError("Appointment not found")

# --- Test Suite (Main Execution) ---

if __name__ == "__main__":
    print("--- Running Medical EMR Backend Service Tests ---")
    
    # Test 1: Fetch Appointments
    print("\n1. Fetching appointments for 2025-12-28...")
    today_apps = get_appointments({'date': '2025-12-28'})
    print(f"Found {len(today_apps)} appointments.")
    for app in today_apps:
        print(f" - {app.time} : {app.patient_name} ({app.status})")

    # Test 2: Create Valid Appointment
    print("\n2. Creating a new valid appointment...")
    try:
        new_app_data = {
            "patientName": "Alice Walker",
            "date": "2025-12-28",
            "time": "13:00", # 1:00 PM (No conflict in mock data)
            "duration": 30,
            "doctorName": "Dr. Sarah Johnson",
            "mode": "In-Person",
            "type": "Consultation"
        }
        created_app = create_appointment(new_app_data)
        print(f"Success: Created appointment for {created_app.patient_name} at {created_app.time}")
    except ValueError as e:
        print(f"Failed: {e}")

    # Test 3: Conflict Detection
    print("\n3. Testing Conflict Detection...")
    try:
        # Attempt to book overlapping time with the one just created (13:00 - 13:30)
        # Booking 12:45 - 13:15
        conflict_data = {
            "patientName": "Conflict Tester",
            "date": "2025-12-28",
            "time": "12:45",
            "duration": 30,
            "doctorName": "Dr. Sarah Johnson",
            "mode": "Video",
            "type": "Test"
        }
        create_appointment(conflict_data)
        print("Error: Conflict not detected!")
    except ValueError as e:
        print(f"Success: Conflict detected correctly -> {e}")

    # Test 4: Update Status
    print("\n4. Updating Status...")
    try:
        # Update the appointment we created in step 2
        updated = update_appointment_status(created_app.id, AppointmentStatus.Confirmed)
        print(f"Updated status to: {updated.status}")
    except Exception as e:
        print(f"Update failed: {e}")

    print("\n--- All Tests Completed ---")