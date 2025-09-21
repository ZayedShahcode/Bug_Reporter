import React, { useState, useEffect } from "react";
import BugCard from "./BugCard";
import BugFilters from "./BugFilters";

const BugList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [search, setSearch] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchBugs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/all/${user?.id}`, {
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
    fetchBugs();
    // eslint-disable-next-line
  }, [refresh]);

  const filteredBugs = bugs.filter(bug => {
    const statusMatch = status === "All" || bug.status === status;
    const severityMatch = severity === "All" || bug.severity === severity;
    const searchMatch = bug.title.toLowerCase().includes(search.toLowerCase());
    return statusMatch && severityMatch && searchMatch;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <BugFilters
        status={status}
        severity={severity}
        search={search}
        onStatusChange={setStatus}
        onSeverityChange={setSeverity}
        onSearchChange={setSearch}
      />
      <h3 className="text-xl font-bold mb-6 text-blue-700">Your Reported Bugs</h3>
      {loading && <div className="text-blue-500">Loading bugs...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBugs.map((bug) => (
          <BugCard key={bug.id} bug={bug} />
        ))}
        {(!loading && filteredBugs.length === 0) && <div className="text-gray-500">No bugs reported yet.</div>}
      </div>
    </div>
  );
};

export default BugList;
