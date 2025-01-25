import express from "express";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

router.post("/add", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;
