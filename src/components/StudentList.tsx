import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit2, Check, X } from 'lucide-react';
import { Student } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function StudentList({ students, onUpdate }: { students: Student[], onUpdate: () => void }) {
  const [newStudent, setNewStudent] = useState({ name: '', roll_number: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('students')
        .insert([newStudent]);
      
      if (error) throw error;
      
      setNewStudent({ name: '', roll_number: '' });
      onUpdate();
      toast.success('Student added successfully');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      onUpdate();
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const updateStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ name: student.name, roll_number: student.roll_number })
        .eq('id', student.id);
      
      if (error) throw error;
      
      setEditingStudent(null);
      onUpdate();
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addStudent} className="flex gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={newStudent.roll_number}
          onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          Add Student
        </button>
      </form>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">
                  {editingStudent?.id === student.id ? (
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingStudent?.id === student.id ? (
                    <input
                      type="text"
                      value={editingStudent.roll_number}
                      onChange={(e) => setEditingStudent({ ...editingStudent, roll_number: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                  ) : (
                    student.roll_number
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingStudent?.id === student.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStudent(editingStudent)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}