import React, { useEffect, useState } from 'react';
import { Users, CalendarCheck } from 'lucide-react';
import { Student, Attendance } from './types';
import { supabase } from './lib/supabase';
import StudentList from './components/StudentList';
import AttendanceMarking from './components/AttendanceMarking';

function App() {
  const [activeTab, setActiveTab] = useState<'students' | 'attendance'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching students:', error);
      return;
    }
    
    setStudents(data);
  };

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', selectedDate);
    
    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }
    
    setAttendance(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    }
  }, [activeTab, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Total Students</h2>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === 'students'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={20} />
                Students
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === 'attendance'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CalendarCheck size={20} />
                Attendance
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'students' ? (
          <StudentList students={students} onUpdate={fetchStudents} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <AttendanceMarking
              students={students}
              date={selectedDate}
              attendance={attendance}
              onUpdate={fetchAttendance}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;