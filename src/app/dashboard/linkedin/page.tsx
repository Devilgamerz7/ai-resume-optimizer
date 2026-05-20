"use client";

import { useState } from "react";
import { Briefcase, Copy, Check, Sparkles, AlertCircle, Upload, RefreshCw } from "lucide-react";

export default function LinkedInOptimizer() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [aboutSection, setAboutSection] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please upload a resume first.");
      return;
    }
    if (!role.trim()) {
      setErrorMessage("Please enter your target role.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetRole", role);

    try {
      const response = await fetch("/api/optimize-linkedin", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to optimize profile.");
      }

      setHeadlines(data.data.headlines);
      setAboutSection(data.data.aboutSection);
      setGenerated(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred during optimization.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">LinkedIn Profile Optimizer</h1>
        <p className="text-muted-foreground">Generate highly optimized, keyword-rich headlines and compelling "About" sections to stand out to recruiters and rank high in searches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleGenerate} className="glass rounded-2xl p-6 space-y-6">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Target Role
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Target Job Title</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Resume Context</label>
                
                <div className="border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/10 transition-colors relative min-h-[120px]">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) {
                        if (selected.size > 5 * 1024 * 1024) {
                          setErrorMessage("File exceeds 5MB limit.");
                          return;
                        }
                        setFile(selected);
                        setErrorMessage("");
                      }
                    }}
                  />
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-foreground font-semibold px-2 break-all">
                    {file ? file.name : "Upload PDF or DOCX Resume"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    Max file size 5MB
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" /> We'll use this resume to tailor your keywords.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70 shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Optimizing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Generate Profile
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-8">
          {generated ? (
            <div className="space-y-6">
              <div className="glass-glow rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Optimized Headlines (Pick One)</h3>
                <div className="space-y-3">
                  {headlines.map((headline, index) => (
                    <div key={index} className="bg-background border border-border rounded-lg p-4 flex gap-4 items-start group">
                      <p className="flex-1 text-sm text-foreground leading-relaxed">{headline}</p>
                      <button 
                        onClick={() => copyToClipboard(headline, index)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
                  About Section
                  <button 
                    onClick={() => copyToClipboard(aboutSection, 99)}
                    className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedIndex === 99 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </h3>
                <div className="bg-background border border-border rounded-lg p-5">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {aboutSection}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button 
                  onClick={() => {
                    setGenerated(false);
                    setFile(null);
                    setRole("");
                  }}
                  className="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Optimize Another Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] glass rounded-2xl flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
              <div className="w-16 h-16 bg-muted/20 border border-border/50 rounded-full flex items-center justify-center mb-4 relative z-10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground relative z-10">Ready to stand out?</h3>
              <p className="text-muted-foreground max-w-sm text-sm relative z-10">Enter your target role and select a resume to generate your highly optimized LinkedIn headlines and summary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
