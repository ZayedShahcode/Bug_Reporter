import React from "react";

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

const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  return (
    <div className="bug-card">
      <h4>{bug.title}</h4>
      <p>{bug.description}</p>
      <p><strong>Severity:</strong> {bug.severity}</p>
      <p><strong>Status:</strong> {bug.status}</p>
      {bug.reporterName && (
        <p><strong>Reporter:</strong> {bug.reporterName}</p>
      )}
    </div>
  );
};

export default BugCard;
