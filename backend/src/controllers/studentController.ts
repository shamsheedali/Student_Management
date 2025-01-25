import { Request, Response } from "express";
import { pool } from "../config/database";
import HttpStatus from "../utils/httpStatus";

// Adding a new student
const addStudent = async (req: Request, res: Response): Promise<void> => {
  const { name, dob, gender, address, courses } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO students (name, dob, gender, address, courses) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, dob, gender, address, courses]
    );
    res.status(HttpStatus.CREATED).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding student:", err);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add student" });
  }
};

// Get all students
const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.status(HttpStatus.OK).json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch students" });
  }
};

// Get a student by ID
const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Student not found" });
      return;
    }

    res.status(HttpStatus.OK).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching student data" });
  }
};

// Update a student
const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, dob, gender, address, courses } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students 
       SET name = $1, dob = $2, gender = $3, address = $4, courses = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, dob, gender, address, courses, id]
    );

    if (result.rowCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Student not found" });
      return;
    }

    res.status(HttpStatus.OK).json({
      message: "Student updated successfully",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error updating student" });
  }
};

//Delete a Student
const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Ensure the ID is a valid number
    const studentId = parseInt(id, 10);
    if (isNaN(studentId)) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid student ID" });
      return;
    }

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [studentId]
    );

    if (result.rowCount === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Student not found" });
      return;
    }

    res.status(HttpStatus.OK).json({
      message: "Student deleted successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting student",
    });
  }
};

export {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
