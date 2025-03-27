export interface Student {
  id: string;
  name: string;
  roll_number: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
}