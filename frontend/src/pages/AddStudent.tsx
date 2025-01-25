import React, { useState, useRef } from "react";
import Input from "../components/Input";
import RadioButton from "../components/RadioButton";
import Submit from "../components/Button";
import { useAddStudent } from "../api/studentApi";

const AddStudent = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const genderMaleRef = useRef<HTMLInputElement>(null);
  const genderFemaleRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const coursesRef = useRef<HTMLInputElement>(null);

  // Use the custom hook for mutation
  const { mutate, isLoading, isError, error } = useAddStudent();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<string>("info");

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = "";
    if (dobRef.current) dobRef.current.value = "";
    if (genderMaleRef.current) genderMaleRef.current.checked = false;
    if (genderFemaleRef.current) genderFemaleRef.current.checked = false;
    if (addressRef.current) addressRef.current.value = "";
    if (coursesRef.current) coursesRef.current.value = "";
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!nameRef.current?.value.trim()) {
      errors.name = "Name is required and cannot be just spaces";
    }
    if (!dobRef.current?.value.trim()) {
      errors.dob = "Date of Birth is required";
    }
    if (!genderMaleRef.current?.checked && !genderFemaleRef.current?.checked) {
      errors.gender = "Gender is required";
    }
    if (!addressRef.current?.value.trim()) {
      errors.address = "Address is required and cannot be just spaces";
    }
    if (!coursesRef.current?.value.trim()) {
      errors.courses = "Courses are required and cannot be just spaces";
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const gender =
      genderMaleRef.current?.checked && !genderFemaleRef.current?.checked
        ? "Male"
        : "Female";

    const studentData = {
      name: nameRef.current?.value.trim() || "",
      dob: dobRef.current?.value.trim() || "",
      gender,
      address: addressRef.current?.value.trim() || "",
      courses: coursesRef.current?.value.trim() || "",
    };

    console.log("Submitting student data:", studentData);

    mutate(studentData, {
      onSuccess: () => {
        setToastMessage("Student added successfully!");
        setToastType("success");

        // Reset the form fields
        resetForm();
        // Clear validation errors
        setValidationErrors({});

        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      },
      onError: (err: any) => {
        setToastMessage(`Failed to add student: ${err.message}`);
        setToastType("error");

        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      },
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        className="w-[500px] p-10 rounded-xl h-fit bg-black"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-white">Add Student</h1>
        <Input ref={nameRef} type="text" label="What is your name" error={validationErrors.name || ""} />
        <Input ref={dobRef} type="date" label="Your Date of Birth" error={validationErrors.dob || ""} />
        <h2 className="text-white">Gender</h2>
        <RadioButton ref={genderMaleRef} label="Male" value="Male" />
        <RadioButton ref={genderFemaleRef} label="Female" value="Female" />
        {validationErrors.gender && <p className="text-red-500">{validationErrors.gender}</p>}
        <Input
          ref={addressRef}
          type="text"
          label="Enter Your Address"
          error={validationErrors.address || ""}
        />
        <Input
          ref={coursesRef}
          type="text"
          label="Enter Your Courses"
          error={validationErrors.courses || ""}
        />
        <Submit label={isLoading ? "Adding..." : "Add"} />
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

export default AddStudent;
