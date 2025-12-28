import React, { useState, useEffect } from 'react';
import { 
  get_appointments, 
  update_appointment_status, 
  create_appointment 
} from '../services/appointmentService';
import { Appointment, AppointmentStatus, CreateAppointmentInput, AppointmentMode } from '../types';
import { CalendarWidget } from './CalendarWidget';
import { AppointmentCard } from './AppointmentCard';
import { NewAppointmentModal } from './NewAppointmentModal';
import { Plus, Search, RefreshCw, Stethoscope, Bell } from 'lucide-react';

const TABS = [
  { id: 'Upcoming', label: 'Upcoming' },
  { id: 'Today', label: 'Day View' },
  { id: 'Past', label: 'Past' },
  { id: 'All', label: 'All' }
];

const AVAILABLE_DOCTORS = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiology", status: 'Available' },
    { name: "Dr. Michael Chen", specialty: "Dermatology", status: 'In Session' },
    { name: "Dr. David Lee", specialty: "General", status: 'Available' },
    { name: "Dr. Emily White", specialty: "Surgery", status: 'Busy' }
];

const FILTER_OPTIONS = [
    { id: 'In-Person', label: 'In-Person', check: (app: Appointment) => app.mode === AppointmentMode.InPerson },
    { id: 'Video', label: 'Video Consultation', check: (app: Appointment) => app.mode === AppointmentMode.Video },
    { id: 'Urgent', label: 'Urgent Care', check: (app: Appointment) => app.type.toLowerCase().includes('urgent') || app.type.toLowerCase().includes('emergency') }
];

// Mocking "Now" to be in the middle of the mock data day
const MOCK_SYSTEM_TIME = new Date('2025-12-28T12:00:00');

export const AppointmentManagementView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('2025-12-28');
  const [activeTab, setActiveTab] = useState('Today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['In-Person', 'Video', 'Urgent']);

  // Data Fetching Wrapper
  const fetchAppointments = async (filters: any = {}) => {
    setLoading(true);
    try {
      // Calls the service (mock backend) with specific filters
      const data = await get_appointments(filters);
      
      const sorted = data.sort((a, b) => {
         const dateA = new Date(`${a.date}T${a.time}`);
         const dateB = new Date(`${b.date}T${b.time}`);
         return dateA.getTime() - dateB.getTime();
      });
      setAppointments(sorted);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    // Default to "Today" view on load, so we fetch strictly for the selectedDate
    fetchAppointments({ date: selectedDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- Task 2: Calendar Filtering Implementation ---
  const handleDateSelect = (date: string) => {
      // 1. Set local state
      setSelectedDate(date);
      setActiveTab('Today'); // Switch to Day View to show the selected date's items

      // 2. Call get_appointments with the selected date as a filter
      fetchAppointments({ date: date });
  };

  // --- Task 3: Tab Filtering Logic ---
  const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);

      if (tabId === 'Today') {
          // If switching to Today, we want strict filtering for the selected date
          fetchAppointments({ date: selectedDate });
      } else {
          // For Upcoming, Past, or All, we need to fetch the broader dataset 
          // (empty object = fetch all) and let client-side logic filter the time ranges.
          fetchAppointments({});
      }
  };

  const handleStatusUpdate = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await update_appointment_status(id, newStatus);
      // Optimistic update locally
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleCreateAppointment = async (data: CreateAppointmentInput) => {
    await create_appointment(data);
    // Refresh the view based on current context
    if (activeTab === 'Today') {
        fetchAppointments({ date: selectedDate });
    } else {
        fetchAppointments({});
    }
  };

  const toggleFilter = (filterId: string) => {
      setActiveFilters(prev => 
          prev.includes(filterId) 
          ? prev.filter(f => f !== filterId)
          : [...prev, filterId]
      );
  };

  // Client-side filtering logic (refines the fetched data for view-specific needs)
  const filteredAppointments = appointments.filter(app => {
    const appDateTime = new Date(`${app.date}T${app.time}`);
    
    // 1. Time/Tab Logic
    let dateMatch = false;
    if (activeTab === 'Upcoming') {
        dateMatch = appDateTime > MOCK_SYSTEM_TIME;
    } else if (activeTab === 'Past') {
        dateMatch = appDateTime < MOCK_SYSTEM_TIME;
    } else if (activeTab === 'Today') {
        // Since we fetched specifically for this date in handleDateSelect/handleTabChange,
        // this check is technically redundant but good for safety.
        dateMatch = app.date === selectedDate;
    } else {
        dateMatch = true; // All
    }

    // 2. Sidebar Filters
    let filterMatch = false;
    const isInPerson = app.mode === AppointmentMode.InPerson;
    const isVideo = app.mode === AppointmentMode.Video;
    const isPhone = app.mode === AppointmentMode.Phone;
    const isUrgent = app.type.toLowerCase().includes('urgent') || app.type.toLowerCase().includes('emergency');

    if (activeFilters.includes('In-Person') && isInPerson) filterMatch = true;
    if (activeFilters.includes('Video') && isVideo) filterMatch = true;
    if (activeFilters.includes('Urgent') && isUrgent) filterMatch = true;
    
    return dateMatch && filterMatch;
  });

  const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="flex h-screen bg-[#f3f4f6] text-gray-900 font-sans overflow-hidden">
        {/* Main Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8 z-20 shadow-sm">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                <Stethoscope className="w-6 h-6" />
             </div>
             <nav className="flex flex-col gap-6 w-full items-center">
                 {['Home', 'Schedule', 'Patients', 'Settings'].map((item, i) => (
                     <div key={item} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${i === 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
                         <div className="w-6 h-6 bg-current rounded-sm opacity-20 group-hover:opacity-100 transition-opacity" />
                         {i === 1 && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full" />}
                     </div>
                 ))}
             </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Top Navigation */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Schedule Manager</h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-100">
                        {formattedSelectedDate}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search patients..." 
                            className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-full text-sm w-64 transition-all outline-none border"
                        />
                    </div>
                    <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800">Dr. J. Doe</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                            JD
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                
                {/* Secondary Sidebar (Filters & Calendar) */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto hidden xl:flex">
                    <div className="p-6 space-y-8">
                        
                        {/* Calendar */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Date Selection</h3>
                            <CalendarWidget selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                        </div>

                        {/* Doctors List */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                                <span>Doctor Availability</span>
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">Live</span>
                            </h3>
                            <div className="space-y-3">
                                {AVAILABLE_DOCTORS.map((doc, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-default group">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-gray-600 font-bold text-sm">
                                                {doc.name.split(' ')[1][0]}
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                                doc.status === 'Available' ? 'bg-green-500' : 
                                                doc.status === 'Busy' ? 'bg-red-500' : 'bg-orange-500'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                                            <p className="text-xs text-gray-500">{doc.specialty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filters */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">View Filters</h3>
                            <div className="space-y-2">
                                {FILTER_OPTIONS.map(filter => (
                                    <label key={filter.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors select-none">
                                        <div className="relative flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={activeFilters.includes(filter.id)}
                                                onChange={() => toggleFilter(filter.id)}
                                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400 transition-all" 
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{filter.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main List Area */}
                <div className="flex-1 flex flex-col bg-gray-50/50">
                    {/* Toolbar */}
                    <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'Today' ? 'Day View' : `${activeTab} Appointments`}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {filteredAppointments.length} patients scheduled 
                                {activeTab === 'Today' && ` for ${formattedSelectedDate}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        activeTab === tab.id 
                                        ? 'bg-gray-900 text-white shadow-md' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                             <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden md:inline">New Appointment</span>
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-sm font-medium">Syncing records...</p>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 mx-8 mb-8">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Search className="w-8 h-8 opacity-20" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600">No appointments found</h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {activeTab === 'Today' 
                                    ? `No appointments for ${formattedSelectedDate}.` 
                                    : "There are no appointments matching your criteria."}
                                </p>
                                {activeTab === 'Today' && (
                                     <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-medium hover:underline">
                                        Schedule for {formattedSelectedDate}
                                     </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                                {filteredAppointments.map(app => (
                                    <AppointmentCard 
                                        key={app.id} 
                                        appointment={app} 
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>

        <NewAppointmentModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleCreateAppointment}
        />
    </div>
  );
};