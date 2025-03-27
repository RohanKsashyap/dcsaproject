import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Student, Attendance } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function AttendanceMarking({ 
  students, 
  date,
  attendance,
  onUpdate 
}: { 
  students: Student[], 
  date: string,
  attendance: Attendance[],
  onUpdate: () => void 
}) {
  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    try {
      const existingAttendance = attendance.find(
        a => a.student_id === studentId && a.date === date
      );

      if (existingAttendance) {
        const { error } = await supabase
          .from('attendance')
          .update({ status })
          .eq('id', existingAttendance.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([{ student_id: studentId, date, status }]);
        
        if (error) throw error;
      }
      
      onUpdate();
      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendance.find(
      a => a.student_id === studentId && a.date === date
    )?.status;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => {
            const status = getAttendanceStatus(student.id);
            return (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.roll_number}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => markAttendance(student.id, 'present')}
                      className={`p-2 rounded-full ${
                        status === 'present'
                          ? 'bg-green-100 text-green-600'
                          : 'hover:bg-green-100 text-gray-400'
                      }`}
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => markAttendance(student.id, 'absent')}
                      className={`p-2 rounded-full ${
                        status === 'absent'
                          ? 'bg-red-100 text-red-600'
                          : 'hover:bg-red-100 text-gray-400'
                      }`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}