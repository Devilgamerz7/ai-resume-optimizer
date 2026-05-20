"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Check, Lock, ArrowRight, Copy, Plus, Trash2,
  Briefcase, Compass, FileText, Share2, Award, Map, 
  MapPin, DollarSign, Calendar, ChevronRight, AlertCircle, 
  RefreshCw, CheckSquare, Bookmark, Users, ChevronLeft, HelpCircle
} from "lucide-react";
import { 
  JobMatchRecommendation, JobMatchResult, 
  CoverLetterResult, OutreachResult, 
  SkillGapResult, CareerRoadmapResult 
} from "@/lib/copilot-engine";

interface ApplicationCard {
  id: string;
  role: string;
  company: string;
  stage: "Saved" | "Applied" | "Screening" | "Interview" | "Offer" | "Rejected";
  date: string;
  notes: string;
  contact: string;
}

export default function JobCopilot() {
  // Tabs & Premium locks
  const [activeTab, setActiveTab] = useState<"matching" | "cover-letter" | "outreach" | "kanban" | "skill-gap" | "roadmap">("matching");
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"paywall" | "razorpay_select" | "razorpay_card" | "razorpay_upi" | "razorpay_processing" | "razorpay_success">("paywall");

  // Input states: Job Matching
  const [prefRole, setPrefRole] = useState("Software Engineer");
  const [prefLevel, setPrefLevel] = useState("Mid-level");
  const [prefIndustry, setPrefIndustry] = useState("Tech / SaaS");
  const [prefLocation, setPrefLocation] = useState("Remote");
  const [prefSalary, setPrefSalary] = useState("₹15 LPA - ₹25 LPA");
  const [matchingResult, setMatchingResult] = useState<JobMatchResult | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Input states: Cover Letter
  const [clTargetJob, setClTargetJob] = useState("Core API Framework");
  const [clCompany, setClCompany] = useState("Vercel");
  const [clRole, setClRole] = useState("Software Engineer");
  const [clJobDesc, setClJobDesc] = useState("");
  const [clResult, setClResult] = useState<CoverLetterResult | null>(null);
  const [isClLoading, setIsClLoading] = useState(false);
  const [isCopiedCl, setIsCopiedCl] = useState(false);

  // Input states: Outreach
  const [outRole, setOutRole] = useState("Software Engineer");
  const [outCompany, setOutCompany] = useState("Stripe");
  const [outType, setOutType] = useState("LinkedIn Request");
  const [outTone, setOutTone] = useState("Professional");
  const [outResult, setOutResult] = useState<OutreachResult | null>(null);
  const [isOutLoading, setIsOutLoading] = useState(false);
  const [isCopiedOut, setIsCopiedOut] = useState(false);

  // Input states: Skill Gap
  const [skillRole, setSkillRole] = useState("Software Engineer");
  const [skillIndustry, setSkillIndustry] = useState("Tech / SaaS");
  const [skillResult, setSkillResult] = useState<SkillGapResult | null>(null);
  const [isSkillLoading, setIsSkillLoading] = useState(false);

  // Input states: Career Roadmap
  const [roadCurrent, setRoadCurrent] = useState("Junior Engineer");
  const [roadTarget, setRoadTarget] = useState("Senior Systems Architect");
  const [roadLevel, setRoadLevel] = useState("Mid-level");
  const [roadResult, setRoadResult] = useState<CareerRoadmapResult | null>(null);
  const [isRoadLoading, setIsRoadLoading] = useState(false);

  // Kanban Stage Tracks
  const kanbanStages = ["Saved", "Applied", "Screening", "Interview", "Offer", "Rejected"] as const;
  const [applications, setApplications] = useState<ApplicationCard[]>([
    {
      id: "a1",
      role: "Senior Fullstack Developer",
      company: "Linear",
      stage: "Interview",
      date: "May 19, 2026",
      contact: "Sarah Jenkins (HR Recruiter)",
      notes: "Round 2 technical code refactor. Focus heavily on GraphQL performance optimizations."
    },
    {
      id: "a2",
      role: "Software Engineer",
      company: "Stripe",
      stage: "Applied",
      date: "May 15, 2026",
      contact: "automatic-receipt@stripe.com",
      notes: "Submitted via internal referral link."
    },
    {
      id: "a3",
      role: "API Systems Architect",
      company: "Retool",
      stage: "Offer",
      date: "May 18, 2026",
      contact: "David Miller (Engineering Director)",
      notes: "Received offer package: ₹28 LPA base + equity bonus. Reviewing contract clauses."
    }
  ]);

  // Add Kanban Application Form state
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppRole, setNewAppRole] = useState("");
  const [newAppCompany, setNewAppCompany] = useState("");
  const [newAppStage, setNewAppStage] = useState<"Saved" | "Applied" | "Screening" | "Interview" | "Offer" | "Rejected">("Saved");
  const [newAppDate, setNewAppDate] = useState("");
  const [newAppNotes, setNewAppNotes] = useState("");
  const [newAppContact, setNewAppContact] = useState("");

  // Payment inputs
  const [cardNo, setCardNo] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [upiId, setUpiId] = useState("candidate@upi");
  const [simulatedTxId, setSimulatedTxId] = useState("");

  // Fetch functions
  const handleFindMatches = async () => {
    setIsMatchingLoading(true);
    try {
      const response = await fetch("/api/generate-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "job-match",
          payload: { role: prefRole, level: prefLevel, industry: prefIndustry, location: prefLocation, salary: prefSalary }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMatchingResult(data.result);
    } catch (err: any) {
      alert(err.message || "Failed to generate job matches.");
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const handleCreateCoverLetter = async () => {
    setIsClLoading(true);
    setIsCopiedCl(false);
    try {
      const response = await fetch("/api/generate-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "cover-letter",
          payload: { targetJob: clTargetJob, companyName: clCompany, role: clRole, jobDesc: clJobDesc }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setClResult(data.result);
    } catch (err: any) {
      alert(err.message || "Failed to generate cover letter.");
    } finally {
      setIsClLoading(false);
    }
  };

  const handleCreateOutreach = async () => {
    setIsOutLoading(true);
    setIsCopiedOut(false);
    try {
      const response = await fetch("/api/generate-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "outreach",
          payload: { targetRole: outRole, companyName: outCompany, type: outType, tone: outTone }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setOutResult(data.result);
    } catch (err: any) {
      alert(err.message || "Failed to generate outreach templates.");
    } finally {
      setIsOutLoading(false);
    }
  };

  const handleAnalyzeSkillGap = async () => {
    setIsSkillLoading(true);
    try {
      const response = await fetch("/api/generate-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "skill-gap",
          payload: { role: skillRole, industry: skillIndustry }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSkillResult(data.result);
    } catch (err: any) {
      alert(err.message || "Failed to analyze skills.");
    } finally {
      setIsSkillLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsRoadLoading(true);
    try {
      const response = await fetch("/api/generate-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "roadmap",
          payload: { currentRole: roadCurrent, targetRole: roadTarget, level: roadLevel }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRoadResult(data.result);
    } catch (err: any) {
      alert(err.message || "Failed to generate roadmap.");
    } finally {
      setIsRoadLoading(false);
    }
  };

  // Pre-load default matches and skill gap on start
  useEffect(() => {
    handleFindMatches();
    handleAnalyzeSkillGap();
    handleGenerateRoadmap();
  }, []);

  // Copy helper
  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // Add application card
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppRole.trim() || !newAppCompany.trim()) {
      alert("Role and Company are required.");
      return;
    }
    const newCard: ApplicationCard = {
      id: `a_${Date.now()}`,
      role: newAppRole,
      company: newAppCompany,
      stage: newAppStage,
      date: newAppDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      notes: newAppNotes || "No notes added yet.",
      contact: newAppContact || "Not provided"
    };
    setApplications([...applications, newCard]);
    setShowAddAppModal(false);
    setNewAppRole("");
    setNewAppCompany("");
    setNewAppNotes("");
    setNewAppContact("");
    setNewAppDate("");
  };

  // Update card stage
  const handleMoveCard = (id: string, newStage: typeof kanbanStages[number]) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, stage: newStage } : app));
  };

  // Delete card
  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  // Calculate trackers
  const appliedCount = applications.filter(a => a.stage === "Applied" || a.stage === "Screening" || a.stage === "Interview" || a.stage === "Offer").length;
  const interviewCount = applications.filter(a => a.stage === "Interview").length;
  const successRate = applications.length === 0 ? 0 : Math.round((applications.filter(a => a.stage === "Offer").length / applications.length) * 100);

  return (
    <div className="space-y-8 relative">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent flex items-center gap-2.5">
            💼 AI Job Copilot
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Automate job matching, outreach Networking, ATS cover letters, and master your search stages.
          </p>
        </div>
        <button 
          onClick={() => {
            if (!isUpgraded) {
              setPaymentStep("paywall");
              setShowPaywallModal(true);
            }
          }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border flex items-center gap-1.5 transition-all ${
            isUpgraded 
              ? "bg-success/10 border-success/30 text-success cursor-default" 
              : "bg-primary text-white border-primary/20 hover:scale-[1.02] cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse"
          }`}
        >
          <Sparkles className="w-4 h-4 fill-current" />
          {isUpgraded ? "PRO MEMBER ACTIVE" : "UPGRADE TO PRO (₹199)"}
        </button>
      </div>

      {/* Tabs navigation grid */}
      <div className="glass rounded-xl p-1.5 border border-border/50 flex flex-wrap gap-1 select-none">
        {[
          { id: "matching", label: "Job Matches 💼", isPro: false },
          { id: "kanban", label: "Application Tracker 📋", isPro: false },
          { id: "cover-letter", label: "Cover Letter Generator 📝", isPro: false },
          { id: "outreach", label: "Recruiter Outreach 🤝", isPro: true },
          { id: "skill-gap", label: "Skill Gap Analyzer ⚡", isPro: true },
          { id: "roadmap", label: "Career Roadmap 🗺️", isPro: true }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.isPro && !isUpgraded) {
                setPaymentStep("paywall");
                setShowPaywallModal(true);
              } else {
                setActiveTab(tab.id as any);
              }
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-primary/10 border border-primary/20 text-primary" 
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.isPro && !isUpgraded && <Lock className="w-3 h-3 text-primary animate-pulse" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: AI Job Match Engine */}
        {activeTab === "matching" && (
          <motion.div
            key="matching"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Preferences Setup Card */}
              <div className="lg:col-span-4 glass rounded-2xl p-6 border border-border/50 space-y-4">
                <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                  ⚙️ Job Preferences
                </h3>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Target Role</label>
                    <input 
                      type="text" 
                      value={prefRole} 
                      onChange={(e) => setPrefRole(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Experience Level</label>
                    <select 
                      value={prefLevel} 
                      onChange={(e) => setPrefLevel(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    >
                      {["Fresher", "Junior", "Mid-level", "Senior"].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Target Industry</label>
                    <input 
                      type="text" 
                      value={prefIndustry} 
                      onChange={(e) => setPrefIndustry(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Preferred Location</label>
                    <input 
                      type="text" 
                      value={prefLocation} 
                      onChange={(e) => setPrefLocation(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Expected Salary</label>
                    <input 
                      type="text" 
                      value={prefSalary} 
                      onChange={(e) => setPrefSalary(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleFindMatches}
                  disabled={isMatchingLoading}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.01]"
                >
                  {isMatchingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Platform Database...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" /> Find Matching Jobs
                    </>
                  )}
                </button>
              </div>

              {/* Match recommendations results list */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-foreground">Recommended Role Compatibility</h3>
                  <span className="text-[10px] text-muted-foreground">3 customized active postings found</span>
                </div>

                {matchingResult?.recommendations.map((job) => (
                  <div key={job.id} className="glass rounded-2xl p-6 border border-border/60 hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                    {/* Glowing highlight indicator */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-purple-500" />
                    
                    {/* circular compatibility indicators */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center mx-auto md:mx-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-muted-foreground/10 fill-none" strokeWidth="5" />
                        <circle 
                          cx="40" cy="40" r="34" 
                          className="stroke-primary fill-none" 
                          strokeWidth="5" 
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 * (1 - job.matchScore / 100)}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-black text-foreground">{job.matchScore}%</span>
                        <span className="text-[7px] text-muted-foreground font-black uppercase">MATCH</span>
                      </div>
                    </div>

                    {/* Job metadata details */}
                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{job.role}</h4>
                          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="font-bold text-foreground bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-success" /> {job.salary}</span>
                          </div>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mx-auto md:mx-0 ${
                          job.selectionProbability === "High" 
                            ? "bg-success/10 border border-success/30 text-success" 
                            : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                        }`}>
                          {job.selectionProbability} Probability
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{job.whyMatch}</p>

                      <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                        {job.skillsMatched.map((s, i) => (
                          <span key={i} className="text-[9px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> {s}
                          </span>
                        ))}
                        {job.missingSkills.map((s, i) => (
                          <span key={i} className="text-[9px] font-extrabold text-red-400 bg-red-400/5 border border-red-400/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <AlertCircle className="w-2.5 h-2.5" /> Missing: {s}
                          </span>
                        ))}
                      </div>

                      {/* Cover letter direct bridge */}
                      <div className="pt-3 border-t border-border/40 flex justify-end">
                        <button 
                          onClick={() => {
                            setClCompany(job.company);
                            setClRole(job.role);
                            setClTargetJob(`Matched Job Profile #${job.id}`);
                            setActiveTab("cover-letter");
                          }}
                          className="text-xs text-primary hover:text-primary/80 font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
                        >
                          <FileText className="w-4 h-4" /> Draft Cover Letter <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: AI Cover Letter Generator */}
        {activeTab === "cover-letter" && (
          <motion.div
            key="cover-letter"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-5 glass rounded-2xl p-6 border border-border/50 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                📝 Letter Settings
              </h3>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Company</label>
                  <input 
                    type="text" 
                    value={clCompany} 
                    onChange={(e) => setClCompany(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Role</label>
                  <input 
                    type="text" 
                    value={clRole} 
                    onChange={(e) => setClRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Job Posting Ref / ID</label>
                  <input 
                    type="text" 
                    value={clTargetJob} 
                    onChange={(e) => setClTargetJob(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Optional Job Description</label>
                  <textarea 
                    value={clJobDesc} 
                    onChange={(e) => setClJobDesc(e.target.value)}
                    placeholder="Paste job description keywords to maximize ATS matches..."
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateCoverLetter}
                disabled={isClLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isClLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling ATS Cover Letter...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" /> Generate Cover Letter
                  </>
                )}
              </button>
            </div>

            {/* Letter Preview Column */}
            <div className="lg:col-span-7 glass rounded-2xl p-6 border border-border/50 flex flex-col justify-between min-h-[450px]">
              {clResult ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">ATS COMPATIBLE TEMPLATE</span>
                    <button
                      onClick={() => copyToClipboard(`${clResult.subject}\n\n${clResult.salutation}\n\n${clResult.bodyText}\n\n${clResult.closing}`, setIsCopiedCl)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg cursor-pointer bg-background/50 hover:bg-background transition-colors"
                    >
                      <Copy className="w-4 h-4" /> {isCopiedCl ? "Copied!" : "Copy Letter"}
                    </button>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed text-foreground font-mono flex-1 py-4 overflow-y-auto">
                    <div className="bg-[#070b13] border border-border rounded-xl p-4 font-sans text-xs">
                      <span className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Subject Line:</span>
                      <strong className="text-foreground">{clResult.subject}</strong>
                    </div>

                    <p className="font-semibold">{clResult.salutation}</p>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{clResult.bodyText}</p>
                    <p className="font-semibold whitespace-pre-line pt-2">{clResult.closing}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center my-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">No Cover Letter Generated</h4>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Set your company name, role, and details on the left, then click Generate to construct an ATS-optimized, high-converting recruiter narrative.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Recruiter Outreach Assistant */}
        {activeTab === "outreach" && (
          <motion.div
            key="outreach"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form config */}
            <div className="lg:col-span-5 glass rounded-2xl p-6 border border-border/50 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                🤝 Networking Options
              </h3>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Role</label>
                  <input 
                    type="text" 
                    value={outRole} 
                    onChange={(e) => setOutRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Company</label>
                  <input 
                    type="text" 
                    value={outCompany} 
                    onChange={(e) => setOutCompany(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Outreach Message Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {["LinkedIn Request", "Recruiter Follow-up", "Referral Request"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setOutType(t)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-left cursor-pointer ${
                          outType === t 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Communication Tone</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Professional", "Confident", "Friendly", "Concise"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setOutTone(t)}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                          outTone === t 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateOutreach}
                disabled={isOutLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isOutLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Drafting Outreach Copy...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Generate Outreach Template
                  </>
                )}
              </button>
            </div>

            {/* Outreach preview */}
            <div className="lg:col-span-7 glass rounded-2xl p-6 border border-border/50 flex flex-col justify-between min-h-[450px]">
              {outResult ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">COPYRIGHT APPROVED OUTREACH</span>
                    <button
                      onClick={() => copyToClipboard(outResult.bodyText, setIsCopiedOut)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg cursor-pointer bg-background/50 hover:bg-background transition-colors"
                    >
                      <Copy className="w-4 h-4" /> {isCopiedOut ? "Copied!" : "Copy Text"}
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-6">
                    <div className="bg-[#070b13] border border-primary/20 rounded-2xl p-6 relative overflow-hidden font-sans text-xs leading-relaxed text-foreground select-text whitespace-pre-line leading-relaxed shadow-inner">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[50px]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary block mb-3">Suggested Message body:</span>
                      "{outResult.bodyText}"
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    💡 <strong>Pro Tip:</strong> Personalize the greeting with the recruiter's actual name to increase response rates by 22%.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center my-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">No Outreach Drafted</h4>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Choose outreach types (referrals, recruiters, requests) and set your custom communication tone on the left.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Kanban Board tracker */}
        {activeTab === "kanban" && (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Analytics mini bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">Saved Posts</span>
                <span className="text-2xl font-black text-white mt-1 block">{applications.filter(a => a.stage === "Saved").length}</span>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">Applied Count</span>
                <span className="text-2xl font-black text-primary mt-1 block">{appliedCount}</span>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">Active Interviews</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">{interviewCount}</span>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">Offer Conversion Rate</span>
                <span className="text-2xl font-black text-success mt-1 block">{successRate}%</span>
              </div>
            </div>

            {/* Stage title header with controls */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">Kanban Application Tracks</h3>
              <button 
                onClick={() => setShowAddAppModal(true)}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-4 h-4" /> Add Application
              </button>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start select-none">
              {kanbanStages.map((stage) => {
                const stageApps = applications.filter(a => a.stage === stage);
                
                // Color badges
                let badgeColor = "bg-muted";
                if (stage === "Applied") badgeColor = "bg-primary";
                else if (stage === "Screening") badgeColor = "bg-yellow-400";
                else if (stage === "Interview") badgeColor = "bg-purple-400";
                else if (stage === "Offer") badgeColor = "bg-success";
                else if (stage === "Rejected") badgeColor = "bg-red-500";

                return (
                  <div key={stage} className="glass rounded-xl p-3 border border-border/40 bg-background/25 flex flex-col space-y-3 min-h-[350px]">
                    <div className="flex items-center justify-between pb-2 border-b border-border/40">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${badgeColor}`} />
                        <span className="text-xs font-extrabold text-foreground">{stage}</span>
                      </div>
                      <span className="text-[9px] font-black text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {stageApps.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {stageApps.map((app) => (
                        <div key={app.id} className="bg-[#070b13] border border-border/80 rounded-xl p-3.5 hover:border-primary/30 transition-all space-y-2 relative group">
                          {/* Options floating delete */}
                          <button
                            onClick={() => handleDeleteCard(app.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-transparent hover:border-red-400/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[8px] font-black text-primary uppercase tracking-widest block">{app.company}</span>
                          <h4 className="text-xs font-bold text-foreground leading-snug">{app.role}</h4>
                          
                          <p className="text-[10px] text-muted-foreground leading-normal mt-1 border-t border-border/30 pt-1.5 font-medium whitespace-pre-line">
                            {app.notes}
                          </p>

                          <div className="text-[8px] text-muted-foreground flex justify-between items-center pt-2 border-t border-border/20">
                            <span className="font-mono">{app.date}</span>
                            <span className="max-w-[70px] truncate text-right">{app.contact}</span>
                          </div>

                          {/* Quick stage shifts */}
                          <div className="flex gap-1 justify-end pt-1 border-t border-border/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <select 
                              value={app.stage}
                              onChange={(e) => handleMoveCard(app.id, e.target.value as any)}
                              className="text-[9px] bg-background border border-border rounded px-1 text-muted-foreground focus:outline-none w-full"
                            >
                              {kanbanStages.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageApps.length === 0 && (
                        <div className="py-8 text-center text-[10px] text-muted-foreground italic border border-dashed border-border/40 rounded-xl">
                          Column empty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 5: Skill Gap Analyzer */}
        {activeTab === "skill-gap" && (
          <motion.div
            key="skill-gap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form */}
            <div className="lg:col-span-4 glass rounded-2xl p-6 border border-border/50 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                ⚡ Role Analyzer Setup
              </h3>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Career Role</label>
                  <input 
                    type="text" 
                    value={skillRole} 
                    onChange={(e) => setSkillRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Industry</label>
                  <input 
                    type="text" 
                    value={skillIndustry} 
                    onChange={(e) => setSkillIndustry(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeSkillGap}
                disabled={isSkillLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isSkillLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Performing Skill Audits...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" /> Run Skill Gap Analysis
                  </>
                )}
              </button>
            </div>

            {/* Analysis details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass rounded-2xl p-6 border border-border/50 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">Estimated Recruitment Boost</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {skillResult?.eligibilityImpact || `Adding specific container systems to your resume will increase your ${skillRole} eligibility by 46% for tech companies.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Missing Skills */}
                <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
                  <h4 className="font-bold text-sm text-foreground border-b border-border/50 pb-2 flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-4 h-4" /> Identified Skill Gaps
                  </h4>
                  <ul className="space-y-3">
                    {skillResult?.missingSkills.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Certifications and road steps */}
                <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
                  <h4 className="font-bold text-sm text-foreground border-b border-border/50 pb-2 flex items-center gap-1.5 text-success">
                    <CheckSquare className="w-4 h-4" /> Recommended Certifications
                  </h4>
                  <ul className="space-y-3">
                    {skillResult?.certifications.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0 mt-1.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Steps Roadmap */}
              <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
                <h4 className="font-bold text-sm text-foreground border-b border-border/50 pb-2">
                  🛠️ Actionable Improvement Steps
                </h4>
                <div className="space-y-4">
                  {skillResult?.roadmapSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 6: AI Career Roadmap Progression */}
        {activeTab === "roadmap" && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form inputs */}
            <div className="lg:col-span-4 glass rounded-2xl p-6 border border-border/50 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                🗺️ Roadmap Setup
              </h3>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Current Role</label>
                  <input 
                    type="text" 
                    value={roadCurrent} 
                    onChange={(e) => setRoadCurrent(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Executive Role</label>
                  <input 
                    type="text" 
                    value={roadTarget} 
                    onChange={(e) => setRoadTarget(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Target Level</label>
                  <select 
                    value={roadLevel} 
                    onChange={(e) => setRoadLevel(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  >
                    {["Fresher", "Junior", "Mid-level", "Senior"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateRoadmap}
                disabled={isRoadLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isRoadLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Milestones...
                  </>
                ) : (
                  <>
                    <Map className="w-4 h-4" /> Generate Career Roadmap
                  </>
                )}
              </button>
            </div>

            {/* Progression Vertical Timeline Map */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">Interactive Career Milestones</h3>
                <span className="text-[10px] text-muted-foreground">12-Month strategic plan</span>
              </div>

              <div className="relative pl-8 border-l border-border/50 space-y-8 select-none">
                {roadResult?.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle bullet nodes */}
                    <div className="absolute -left-[41px] top-1.5 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center text-[10px] font-extrabold text-primary group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all">
                      {idx + 1}
                    </div>

                    <div className="glass rounded-2xl p-6 border border-border/50 space-y-3 hover:border-primary/20 transition-colors relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[50px] pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/30">
                        <div>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest block">{step.phase}</span>
                          <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                        </div>
                        <div className="flex gap-2 items-center text-xs font-bold shrink-0 self-start sm:self-center">
                          <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-muted-foreground">{step.timeline}</span>
                          <span className="bg-success/15 border border-success/30 px-2.5 py-0.5 rounded-md text-success">{step.salaryEstimate}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase block">Skills to acquire:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.skillsRequired.map((s, i) => (
                            <span key={i} className="text-[9px] font-bold text-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#070b13] border border-border rounded-xl p-3 text-xs leading-relaxed text-muted-foreground relative">
                        <strong className="text-primary block mb-0.5">🚀 Recommended Portfolio Project:</strong>
                        {step.recommendedProject}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Application Add Modal Dialog */}
      <AnimatePresence>
        {showAddAppModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-background border border-border/80 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <h3 className="font-black text-sm uppercase text-primary tracking-widest flex items-center gap-1.5">
                  📋 Add Application Card
                </h3>
                <button onClick={() => setShowAddAppModal(false)} className="text-muted-foreground hover:text-foreground text-xs font-bold underline cursor-pointer">
                  Close
                </button>
              </div>

              <form onSubmit={handleAddApplication} className="space-y-4 text-xs font-bold">
                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase block">Target Job Role</label>
                  <input 
                    type="text" 
                    required 
                    value={newAppRole} 
                    onChange={(e) => setNewAppRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase block">Target Company</label>
                  <input 
                    type="text" 
                    required 
                    value={newAppCompany} 
                    onChange={(e) => setNewAppCompany(e.target.value)}
                    placeholder="e.g. Stripe, OpenAI"
                    className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase block">Kanban Stage</label>
                    <select
                      value={newAppStage}
                      onChange={(e) => setNewAppStage(e.target.value as any)}
                      className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                    >
                      {kanbanStages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase block">Date Submitted</label>
                    <input 
                      type="text" 
                      value={newAppDate} 
                      onChange={(e) => setNewAppDate(e.target.value)}
                      placeholder="e.g. May 19, 2026"
                      className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase block">Primary Contact Person</label>
                  <input 
                    type="text" 
                    value={newAppContact} 
                    onChange={(e) => setNewAppContact(e.target.value)}
                    placeholder="e.g. John Smith (Engineering EM)"
                    className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-muted-foreground uppercase block">Target Application Notes</label>
                  <textarea 
                    value={newAppNotes} 
                    onChange={(e) => setNewAppNotes(e.target.value)}
                    placeholder="Describe interviews rounds, follow-up timeline logs..."
                    rows={3}
                    className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-extrabold text-xs cursor-pointer shadow-lg hover:bg-primary/95 transition-all mt-4"
                >
                  Confirm & Pin Application Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Razorpay Checkout Portal Overlay */}
      <AnimatePresence>
        {showPaywallModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-background border border-border/80 rounded-2xl shadow-2xl overflow-hidden relative"
            >
              {/* Razorpay header */}
              <div className="bg-[#1780e3] p-6 text-white relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Simulated Merchant</span>
                    <h3 className="text-lg font-black tracking-tight">HireAI Premium Checkout</h3>
                    <p className="text-xs text-blue-100 font-medium">Unlock recruiter-grade interview features</p>
                  </div>
                  <button 
                    onClick={() => setShowPaywallModal(false)}
                    className="text-white/60 hover:text-white text-xs underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Razorpay content */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-border rounded-xl p-4">
                  <div>
                    <span className="text-xs font-bold text-foreground">AI Career Copilot Pass</span>
                    <span className="text-[10px] text-muted-foreground block">Unlimited job matches, roadmaps & outlines</span>
                  </div>
                  <span className="text-lg font-black text-primary">₹199</span>
                </div>

                {paymentStep === "paywall" && (
                  <div className="space-y-4 text-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      To complete testing of our commercial career suite, select your simulated payment sandbox standard below:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentStep("razorpay_card")}
                        className="py-3 px-4 rounded-xl border border-border bg-[#070b13] hover:border-[#1780e3]/40 cursor-pointer text-xs font-bold text-foreground transition-all"
                      >
                        💳 Card Payment
                      </button>
                      <button
                        onClick={() => setPaymentStep("razorpay_upi")}
                        className="py-3 px-4 rounded-xl border border-border bg-[#070b13] hover:border-[#1780e3]/40 cursor-pointer text-xs font-bold text-foreground transition-all"
                      >
                        📱 UPI Sandbox
                      </button>
                    </div>
                  </div>
                )}

                {/* Card input */}
                {paymentStep === "razorpay_card" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNo} 
                        onChange={(e) => setCardNo(e.target.value)}
                        className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Expiry Date</label>
                        <input 
                          type="text" 
                          value={cardExpiry} 
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">CVV</label>
                        <input 
                          type="password" 
                          value={cardCvv} 
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none text-center"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPaymentStep("razorpay_processing");
                        setTimeout(() => {
                          setSimulatedTxId(`pay_${Math.random().toString(36).substring(2, 11)}`);
                          setPaymentStep("razorpay_success");
                        }, 1800);
                      }}
                      className="w-full bg-[#1780e3] hover:bg-[#1571c9] text-white py-3 rounded-xl text-xs font-black cursor-pointer shadow-lg mt-4"
                    >
                      Process Simulated Card Pay (₹199)
                    </button>
                  </div>
                )}

                {/* UPI Input */}
                {paymentStep === "razorpay_upi" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Virtual Payment Address (VPA)</label>
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-[#070b13] border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setPaymentStep("razorpay_processing");
                        setTimeout(() => {
                          setSimulatedTxId(`pay_${Math.random().toString(36).substring(2, 11)}`);
                          setPaymentStep("razorpay_success");
                        }, 1800);
                      }}
                      className="w-full bg-[#1780e3] hover:bg-[#1571c9] text-white py-3 rounded-xl text-xs font-black cursor-pointer shadow-lg mt-4"
                    >
                      Verify & simulated UPI Pay (₹199)
                    </button>
                  </div>
                )}

                {/* Processing Spinner */}
                {paymentStep === "razorpay_processing" && (
                  <div className="py-12 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-[#1780e3] animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground font-medium">Securing connection to simulated bank gateway...</p>
                  </div>
                )}

                {/* Payment Success */}
                {paymentStep === "razorpay_success" && (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto border border-success/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-foreground">Simulated Payment Captured!</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">Transaction ID: <code className="text-primary font-bold">{simulatedTxId}</code></p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUpgraded(true);
                        setShowPaywallModal(false);
                      }}
                      className="w-full bg-success hover:bg-success/90 text-white py-3 rounded-xl text-xs font-black cursor-pointer shadow-lg mt-4"
                    >
                      Return to Copilot Master Workspace
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
