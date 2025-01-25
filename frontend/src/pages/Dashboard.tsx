import React from "react";
import Table from "../components/Table";
import Submit from "../components/Button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="h-screen px-20 py-10">
      <h1 className="text-white text-3xl text-center mb-10">Student Management</h1>
      <Link to={'/add-student'}>
        <Submit label="Add Student" color="green" />
      </Link>
      <Table />
    </div>
  );
};

export default Dashboard;
