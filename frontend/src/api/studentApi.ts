import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = `http://localhost:3000/api/students`;

interface Student {
  id?: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  courses: string;
}

// Fetch all students
const fetchStudents = async (): Promise<Student[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Custom hook for fetching all students
const useStudents = () =>
  useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    onError: (error) => {
      console.error("Error fetching students:", error.message);
    },
  });

// Add a new student
const addStudent = async (student: Omit<Student, "id">): Promise<Student> => {
  const { data } = await axios.post(`${API_URL}/add`, student);
  return data;
};

// Custom hook for adding a new student
const useAddStudent = () =>
  useMutation({
    mutationFn: addStudent,
    onError: (error) => {
      console.error("Error adding student:", error.message);
    },
  });

// Fetch a student by ID
const fetchStudentById = async (id: number): Promise<Student> => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// Custom hook for fetching a student by ID
const useFetchStudentById = (id: number) =>
  useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id, 
  });

// Update a student
const updateStudent = async (student: Student): Promise<Student> => {
  if (!student.id) throw new Error("Student ID is required for updating.");
  const { data } = await axios.put(`${API_URL}/update/${student.id}`, student);
  return data;
};

// Custom hook for updating a student
const useUpdateStudent = () =>
  useMutation({
    mutationFn: updateStudent,
  });

// Delete a student
const deleteStudent = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

// Custom hook for deleting a student
const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]); // Refresh students data
    },
  });
};

export {
  useStudents,
  useAddStudent,
  Student,
  useFetchStudentById,
  useUpdateStudent,
  useDeleteStudent,
};
