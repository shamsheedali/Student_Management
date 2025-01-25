import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchStudentById, useUpdateStudent, Student } from "../api/studentApi";
import Input from "../components/Input";
import RadioButton from "../components/RadioButton";
import Submit from "../components/Button";

const EditStudent = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = parseInt(id || "0", 10);

  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const genderMaleRef = useRef<HTMLInputElement>(null);
  const genderFemaleRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const coursesRef = useRef<HTMLInputElement>(null);

  // State for controlling toast message visibility and type
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string>("info"); 

  const { data: student, isLoading: isFetching } = useFetchStudentById(studentId);
  const { mutate, isLoading: isUpdating, isError, error } = useUpdateStudent();

  useEffect(() => {
    if (student) {
      if (nameRef.current) nameRef.current.value = student.name;
      if (dobRef.current) dobRef.current.value = student.dob.split("T")[0];
      if (addressRef.current) addressRef.current.value = student.address;
      if (coursesRef.current) coursesRef.current.value = student.courses;
      if (genderMaleRef.current)
        genderMaleRef.current.checked = student.gender === "Male";
      if (genderFemaleRef.current)
        genderFemaleRef.current.checked = student.gender === "Female";
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gender =
      genderMaleRef.current?.checked && !genderFemaleRef.current?.checked
        ? "Male"
        : "Female";

    const updatedStudent: Student = {
      id: studentId,
      name: nameRef.current?.value || "",
      dob: dobRef.current?.value || "",
      gender,
      address: addressRef.current?.value || "",
      courses: coursesRef.current?.value || "",
    };

    mutate(updatedStudent, {
      onSuccess: () => {
        setToastMessage("Student updated successfully!");
        setToastType("success");

        setTimeout(() => setToastMessage(null), 3000);
        navigate('/dashboard');
      },
      onError: (err: any) => {
        setToastMessage(`Failed to update student: ${err.message}`);
        setToastType("error");

        setTimeout(() => setToastMessage(null), 3000);
      },
    });
  };

  if (isFetching) return <div>Loading student data...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        className="w-[500px] p-10 rounded-xl h-fit bg-black"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-white">Edit Student</h1>
        <Input ref={nameRef} type="text" label="What is your name" error="" />
        <Input ref={dobRef} type="date" label="Your Date of Birth" error="" />
        <h2 className="text-white">Gender</h2>
        <RadioButton ref={genderMaleRef} label="Male" value="Male" />
        <RadioButton ref={genderFemaleRef} label="Female" value="Female" />
        <Input ref={addressRef} type="text" label="Enter Your Address" error="" />
        <Input ref={coursesRef} type="text" label="Enter Your Courses" error="" />
        <Submit label={isUpdating ? "Updating..." : "Update"} />
        {isError && <p className="text-red-500">{(error as Error).message}</p>}
      </form>

      {/* Toast message */}
      {toastMessage && (
        <div
          className={`toast toast-end ${toastType === "success" ? "toast-success" : "toast-error"}`}
        >
          <div className={`alert ${toastType === "success" ? "alert-success" : "alert-error"}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStudent;
