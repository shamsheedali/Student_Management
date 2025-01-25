import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents, useDeleteStudent } from "../api/studentApi";

const Table = () => {
  const { data, isLoading, isError, error } = useStudents();
  const { mutate: deleteStudent, isLoading: isDeleting } = useDeleteStudent();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [toastMessages, setToastMessages] = useState<
    { type: "info" | "success" | "error"; message: string }[]
  >([]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  if (!data || !Array.isArray(data)) {
    return <div>No students available.</div>;
  }

  const handleEdit = (id: number) => {
    navigate(`/edit-student/${id}`);
  };

  const confirmDelete = (id: number) => {
    setSelectedStudentId(id);
    setShowAlert(true);
  };

  const handleDelete = () => {
    if (selectedStudentId !== null) {
      deleteStudent(selectedStudentId, {
        onSuccess: () => {
          setShowAlert(false);
          setToastMessages((prev) => [
            ...prev,
            { type: "success", message: "Student deleted successfully!" },
          ]);
        },
        onError: (err) => {
          setShowAlert(false);
          setToastMessages((prev) => [
            ...prev,
            {
              type: "error",
              message: `Failed to delete student: ${err.message}`,
            },
          ]);
        },
      });
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setSelectedStudentId(null);
  };

  const clearToast = (index: number) => {
    setToastMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className=" w-full h-full flex flex-col items-center">
      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Student Id</th>
            <th>Full Name</th>
            <th>Date Of Birth</th>
            <th>Courses</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <div className="w-full">
              <h1 className="text-center">No Student Found!</h1>
            </div>
          ) : (
            data.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div
                        className="mask mask-squircle h-12 w-12 bg-gray-500 flex items-center justify-center"
                        style={{ display: "flex" }}
                      >
                        <h1 className="text-white font-bold">
                          {student?.name[0].toUpperCase()}
                        </h1>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td>{new Date(student.dob).toLocaleDateString("en-GB")}</td>
                <td>{student.courses}</td>
                <td>{student.gender}</td>
                <td>{student.address}</td>
                <th>
                  <button
                    className="btn btn-success btn-xs"
                    onClick={() => handleEdit(student.id!)}
                  >
                    Edit
                  </button>
                </th>
                <th>
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => confirmDelete(student.id!)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </th>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Custom Alert */}
      {showAlert && (
        <div
          role="alert"
          className="alert bg-gray-900 text-white p-4 rounded-lg shadow-lg fixed bottom-10 right-10 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0 inline-block mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Are you sure you want to delete this student?</span>
          <div className="flex gap-2 mt-4">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button className="btn btn-sm" onClick={closeAlert}>
              No
            </button>
          </div>
        </div>
      )}

      {/* Custom Toast */}
      <div className="toast toast-end">
        {toastMessages.map((toast, index) => (
          <div
            key={index}
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
            <button
              className="btn btn-sm btn-circle ml-2"
              onClick={() => clearToast(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
