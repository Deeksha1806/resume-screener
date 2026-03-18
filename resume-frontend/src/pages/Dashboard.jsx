import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeId, setResumeId] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeId(response.data);
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const calculateATS = async () => {
    if (!resumeId) {
      alert("Please upload resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter job description");
      return;
    }

    setCalculating(true);
    try {
      const response = await API.post(
        `/resume/${resumeId}/score`,
        { jobDescription },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data);
      alert("ATS calculation failed");
    } finally {
      setCalculating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getProfileHealthItems = () => {
    const items = [];
    if (result?.name) items.push({ label: "Mention your full name", completed: true });
    if (result?.phone) items.push({ label: "Mention your Phone Number", completed: true });
    if (result?.email) items.push({ label: "Mention your location", completed: true });
    if (result?.exactMatches?.length >= 5) items.push({ label: "Add at least 5 skills to your profile", completed: true });
    return items;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Resume ATS Analyzer</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {!result ? (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Upload Your Resume</h2>
                <p className="text-slate-600">Start by uploading your resume file</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="text-slate-700 font-medium">
                    {file ? file.name : "Click to select your resume"}
                  </span>
                  <span className="text-slate-500 text-sm mt-1">PDF, DOC, or DOCX</span>
                </label>
              </div>

              {file && (
                <button
                  onClick={uploadResume}
                  disabled={uploading}
                  className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>
              )}
            </div>
          </div>

          {resumeId && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
                  <p className="text-slate-600">Paste the job description to match against</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  rows="10"
                  className="w-full border border-slate-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />

                <button
                  onClick={calculateATS}
                  disabled={calculating}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calculating ? "Analyzing..." : "Calculate ATS Score"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <button
              onClick={() => {
                setResult(null);
                setResumeId(null);
                setFile(null);
                setJobDescription("");
              }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Analyze Another Resume
            </button>
          </div>

          <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-red-500 h-24 rounded-t-xl"></div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 -mt-12">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(result.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {result.name || "Candidate Profile"}
                      </h2>
                      {result.email && (
                        <p className="text-slate-600 flex items-center gap-2 mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          {result.email}
                        </p>
                      )}
                      {result.phone && (
                        <p className="text-slate-600 flex items-center gap-2 mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          {result.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {result.links && Object.keys(result.links).length > 0 && (
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.links).map(([domain, url]) => (
                        <a
                          key={domain}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                          </svg>
                          {domain}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {result.exactMatches && result.exactMatches.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
  {(result.allSkills || result.exactMatches)?.map((skill, index) => (
    <span
      key={index}
      className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
    >
      {skill}
    </span>
  ))}
</div>
                </div>
              )}

              {result.relatedMatches && result.relatedMatches.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Related Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedMatches.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
{result.strengths && result.strengths.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Strengths</h3>
    <ul className="space-y-3">
      {result.strengths.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
)}

{/* Weaknesses */}
{result.weaknesses && result.weaknesses.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-h-80 overflow-y-auto">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Areas for Improvement</h3>
    <ul className="space-y-3">
      {result.weaknesses.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <span className="text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
)}

{/* Improvement Suggestions */}
{result.improvementSuggestions && result.improvementSuggestions.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-h-80 overflow-y-auto">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Improvement Suggestions</h3>
    <ul className="space-y-3">
      {result.improvementSuggestions.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-slate-600 text-sm font-semibold">{index + 1}</span>
          </div>
          <span className="text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
)}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
  <h3 className="font-semibold text-slate-900">Profile Health</h3>
  <p className="text-sm text-slate-500">
    ATS Score: {Math.round(result.score || 0)}%
  </p>
</div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (result.profileHealthScore || 0) / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">
                        {Math.round(result.profileHealthScore || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-600 mb-6">
                  Follow the recommendations below to enhance your profile score.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center justify-between">
                      Basic Info
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </h4>
                    <div className="space-y-2">
                      {getProfileHealthItems().map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-slate-700">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.exactMatches && result.exactMatches.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center justify-between">
                        Skills
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </h4>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-slate-700">
                          Add at least 5 skills to your profile
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
