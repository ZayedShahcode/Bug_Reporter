

import React, { useState, useEffect } from "react";
import BugCard from "../components/BugCard";

const severityOptions = ["Low", "Medium", "High"];


const BugReportForm: React.FC<{ onBugReported: () => void }> = ({ onBugReported }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true);
    
    const newErrors: any = {};
    if (formData.title.length < 5) newErrors.title = "Title must be at least 5 characters long";
    if (formData.title.length > 100) newErrors.title = "Title must be at most 100 characters";
    if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters long";
    if (formData.description.length > 2000) newErrors.description = "Description must be at most 2000 characters";
    if (!severityOptions.includes(formData.severity)) newErrors.severity = "Severity is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
  setFormData({ title: "", description: "", severity: "Low" });
        onBugReported();
      } else if (data.errors) {
        setErrors(data.errors);
      } else if (data.error) {
        setErrors({ general: data.error });
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <form className="bug-report-form" onSubmit={handleSubmit}>
      <h3>Report a New Bug</h3>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div>
        <label htmlFor="severity">Severity</label>
        <select
          name="severity"
          id="severity"
          value={formData.severity}
          onChange={handleChange}
          required
        >
          {severityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.severity && <span className="error">{errors.severity}</span>}
      </div>
      <div>
      </div>
      <button type="submit" disabled={loading}>Report Bug</button>
      {loading && <div>Reporting bug...</div>}
      {success && <div className="success">Bug reported successfully!</div>}
      {errors.general && <div className="error">{errors.general}</div>}
    </form>
  );
};

const BugList: React.FC = () => {
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchBugs = async () => {
    setLoading(true);
    setError("");
    try {
        //@ts-ignore
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
  }, []);

  return (
    <div className="bug-list">
      <h3>Your Reported Bugs</h3>
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

const Dashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const handleBugReported = () => {
    setRefresh((r) => !r);
  };
  return (
    <div className="dashboard-container">
      <BugReportForm onBugReported={handleBugReported} />
      <BugList key={refresh ? "refresh1" : "refresh0"} />
    </div>
  );
};

export default Dashboard;
