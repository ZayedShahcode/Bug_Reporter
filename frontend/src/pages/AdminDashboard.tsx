import React, { useState, useEffect } from "react";
import BugCard from "../components/BugCard";

const AdminDashboard: React.FC = () => {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllBugs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/bugs/all`, {
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

  return (
    <div className="admin-dashboard-container">
      <h2>All Reported Bugs</h2>
      {loading && <div>Loading bugs...</div>}
      {error && <div className="error">{error}</div>}
      <div className="bug-cards">
        {bugs.map((bug) => (
          <BugCard key={bug.id} bug={bug} />
        ))}
        {(!loading && bugs.length === 0) && <div>No bugs reported yet.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
