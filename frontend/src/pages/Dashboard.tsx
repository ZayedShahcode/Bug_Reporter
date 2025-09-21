

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
    <form className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-xl mx-auto border border-gray-200" onSubmit={handleSubmit}>
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">Report a New Bug</h3>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
      </div>
      <div className="mb-4">
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
        <select
          name="severity"
          id="severity"
          value={formData.severity}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {severityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.severity && <span className="text-red-500 text-xs">{errors.severity}</span>}
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50">Report Bug</button>
      {loading && <div className="text-blue-500 text-center">Reporting bug...</div>}
      {success && <div className="text-green-500 text-center">Bug reported successfully!</div>}
      {errors.general && <div className="text-red-500 text-center">{errors.general}</div>}
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
    <div className="max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-6 text-blue-700">Your Reported Bugs</h3>
      {loading && <div className="text-blue-500">Loading bugs...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bugs.map((bug) => (
          <BugCard key={bug.id} bug={bug} />
        ))}
        {(!loading && bugs.length === 0) && <div className="text-gray-500">No bugs reported yet.</div>}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const handleBugReported = () => {
    setRefresh((r) => !r);
  };

  if(!localStorage.getItem("token")){
    return(
        <div className="text-red-500 grid place-items-center">Please Login to view this page</div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <BugReportForm onBugReported={handleBugReported} />
      <BugList key={refresh ? "refresh1" : "refresh0"} />
    </div>
  );
};

export default Dashboard;
