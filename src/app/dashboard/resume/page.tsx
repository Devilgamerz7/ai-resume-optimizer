"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle, ArrowRight, Download, Target, Zap, Sparkles } from "lucide-react";
import type { ATSAnalysisResult } from "@/lib/gemini-engine";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "complete" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<ATSAnalysisResult | null>(null);
  const [analyzeText, setAnalyzeText] = useState("Uploading file...");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setStatus("uploading");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", selectedFile);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription);
      }

      try {
        setAnalyzeText("Extracting text and identifying ATS keywords...");
        setStatus("analyzing");

        const response = await fetch("/api/analyze-resume", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to analyze resume.");
        }

        setResults(data.data);
        setStatus("complete");
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error.message || "An unexpected error occurred.");
        setStatus("error");
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-yellow-400";
    return "text-warning";
  };

  const getScoreStroke = (score: number) => {
    // 251 is roughly the circumference of our svg circle
    return `${(score / 100) * 251} 251`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume and optional job description for a real-time, recruiter-grade ATS evaluation.</p>
      </div>

      <AnimatePresence mode="wait">
        {(status === "idle" || status === "error") && (
          <motion.div
            key="input-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Job Description Input */}
            <div className="glass rounded-2xl p-6">
              <label className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-primary" /> Target Job Description (Optional)
              </label>
              <p className="text-sm text-muted-foreground mb-4">Paste the job description here to get specific keyword matching and tailored advice.</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a Senior Frontend Engineer with 5+ years of React experience..."
                className="w-full bg-background border border-border rounded-xl p-4 min-h-[150px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
              />
            </div>

            {/* Upload Zone */}
            <div className="glass-glow border-2 border-dashed border-primary/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 transition-colors relative overflow-hidden group">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Upload Resume to Analyze</h3>
              <p className="text-muted-foreground mb-6 relative z-10">Supports PDF, DOCX (Max 5MB)</p>
              <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 relative z-10 pointer-events-none">
                Select File
              </button>
            </div>

            {status === "error" && (
              <div className="bg-warning/10 border border-warning/50 text-warning p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}
          </motion.div>
        )}

        {(status === "uploading" || status === "analyzing") && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="glass rounded-2xl p-16 flex flex-col items-center justify-center text-center min-h-[400px]"
          >
            <div className="relative w-32 h-32 mb-8">
              {/* Spinner animation */}
              <div className="absolute inset-0 border-4 border-muted rounded-full opacity-20" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              AI Analysis in Progress
            </h3>
            <p className="text-muted-foreground animate-pulse">
              {analyzeText}
            </p>
          </motion.div>
        )}

        {status === "complete" && results && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Score Card */}
            <div className="glass-glow rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted opacity-20" />
                  <motion.circle
                    initial={{ strokeDasharray: "0 251" }}
                    animate={{ strokeDasharray: getScoreStroke(results.atsScore) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                    className={getScoreColor(results.atsScore)}
                  />
                </svg>
                <div className="flex flex-col items-center justify-center z-10">
                  <span className={`text-6xl font-extrabold tracking-tighter ${getScoreColor(results.atsScore)}`}>
                    {results.atsScore}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">ATS Score</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3">{results.summary}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 justify-center md:justify-start">
                  <span className="bg-background px-3 py-1.5 rounded-full border border-border">Industry: {results.industryFit}</span>
                  <span className="bg-background px-3 py-1.5 rounded-full border border-border">Level: {results.seniorityLevel}</span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105">
                    <Zap className="w-5 h-5 fill-current" /> Auto-Fix Resume (₹199)
                  </button>
                  <button className="bg-muted text-foreground px-6 py-3 rounded-full font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Weaknesses */}
              <div className="glass rounded-2xl p-8 border-t-4 border-t-warning">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><XCircle className="w-6 h-6 text-warning" /> Critical Weaknesses</h3>
                <ul className="space-y-4">
                  {results.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
                      <span className="text-warning mt-1">•</span>
                      {w}
                    </li>
                  ))}
                  {results.weaknesses.length === 0 && <p className="text-sm text-muted-foreground">No major weaknesses found!</p>}
                </ul>
              </div>

              {/* Strengths */}
              <div className="glass rounded-2xl p-8 border-t-4 border-t-success">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-success" /> Key Strengths</h3>
                <ul className="space-y-4">
                  {results.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
                      <span className="text-success mt-1">•</span>
                      {s}
                    </li>
                  ))}
                  {results.strengths.length === 0 && <p className="text-sm text-muted-foreground">No major strengths identified.</p>}
                </ul>
              </div>

              {/* Missing Keywords & Skills */}
              <div className="glass rounded-2xl p-8 md:col-span-2">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> ATS Missing Keywords & Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {[...results.missingKeywords, ...results.missingSkills].map((kw, i) => (
                    <span key={i} className="bg-warning/10 text-warning border border-warning/20 px-3 py-1.5 rounded-md text-sm font-medium">
                      {kw}
                    </span>
                  ))}
                  {results.missingKeywords.length === 0 && results.missingSkills.length === 0 && (
                    <p className="text-sm text-success font-medium">Excellent keyword match! No critical skills missing.</p>
                  )}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="glass-glow rounded-2xl p-8 md:col-span-2">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary" /> AI Actionable Recommendations</h3>
                <div className="space-y-4">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className="bg-background/50 border border-border rounded-xl p-4 text-sm text-foreground/90">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="text-center pt-8 pb-4">
              <button
                onClick={() => {
                  setStatus("idle");
                  setFile(null);
                  setResults(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Scan another resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
