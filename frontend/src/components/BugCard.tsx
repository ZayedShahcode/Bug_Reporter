import React, { useState } from "react";

interface BugCardProps {
  bug: {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    reporterId?: number;
    reporterName?: string;
  };
}

const statusOptions = ["Open", "InProgress", "Closed"];

const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(bug.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch(`https://bug-reporter-4htm.onrender.com/api/bugs/update/${bug.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        bug.status= newStatus;
        setEditing(false);
      } else {
        setError(data.error || "Failed to update status.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col gap-2">
      <h4 className="text-lg font-semibold text-blue-700 mb-1">{bug.title}</h4>
      <p className="text-gray-700 text-sm mb-2">{bug.description}</p>
      <div className="flex flex-wrap gap-4 text-sm items-center">
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">Severity: {bug.severity}</span>
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">Status: {bug.status}</span>
        {bug.reporterName && (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">Reporter: {bug.reporterName}</span>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {!editing ? (
          <button
            className="self-start px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={() => setEditing(true)}
          >
            Update Status
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={newStatus}
              onChange={handleStatusChange}
              className="rounded border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              onClick={handleUpdateStatus}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              onClick={() => { setEditing(false); setNewStatus(bug.status); }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
        {loading && <div className="text-blue-500 text-xs">Updating...</div>}
        {success && <div className="text-green-500 text-xs">Status updated!</div>}
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
    </div>
  );
};

export default BugCard;
