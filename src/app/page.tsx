"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  Briefcase, 
  FileText, 
  Upload, 
  Sparkles, 
  Flame, 
  MessageSquare, 
  Compass, 
  ArrowUpRight, 
  ChevronDown, 
  Award, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BrainCircuit, 
  Heart,
  Lock,
  Play
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"score" | "roast" | "interview" | "copilot">("score");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tabs = [
    { id: "score", name: "ATS Score Analyzer", icon: FileText },
    { id: "roast", name: "AI Resume Roast 🔥", icon: Flame },
    { id: "interview", name: "Interview Simulator 🎙️", icon: MessageSquare },
    { id: "copilot", name: "AI Job Copilot 💼", icon: Compass },
  ];

  const faqs = [
    {
      q: "How accurate is the ATS scoring system?",
      a: "Our ATS parser is built on top of state-of-the-art NLP models that replicate parsing logic used by popular enterprise tools like Greenhouse, Workday, and Lever. It looks for exact match key phrases, format parsing errors, and quantifiable business impacts to give you a highly reliable readiness score."
    },
    {
      q: "What is the Resume Roast feature?",
      a: "Our AI Resume Roast is a brutal, high-fidelity feedback mechanism that exposes vague descriptions and weak resume bullet points, instantly replacing them with metrics-driven statements. It turns 'helped with database optimization' into high-impact, recruiter-friendly achievements."
    },
    {
      q: "How does the AI Interview Simulator work?",
      a: "The Interview Coach simulates live technical, HR, and behavioral interviews specific to your target job profile. It asks contextual questions, analyzes your voice-to-text or typed response, checks for structural formats (like the STAR method), and outputs immediate feedback scores."
    },
    {
      q: "What does the AI Job Copilot include?",
      a: "The Copilot upgrade unlocks a full job search operating system: an automated job matching feed, a Kanban application board, custom cover letter generators, personalized recruiter outreach assistants, cloud/dev skills gap checks, and chronological milestone career roadmaps."
    },
    {
      q: "Is there really a lifetime premium unlock?",
      a: "Yes! While basic scans are free, we have a lifetime premium unlock tier at just ₹199. It grants you unlimited access to the Resume Roast fixes, Interview Simulator sessions, customized Cover Letters, and the Career Roadmap generator without recurring monthly fees."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0B0F19] text-foreground">
      {/* Dynamic Ambient Background Meshes */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[35%] h-[35%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      {/* Floating Glassmorphic Header */}
      <nav className="w-full glass z-50 sticky top-0 border-b border-border/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Hire<span className="text-primary font-extrabold">AI</span>
            </span>
            <div className="hidden lg:flex items-center ml-4 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase tracking-wider animate-pulse">
              v2.0 Copilot Active
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors cursor-pointer">Features</a>
            <a href="#timeline" className="hover:text-primary transition-colors cursor-pointer">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors cursor-pointer">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors cursor-pointer">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-primary transition-all text-muted-foreground hover:translate-y-[-1px]">
              Log in
            </Link>
            <Link href="/dashboard" className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-1.5 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center mt-8 lg:mt-16 mb-24 relative">
          
          {/* Animated Header Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Next-Gen AI Career Operating System
          </motion.div>
          
          {/* Epic Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6 max-w-5xl leading-[1.05]"
          >
            Don't let <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-rose-400">ATS bots</span> reject you. <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Land 3x more interviews.</span>
          </motion.h1>
          
          {/* Hero Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-3xl leading-relaxed"
          >
            Instantly score resumes, auto-fix descriptions with structural roasts, simulate recruiter tech interviews, and auto-pilot your job searches with tailored Kanban trackers and roadmaps.
          </motion.p>
          
          {/* Main Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16 justify-center"
          >
            <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4.5 rounded-full font-bold text-lg hover:from-primary/95 hover:to-purple-600/95 transition-all hover:scale-[1.03] shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <Upload className="w-5 h-5 text-white animate-bounce" />
              Upload Resume - Scan Free
            </Link>
            <Link href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#131B2B]/60 text-white border border-border/80 px-8 py-4.5 rounded-full font-semibold text-lg hover:bg-[#131B2B] transition-all hover:border-primary/50">
              Explore Copilot Features <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          {/* Dynamic Social Proof Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-5 text-sm text-muted-foreground bg-card/40 border border-border/50 px-6 py-4 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-[#131B2B] border-2 border-[#0B0F19] flex items-center justify-center text-xs overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User Review" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="mt-0.5 font-medium">Trusted by <span className="text-white font-bold">12,000+ engineers</span> and students at top tech companies.</span>
            </div>
          </motion.div>

        </section>

        {/* INTERACTIVE DASHBOARD PREVIEW PANEL */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-primary/10 blur-[130px] rounded-full max-w-4xl mx-auto pointer-events-none" />
          
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">SaaS Simulator Preview</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">Experience HireAI in Action</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">Toggle between different modules below to preview our high-impact features instantly.</p>
          </div>

          <div className="glass-glow rounded-3xl overflow-hidden border border-border/60 shadow-2xl relative bg-[#131B2B]/60 backdrop-blur-md">
            
            {/* Simulation Header Tab Switches */}
            <div className="flex flex-wrap border-b border-border/60 bg-[#0B0F19]/60 p-2 sm:p-4 gap-2 justify-center sm:justify-start">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                      isSelected 
                        ? "text-white bg-primary/20 border border-primary/40 shadow-sm" 
                        : "text-muted-foreground hover:text-white hover:bg-card/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Simulation Inner Content Card with Framer Motion */}
            <div className="p-6 sm:p-10 min-h-[360px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                
                {/* 1. ATS Score Preview Tab */}
                {activeTab === "score" && (
                  <motion.div 
                    key="score"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-3 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ATS COMPATIBILITY ENGINE
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">Deep PDF Bullet Scanning</h3>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        Our parser evaluates syntax structure, metrics depth, layout, and job keyword frequency. It highlights weaknesses with surgical precision.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2 items-center text-xs sm:text-sm text-green-400 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          Parsed 4 quantifiable metric impact statements
                        </div>
                        <div className="flex gap-2 items-center text-xs sm:text-sm text-rose-400 font-medium">
                          <Flame className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          Warning: Missing critical developer keywords (e.g. CI/CD, Kubernetes)
                        </div>
                        <div className="flex gap-2 items-center text-xs sm:text-sm text-amber-400 font-medium font-mono">
                          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          Verdict: High callback conversion index predicted!
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="glass bg-[#0B0F19]/70 rounded-2xl p-6 border border-border/80 w-full max-w-[280px] shadow-xl text-center relative flex flex-col items-center">
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] border border-green-500/20 font-bold uppercase">
                          ATS Grade
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold uppercase mb-2">Resume Score</span>
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="50" stroke="#1E293B" strokeWidth="10" fill="transparent" />
                            <circle cx="64" cy="64" r="50" stroke="#6366F1" strokeWidth="10" fill="transparent" strokeDasharray="314" strokeDashoffset="314" className="animate-[dash_1.5s_ease-out_forwards]" style={{ strokeDashoffset: 314 - (314 * 88) / 100 }} />
                          </svg>
                          <span className="absolute text-3xl font-extrabold text-white">88</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-400 py-1 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                          Excellent Readiness Rank
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Resume Roast Preview Tab */}
                {activeTab === "roast" && (
                  <motion.div 
                    key="roast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase mb-1 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full w-fit">
                      <Flame className="w-3.5 h-3.5" />
                      AI BULLET REWRITE & ROAST
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Original bullet */}
                      <div className="glass bg-[#0B0F19]/40 border border-border rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Original Resume Line</span>
                          <p className="text-sm mt-2 text-gray-300 font-serif leading-relaxed italic">
                            "I wrote some python scripts for automating task deployments and helped optimize databases."
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-rose-400 uppercase mt-4">Status: Weak (No Impact Metrics)</span>
                      </div>

                      {/* Middle: The brutal AI Roast */}
                      <div className="glass bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 flex flex-col justify-between relative shadow-lg">
                        <div className="absolute top-2 right-2 animate-bounce">🔥</div>
                        <div>
                          <span className="text-[10px] font-bold text-rose-400 uppercase">AI Recruiter Roast</span>
                          <p className="text-xs sm:text-sm mt-2 text-rose-200/90 font-mono leading-relaxed">
                            "Standard backend description. Did you actually save company hours, or did you write ten lines of script automation that everyone forgot to run? Add measurable speed metrics."
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase mt-4">Action: Fix Initiated</span>
                      </div>

                      {/* Right: Perfect rewrite */}
                      <div className="glass bg-green-500/5 border border-green-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                        <div>
                          <span className="text-[10px] font-bold text-green-400 uppercase">Elite AI Rewrite (STAR Approved)</span>
                          <p className="text-sm mt-2 text-green-200 font-semibold leading-relaxed">
                            "Engineered 14+ automated Python provisioning pipelines, reducing multi-environment deployment overhead by 62% and reducing average database lookup queries by 35%."
                          </p>
                        </div>
                        <div className="flex gap-1.5 items-center mt-4">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-[10px] font-bold text-green-400 uppercase">Quantifiably Better</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 3. Interview Simulator Preview Tab */}
                {activeTab === "interview" && (
                  <motion.div 
                    key="interview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
                        <Award className="w-3.5 h-3.5 animate-pulse" />
                        TECHNICAL & BEHAVIORAL INTERVIEW COACH
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold">Interactive Recruiter Practice</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Prep for HR, behavioral (STAR method), and role-specific inquiries. Our coach reads your submission contextually and calculates an automated success rating.
                      </p>
                      
                      <div className="flex gap-3">
                        <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-border text-xs font-semibold text-gray-300">Technical Mode</div>
                        <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-border text-xs font-semibold text-gray-300">HR behavioral</div>
                        <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-border text-xs font-semibold text-gray-300">System Design</div>
                      </div>
                    </div>

                    <div className="glass bg-[#0B0F19]/60 border border-border rounded-2xl p-5 shadow-xl flex flex-col gap-4 font-mono text-xs">
                      <div className="border-b border-border/80 pb-2 flex justify-between items-center">
                        <span className="text-primary font-bold">● AI INTERVIEW SESSION</span>
                        <span className="text-amber-400 font-bold animate-pulse">RECORDING 🎙️</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                          <span className="text-[10px] font-bold text-primary">Interviewer (AI):</span>
                          <p className="text-xs text-gray-300 mt-1">
                            "Explain how you would handle an API rate limit crisis in a production environment."
                          </p>
                        </div>
                        
                        <div className="bg-card border border-border/80 rounded-xl p-3">
                          <span className="text-[10px] font-bold text-purple-400">Your Answer (STAR):</span>
                          <p className="text-xs text-gray-300 mt-1 italic">
                            "I'd implement Redis token-bucket rate limiters, configure a 429 Retry-After response, and activate secondary read-replicas for load shedding."
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border/80 text-[11px]">
                        <span className="text-green-400 font-bold">Feedback Score: 92%</span>
                        <span className="text-muted-foreground text-[10px]">Excellent Tech Framework</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. AI Job Copilot Preview Tab */}
                {activeTab === "copilot" && (
                  <motion.div 
                    key="copilot"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase mb-3 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full w-fit">
                        <Compass className="w-3.5 h-3.5 text-purple-400" />
                        AI JOB COPILOT DASHBOARD
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">Complete Career Search Command Deck</h3>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        Automatically match targeting preferences, track applications on interactive Kanban boards, draft AI Cover Letters, and generate hyper-customized LinkedIn outbound messages.
                      </p>
                      
                      <div className="flex gap-4 items-center">
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Kanban Board</span>
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Recruiter Outreach</span>
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Skill-Gap Roadmap</span>
                      </div>
                    </div>

                    <div className="glass bg-[#0B0F19]/60 border border-border rounded-2xl p-4 shadow-xl">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-b border-border/80 pb-2 mb-3">
                        <span>Mini Kanban Track</span>
                        <span className="text-primary uppercase tracking-wide">Pro Member active</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#0B0F19]/80 border border-border/80 rounded-xl p-2.5 text-center">
                          <span className="text-[10px] text-muted-foreground block font-bold mb-1">Applied</span>
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mx-auto">12</div>
                        </div>
                        
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-center shadow-lg relative">
                          <span className="text-[10px] text-primary block font-bold mb-1">Interviews</span>
                          <div className="w-7 h-7 rounded-full bg-primary/20 text-white text-xs font-extrabold flex items-center justify-center mx-auto animate-pulse">4</div>
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-2 h-2 rounded-full border border-[#0B0F19]" />
                        </div>
                        
                        <div className="bg-[#0B0F19]/80 border border-border/80 rounded-xl p-2.5 text-center">
                          <span className="text-[10px] text-muted-foreground block font-bold mb-1">Offers</span>
                          <div className="w-7 h-7 rounded-full bg-green-500/10 text-green-400 text-xs font-bold flex items-center justify-center mx-auto">2</div>
                        </div>
                      </div>

                      {/* Mock Drag Card */}
                      <div className="mt-3 bg-card border border-border/80 rounded-xl p-3 flex justify-between items-center shadow-md animate-[pulse_2s_infinite]">
                        <div>
                          <h4 className="text-[11px] font-bold text-white leading-tight">Software Engineer</h4>
                          <span className="text-[9px] text-muted-foreground">Stripe, Inc • Remote</span>
                        </div>
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">Moving to Int</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* METRIC ANALYTICS SHOWCASE */}
        <section className="mb-32 py-8 bg-[#131B2B]/40 rounded-3xl border border-border/40 backdrop-blur-sm relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl sm:text-5xl font-black text-white bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">120K+</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-2 uppercase tracking-wider">Resumes Analyzed</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-5xl font-black text-white bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">3.8x</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-2 uppercase tracking-wider">Interview Callback Increase</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-5xl font-black text-white bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">₹25K+</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-2 uppercase tracking-wider">Avg. Candidate Salary Increase</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-5xl font-black text-white bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">98.4%</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-2 uppercase tracking-wider">ATS Score Accuracy Rate</p>
            </div>
          </div>
        </section>

        {/* CORE PILLARS GRID */}
        <section id="features" className="py-16 relative">
          
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">Suite Modules</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2 leading-relaxed text-sm">
              Our advanced AI structures are customized to handle recruiters' exact parameters, bypass the tracking systems, and supercharge your landing speed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="glass-glow rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/25 border border-primary/30 flex items-center justify-center mb-6 shadow-md shadow-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI ATS Score Scan</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Upload your PDF format resume to scan for alignment metrics, formatting margins, active buzzwords, and keyword scores instantly.
                </p>
              </div>
              <Link href="/dashboard" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Run ATS Diagnostics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Card 2 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6 shadow-md shadow-purple-500/10">
                  <Flame className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Resume Roast + Auto-Fix</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Expose vague language, replace inactive bullet points, and instantly trigger AI rewrites structured around measurable business metrics.
                </p>
              </div>
              <Link href="/dashboard" className="text-purple-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Roast My Resume <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Card 3 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6 shadow-md shadow-amber-500/10">
                  <MessageSquare className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Interview Simulator</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Practice behavioral, HR, and custom technical interview rounds. Receive scored evaluation dashboards specific to targeted engineering tags.
                </p>
              </div>
              <Link href="/dashboard" className="text-amber-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Launch Coach Simulator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10">
                  <Compass className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Job Matching Feed</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Feed in target job definitions, salary bands, and regions. The match engine measures fit ratios and profiles your chances automatically.
                </p>
              </div>
              <Link href="/dashboard" className="text-emerald-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Compute Job Matches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="glass rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-md shadow-blue-500/10">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Kanban Application Tracker</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Pin targeting tracks, manage status stages, and analyze dynamic dashboard graphs to keep complete control of the job funnel.
                </p>
              </div>
              <Link href="/dashboard" className="text-blue-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Open Kanban board <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="glass-glow rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-border/80">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/25 border border-rose-500/30 flex items-center justify-center mb-6 shadow-md shadow-rose-500/10">
                  <BrainCircuit className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Skill Gap & Milestones Roadmap</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Uncover tech discrepancies between your stack and targeted roles. Generate personalized milestone schedules and timeline roadmaps.
                </p>
              </div>
              <Link href="/dashboard" className="text-rose-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                Audit Skills & Roadmaps <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS TIMELINE */}
        <section id="timeline" className="py-24 relative">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">Chronological Path</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">Your Career Journey with HireAI</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed text-sm">
              We guide you step-by-step from initial draft to final high-value compensation contracts.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Line for desktop, side line for mobile */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-rose-500" />

            <div className="space-y-12">
              
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="absolute left-2.5 md:left-1/2 w-3.5 h-3.5 rounded-full bg-primary border-4 border-[#0B0F19] -translate-x-[4px] md:-translate-x-[5px]" />
                <div className="w-full md:w-[45%] pl-8 md:pl-0 md:text-right">
                  <span className="text-primary text-xs font-bold uppercase tracking-wide">Step 01</span>
                  <h4 className="text-lg font-bold text-white mt-1">Upload & Score</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Submit your current resume draft. We instantly highlight critical parse issues and output a benchmark compatibility score.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="absolute left-2.5 md:left-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 border-4 border-[#0B0F19] -translate-x-[4px] md:-translate-x-[5px]" />
                <div className="hidden md:block w-[45%]" />
                <div className="w-full md:w-[45%] pl-8 md:pl-8">
                  <span className="text-purple-400 text-xs font-bold uppercase tracking-wide">Step 02</span>
                  <h4 className="text-lg font-bold text-white mt-1">Roast & Rewrite</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Activate the AI Roast engine to replace standard, passive descriptions with high-impact, metrics-driven achievements.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="absolute left-2.5 md:left-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 border-4 border-[#0B0F19] -translate-x-[4px] md:-translate-x-[5px]" />
                <div className="w-full md:w-[45%] pl-8 md:pl-0 md:text-right">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">Step 03</span>
                  <h4 className="text-lg font-bold text-white mt-1">Simulate & Train</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Launch our technical and behavioral interview coach simulator to build massive confidence and practice targeted STAR framework answers.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="absolute left-2.5 md:left-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 border-4 border-[#0B0F19] -translate-x-[4px] md:-translate-x-[5px]" />
                <div className="hidden md:block w-[45%]" />
                <div className="w-full md:w-[45%] pl-8 md:pl-8">
                  <span className="text-rose-400 text-xs font-bold uppercase tracking-wide">Step 04</span>
                  <h4 className="text-lg font-bold text-white mt-1">Match, Track & Land</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                    Automate job search matches, generate cover letters, deploy high-converting outbounds, audit skills, and lock down premium offers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS (WALL OF LOVE) */}
        <section id="testimonials" className="py-16 relative">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">Landed Roles at Top Platforms</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed text-sm">
              See how modern engineers, designers, and students are accelerating their career tracks with HireAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Review 1 */}
            <div className="glass rounded-3xl p-6 border border-border relative flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium italic">
                  "The AI Roast feature is absolutely phenomenal. It turned my generic backend bullet points into actual business impacts. Within 2 weeks of optimizing my resume, I secured technical interviews at Stripe and Meta!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#131B2B] border border-border">
                  <img src="https://i.pravatar.cc/100?img=33" alt="Candidate avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Rohit Sharma</h4>
                  <span className="text-[10px] text-primary font-bold">Platform Architect at Meta</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-glow rounded-3xl p-6 border border-primary/30 relative flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium italic">
                  "I was struggling to pass automated ATS parsers for remote jobs. Using HireAI's target keyword alignment and the built-in Interview Simulator, I had the exact vocabulary and confidence to lock in a remote developer role."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#131B2B] border border-border">
                  <img src="https://i.pravatar.cc/100?img=52" alt="Candidate avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Neha Patel</h4>
                  <span className="text-[10px] text-purple-400 font-bold">Senior DevOps Engineer</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="glass rounded-3xl p-6 border border-border relative flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium italic">
                  "The lifetime premium pass at ₹199 is hands down the best career investment I have ever made. The milestone roadmap alone outlined a custom portfolio strategy that impressed everyone on the hiring loop."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#131B2B] border border-border">
                  <img src="https://i.pravatar.cc/100?img=61" alt="Candidate avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Aarav Mehta</h4>
                  <span className="text-[10px] text-rose-400 font-bold">SDE-II at OpenAI</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PRICING DECK */}
        <section id="pricing" className="py-24 relative">
          
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">SaaS Subscriptions</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">Fair Pricing, Elite Value</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed text-sm">
              Start with diagnostic scans or unlock the entire, automated Job Copilot module with a single checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Tier */}
            <div className="glass rounded-3xl p-8 border border-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Base Diagnostics</span>
                <h3 className="text-2xl font-bold text-white mt-1">Free Basic Scan</h3>
                <p className="text-muted-foreground text-xs mt-2">Perfect for initial resume diagnostic checkups.</p>
                
                <div className="my-8">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-muted-foreground"> / free always</span>
                </div>

                <div className="border-t border-border/80 pt-6 space-y-4 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Free ATS compatibility score check</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Basic structural margin scans</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>AI Resume Roast rewrites locked</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Technical Interview Coach simulator locked</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>AI Copilot tools & milestone roadmaps locked</span>
                  </div>
                </div>
              </div>

              <Link href="/dashboard" className="w-full text-center block bg-[#131B2B] text-white border border-border px-6 py-3 rounded-full font-bold text-sm hover:bg-[#131B2B]/80 transition-all mt-8">
                Start Free Diagnosis
              </Link>
            </div>

            {/* Paid Tier */}
            <div className="glass-glow rounded-3xl p-8 border border-primary/50 relative flex flex-col justify-between shadow-2xl">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-purple-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                Most Popular
              </div>
              
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Career Booster pass</span>
                <h3 className="text-2xl font-bold text-white mt-1">Copilot Premium</h3>
                <p className="text-muted-foreground text-xs mt-2">Your complete automated job-search cockpit.</p>
                
                <div className="my-8 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-xs text-muted-foreground ml-1"> / one-time lifetime unlock</span>
                </div>

                <div className="border-t border-primary/20 pt-6 space-y-4 text-xs sm:text-sm text-gray-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited Resume Roast metric rewrites</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited Interview Practice rounds</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>LinkedIn keyword & profile boost analyzer</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Automatic job matching & Kanban tracker</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Cover Letter drafts & Recruiter Outreach sheets</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dev/Sys Skill Gap audit & milestone roadmaps</span>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/copilot" className="w-full text-center block bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3.5 rounded-full font-bold text-sm hover:from-primary/95 hover:to-purple-600/95 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.4)] mt-8">
                Unlock Copilot Suite - ₹199
              </Link>
            </div>

          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION DECK */}
        <section id="faq" className="py-16 max-w-4xl mx-auto relative">
          
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">Support Deck</span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2">
              Have questions about security, parsing engines, or custom sandbox checkouts? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="glass rounded-2xl overflow-hidden border border-border transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex justify-between items-center cursor-pointer hover:bg-card/40 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-[#0B0F19]/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="py-20 text-center relative mt-12">
          <div className="absolute inset-0 bg-primary/10 blur-[130px] rounded-full max-w-4xl mx-auto pointer-events-none" />
          
          <div className="glass-glow rounded-3xl p-8 sm:p-16 border border-primary/30 max-w-5xl mx-auto bg-gradient-to-r from-primary/5 to-purple-500/5 relative overflow-hidden backdrop-blur-sm">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black mb-6 max-w-3xl mx-auto tracking-tight">Stop guessing. Accelerate your career growth today.</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Unlock immediate scoring, technical interview simulators, custom outbound networking notes, and targeted milestone trackers. Start for free.
              </p>
              
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2.5 bg-white text-[#0B0F19] px-8 py-4.5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-white/5">
                Analyze My Resume <ArrowRight className="w-5 h-5 text-[#0B0F19]" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      {/* Premium Dark footer */}
      <footer className="w-full border-t border-border/50 bg-[#0B0F19] py-16 text-center text-muted-foreground relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">HireAI</span>
          </div>
          
          <p className="text-xs sm:text-sm">© 2026 HireAI. Made with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> for the modern candidate ecosystem.</p>
          
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
