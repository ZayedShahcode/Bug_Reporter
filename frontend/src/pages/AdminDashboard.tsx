import React, { useState, useEffect } from "react";
import BugCard from "../components/BugCard";

const AdminDashboard: React.FC = () => {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchAllBugs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBugs(data);
      } else {
        setError(data.error || "Failed to fetch bugs.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBugs();
  }, []);

  if(!localStorage.getItem("user")){
    return(
        <div className="text-red-500 grid place-items-center">Please Login to view this page</div>
    )
  }

  if(user.role !== "Admin"){
    return(
        <div className="text-red grid place-items-center">You are not allowed to access this page</div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">All Reported Bugs</h2>
        {loading && <div className="text-blue-500">Loading bugs...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} />
          ))}
          {(!loading && bugs.length === 0) && <div className="text-gray-500">No bugs reported yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
