


import React, { useState } from "react";
import BugReportForm from "../components/BugReportForm";
import BugList from "../components/BugList";


const Dashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const handleBugReported = () => {
    setRefresh((r) => !r);
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="text-red-500 grid place-items-center">Please Login to view this page</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <BugReportForm onBugReported={handleBugReported} />
      <BugList refresh={refresh} />
    </div>
  );
};

export default Dashboard;
