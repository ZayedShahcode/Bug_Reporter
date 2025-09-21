import React from "react";

interface BugFiltersProps {
  status: string;
  severity: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSeverityChange: (severity: string) => void;
  onSearchChange: (search: string) => void;
}

const statusOptions = ["All", "Open", "InProgress", "Closed"];
const severityOptions = ["All", "Low", "Medium", "High"];

const BugFilters: React.FC<BugFiltersProps> = ({ status, severity, search, onStatusChange, onSeverityChange, onSearchChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-48"
      />
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value)}
        className="px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      >
        {statusOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <select
        value={severity}
        onChange={e => onSeverityChange(e.target.value)}
        className="px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      >
        {severityOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default BugFilters;
