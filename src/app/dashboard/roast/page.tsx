"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, Upload, FileText, XCircle, AlertCircle, ArrowRight, 
  Sparkles, Lock, Check, Share2, RefreshCw, ExternalLink
} from "lucide-react";
import type { ResumeRoastResult } from "@/lib/roast-engine";

export default function ResumeRoaster() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "roasting" | "complete" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<ResumeRoastResult | null>(null);
  const [roastProgressText, setRoastProgressText] = useState("Igniting the fire...");
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [activeFailureTab, setActiveFailureTab] = useState(0);
  const [paymentStep, setPaymentStep] = useState<"paywall" | "razorpay_select" | "razorpay_card" | "razorpay_upi" | "razorpay_processing" | "razorpay_success">("paywall");
  const [cardNo, setCardNo] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [upiId, setUpiId] = useState("candidate@upi");
  const [simulatedTxId, setSimulatedTxId] = useState("");

  const roastPhrases = [
    "Igniting the fire...",
    "Summoning angry recruiters...",
    "Shredding passive voice...",
    "Applying severe emotional damage...",
    "Scanning for actual achievements (none found yet)...",
    "Preheating the roasting chamber..."
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File is too large. Max limit is 5MB.");
      setStatus("error");
      return;
    }

    setFile(selectedFile);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription);
    }

    try {
      setStatus("roasting");
      
      let phraseIndex = 0;
      const interval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % roastPhrases.length;
        setRoastProgressText(roastPhrases[phraseIndex]);
      }, 1500);

      const response = await fetch("/api/roast-resume", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to roast resume.");
      }

      setResults(data.data);
      setStatus("complete");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred during roasting.");
      setStatus("error");
    }
  };

  const handleShare = (platform: "twitter" | "linkedin" | "whatsapp") => {
    if (!results) return;
    const text = encodeURIComponent(results.shareableQuote);
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "");
    
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${text}`;
    }
    
    window.open(shareUrl, "_blank");
  };

  const getScoreColor = (score: number) => {
    if (score <= 15) return "text-red-500 stroke-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (score <= 30) return "text-orange-500 stroke-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]";
    return "text-yellow-500 stroke-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]";
  };

  const getScoreBadge = (score: number) => {
    if (score <= 15) return "🔥 Absolute Trash";
    if (score <= 30) return "💀 Formatting Terrorist";
    return "🤡 Average Underachiever";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse fill-current" /> AI Resume Roast
          </h1>
          <p className="text-muted-foreground">Upload your resume to get roasted by savage recruiters, get your actual ATS bugs caught, and auto-fix them instantly.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-2xl border border-border/50">
              <label className="font-bold text-sm text-foreground/90 uppercase tracking-wider flex items-center gap-2 mb-2">
                🎯 Target Job Description (Optional)
              </label>
              <p className="text-sm text-muted-foreground mb-4">Provide a job description to let the AI specifically roast how unqualified you are for it.</p>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a Senior Product Designer with 6+ years of SaaS experience, expertise in Framer Motion, and high visual standards..."
                className="w-full h-32 bg-background/50 border border-border/50 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="glass-glow border-2 border-dashed border-orange-500/40 rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-500/5 transition-colors relative overflow-hidden group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
              />
              
              {/* Floating Sparks */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[1px] pointer-events-none opacity-60"
                  style={{ left: `${15 + i * 15}%` }}
                  animate={{
                    y: [-10, -250],
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    opacity: [0.6, 0]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: i * 0.4
                  }}
                />
              ))}
              
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <Flame className="w-10 h-10 text-orange-500 animate-bounce" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors relative z-10">
                Feed Your Resume to the Fire
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm relative z-10">
                Drag and drop your PDF or DOCX file here, or click to browse. Max file size 5MB.
              </p>
              <div className="absolute -inset-x-20 bottom-0 h-40 bg-gradient-to-t from-orange-500/5 to-transparent blur-[60px] pointer-events-none" />
            </div>
          </motion.div>
        )}

        {(status === "uploading" || status === "roasting") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-2xl p-16 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px] border border-orange-500/30 relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
            
            {/* Swirling Fire Ring */}
            <div className="relative w-24 h-24 mb-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500 border-l-transparent border-b-transparent shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-red-500 border-t-transparent border-r-transparent shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              />
              <div className="absolute inset-4 bg-background border border-orange-500/20 rounded-full flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500 animate-pulse fill-current" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {roastProgressText}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Our elite recruiter committee is currently reviewing your resume. Brace yourself for emotional damage.
            </p>
            
            <div className="w-64 h-1.5 bg-background rounded-full overflow-hidden border border-border">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              />
            </div>
          </motion.div>
        )}

        {status === "complete" && results && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="glass rounded-2xl p-8 border border-orange-500/30 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 blur-[120px] pointer-events-none" />
              
              <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                {/* Glowing ring background */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10 animate-pulse blur-[10px]" />
                
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted opacity-10" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 251" }}
                    animate={{ strokeDasharray: `${(results.roastScore / 100) * 251} 251` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round" 
                    className={getScoreColor(results.roastScore)} 
                  />
                </svg>
                <div className="flex flex-col items-center justify-center z-10 text-center">
                  <motion.span 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="text-5xl font-black text-white"
                  >
                    {results.roastScore}
                  </motion.span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Roast Score</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-block bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
                  {getScoreBadge(results.roastScore)}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{results.overallVerdict}</h2>
                
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start pt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share this damage:</span>
                  <button 
                    onClick={() => handleShare("twitter")} 
                    className="bg-black/60 border border-border hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    𝕏 Share Roast
                  </button>
                  <button 
                    onClick={() => handleShare("linkedin")} 
                    className="bg-[#0077b5]/20 border border-[#0077b5]/30 hover:bg-[#0077b5]/30 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    Share on LinkedIn
                  </button>
                  <button 
                    onClick={() => handleShare("whatsapp")} 
                    className="bg-success/15 border border-success/30 hover:bg-success/30 text-success px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    Send to Friend
                  </button>
                </div>
              </div>
            </div>

            {/* Commentary & Shame Badge Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recruiter Commentary Section */}
              <div className="lg:col-span-7 glass rounded-2xl p-8 border border-border/50 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-orange-400">
                    💬 Recruiter Roast Commentary
                  </h3>
                  <div className="space-y-4">
                    {results.funnyComments.map((comment, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-background/40 border border-border/60 hover:border-orange-500/40 rounded-xl p-4 relative overflow-hidden flex items-start gap-4 transition-all duration-300 group shadow-lg"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-2xl mt-0.5 transform group-hover:rotate-12 transition-transform shrink-0">😅</span>
                        <p className="text-sm text-foreground/80 italic leading-relaxed">"{comment}"</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recruiter Shame Badge (Social Share) */}
              <div className="lg:col-span-5 glass rounded-2xl p-8 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background/40 to-red-500/5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] pointer-events-none" />
                <div>
                  <h3 className="font-bold text-lg text-orange-400 mb-6 flex items-center gap-1.5">
                    🏆 Your Recruiter Shame Badge
                  </h3>
                  
                  {/* Screenshot-Ready Shame Badge Body */}
                  <div id="shame-badge" className="bg-[#070b13] border border-orange-500/30 rounded-2xl p-6 text-center space-y-4 shadow-[0_0_25px_rgba(249,115,22,0.15)] relative">
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-current animate-pulse" />
                      <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase">HireAI Roast</span>
                    </div>
                    
                    <div className="pt-4">
                      <span className="text-6xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(239,68,68,0.35)]">
                        {results.roastScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-1 uppercase font-black tracking-widest">ATS score</span>
                    </div>
                    
                    <div className="inline-block bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
                      {getScoreBadge(results.roastScore)}
                    </div>
                    
                    <p className="text-xs text-foreground/90 font-medium italic px-2 leading-relaxed">
                      "{results.shareableQuote}"
                    </p>
                    
                    <div className="border-t border-border/40 pt-3 text-[9px] text-muted-foreground flex justify-between items-center px-1 font-mono">
                      <span>roast.hireai.com</span>
                      <span className="text-orange-400 font-bold uppercase tracking-widest">#EmotionalDamage</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(results.shareableQuote + " Get roasted at: " + window.location.origin + "/dashboard/roast 🔥");
                      // Let's change the button text to 'Copied!' temporarily
                      const btn = document.getElementById("copy-badge-btn");
                      if (btn) {
                        const origText = btn.innerHTML;
                        btn.innerHTML = `<span class="flex items-center gap-1.5 text-success">✓ Copied Share Link!</span>`;
                        setTimeout(() => {
                          btn.innerHTML = origText;
                        }, 2000);
                      }
                    }}
                    id="copy-badge-btn"
                    className="w-full bg-background/50 border border-border hover:border-orange-500/40 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
                  >
                    <Check className="w-4 h-4 text-success" /> Copy Share Text & Link
                  </button>
                </div>
              </div>
            </div>

            {/* Critical ATS Failures (Interactive Tabs) */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
                  <XCircle className="w-5 h-5" /> Fatal ATS Failures Detected
                </h3>
                <span className="text-xs text-muted-foreground">Select a card to read critique</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {results.atsFailures.map((failure, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFailureTab(idx)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      activeFailureTab === idx
                        ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-background/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {failure.title}
                  </button>
                ))}
              </div>

              <div className="bg-background/30 border border-border rounded-xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFailureTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-black text-sm text-muted-foreground uppercase tracking-wider">What is wrong:</h4>
                      <p className="text-foreground text-sm font-semibold mt-1">
                        {results.atsFailures[activeFailureTab].description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                        🔥 Recruiter Burn:
                      </h4>
                      <p className="text-red-400 text-sm font-medium italic mt-1 bg-red-500/5 border border-red-500/20 p-4 rounded-lg">
                        "{results.atsFailures[activeFailureTab].harshCritique}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ATS Deep Scan Checklist */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-yellow-400">
                🔍 ATS Compliance Deep Scan Checklist
              </h3>
              <div className="space-y-4">
                {results.atsChecklist.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-background/30 border border-border/60 hover:bg-background/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.passed 
                          ? "bg-success/20 text-success shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
                          : "bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      }`}>
                        {item.passed ? <Check className="w-4 h-4 stroke-[3]" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{item.metricName}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.critique}</p>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.passed 
                        ? "bg-success/10 border-success/30 text-success" 
                        : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`}>
                      {item.passed ? "Passed" : "Failed"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Auto Fix / Before & After panel */}
            <div className="glass rounded-2xl p-8 border border-border/50 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5 text-primary" /> Recruiter Auto-Fix Suggestions
                  </h3>
                  <p className="text-sm text-muted-foreground">See how weak resume bullets are optimized with metrics and recruiter action verbs.</p>
                </div>
                
                {!isUpgraded && (
                  <button 
                    onClick={() => setShowPaywallModal(true)}
                    className="bg-primary text-white text-xs px-4 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Auto-Fix Resume (₹199)
                  </button>
                )}
              </div>

              <div className="space-y-6 relative">
                {/* Summary Statement Fix */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/60 rounded-2xl p-6 relative transition-all ${
                  !isUpgraded ? "blur-[2px] opacity-40 select-none pointer-events-none" : ""
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider">
                      <XCircle className="w-4 h-4" /> Before (Fluffy Summary)
                    </div>
                    <p className="text-sm text-foreground/75 bg-red-500/5 border border-red-500/10 p-3 rounded-lg line-through whitespace-pre-line leading-relaxed">
                      {results.rewrittenSummary.original}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      <strong className="text-orange-400 font-medium">Roast:</strong> {results.rewrittenSummary.critique}
                    </p>
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex items-center gap-2 text-success text-xs font-black uppercase tracking-wider">
                      <Check className="w-4 h-4 bg-success/20 rounded-full p-0.5" /> After (AI Optimized Summary)
                    </div>
                    <p className="text-sm text-success bg-success/5 border border-success/10 p-3 rounded-lg font-medium shadow-[0_0_15px_rgba(34,197,94,0.05)] whitespace-pre-line leading-relaxed">
                      {results.rewrittenSummary.improved}
                    </p>
                    <p className="text-[10px] text-success/80 font-semibold tracking-wider uppercase">
                      ✨ Quantified value statement & professional branding
                    </p>
                  </div>

                  {!isUpgraded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 rounded-2xl backdrop-blur-[2px] z-10 pointer-events-auto">
                      <div className="p-3 bg-background border border-border rounded-full shadow-lg mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowPaywallModal(true)}>
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <button 
                        onClick={() => setShowPaywallModal(true)}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Unlock Summary Fix
                      </button>
                    </div>
                  )}
                </div>

                {results.bulletPointFixes.map((fix, idx) => {
                  const isLocked = idx > 0 && !isUpgraded;
                  return (
                    <div 
                      key={idx} 
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/60 rounded-2xl p-6 relative transition-all ${
                        isLocked ? "blur-[2px] opacity-40 select-none pointer-events-none" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider">
                          <XCircle className="w-4 h-4" /> Before (Weak Bullet)
                        </div>
                        <p className="text-sm text-foreground/75 bg-red-500/5 border border-red-500/10 p-3 rounded-lg line-through">
                          {fix.original}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          <strong className="text-orange-400 font-medium">Roast:</strong> {fix.critique}
                        </p>
                      </div>

                      <div className="space-y-2 relative">
                        <div className="flex items-center gap-2 text-success text-xs font-black uppercase tracking-wider">
                          <Check className="w-4 h-4 bg-success/20 rounded-full p-0.5" /> After (AI Optimized)
                        </div>
                        <p className="text-sm text-success bg-success/5 border border-success/10 p-3 rounded-lg font-medium shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                          {fix.improved}
                        </p>
                        <p className="text-[10px] text-success/80 font-semibold tracking-wider uppercase">
                          ✨ Keyword optimized & metrics quantified
                        </p>
                      </div>

                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 rounded-2xl backdrop-blur-[2px] z-10 pointer-events-auto">
                          <div className="p-3 bg-background border border-border rounded-full shadow-lg mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowPaywallModal(true)}>
                            <Lock className="w-5 h-5 text-primary" />
                          </div>
                          <button 
                            onClick={() => setShowPaywallModal(true)}
                            className="text-xs font-bold text-primary hover:underline cursor-pointer"
                          >
                            Upgrade for ₹199 to Unlock
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <button 
                onClick={() => {
                  setStatus("idle");
                  setFile(null);
                  setResults(null);
                  setIsUpgraded(false);
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Roast Another Resume
              </button>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center space-y-6 border border-red-500/20"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">Failed to Roast Resume</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {errorMessage}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-bold transition-all animate-pulse"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* Razorpay merchant header */}
              <div className="bg-[#1780e3] p-6 text-white relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Simulated Merchant</span>
                    <h3 className="text-lg font-black tracking-tight">HireAI Premium Checkout</h3>
                    <p className="text-xs text-blue-100 font-medium">Single-scan professional resume upgrade</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowPaywallModal(false);
                      setPaymentStep("paywall");
                    }}
                    className="text-white/80 hover:text-white text-sm font-bold bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="absolute right-6 bottom-6 text-right">
                  <span className="text-[10px] font-black uppercase text-blue-200 block">Amount to Pay</span>
                  <span className="text-2xl font-black">₹199.00</span>
                </div>
              </div>

              <div className="p-6">
                {paymentStep === "paywall" && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-sm text-foreground">Why upgrade to Premium?</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Full Resume Auto-Fixes:</strong> Get custom, metrics-quantified rewrites for all your resume bullet points.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Executive Summary:</strong> Rewrite your summary into a modern, high-converting professional brand statement.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Unlimited Downloads:</strong> Export your optimized resume directly as a clean PDF ready for ATS parsing.</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setPaymentStep("razorpay_select")}
                      className="w-full bg-[#1780e3] hover:bg-[#1571c9] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(23,128,227,0.3)] transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" /> Proceed to Payment (₹199)
                    </button>
                  </div>
                )}

                {paymentStep === "razorpay_select" && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Select Payment Method</p>
                    <div className="grid grid-cols-1 gap-2.5">
                      <button 
                        onClick={() => setPaymentStep("razorpay_card")}
                        className="w-full bg-background border border-border/80 hover:border-[#1780e3]/40 p-4 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">💳</span>
                          <div>
                            <p className="text-xs font-extrabold text-foreground">Card</p>
                            <p className="text-[10px] text-muted-foreground">Visa, MasterCard, RuPay, Maestro</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#1780e3] transition-colors" />
                      </button>

                      <button 
                        onClick={() => setPaymentStep("razorpay_upi")}
                        className="w-full bg-background border border-border/80 hover:border-[#1780e3]/40 p-4 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
                          <div>
                            <p className="text-xs font-extrabold text-foreground">UPI / QR</p>
                            <p className="text-[10px] text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#1780e3] transition-colors" />
                      </button>
                    </div>

                    <button 
                      onClick={() => setPaymentStep("paywall")}
                      className="w-full text-muted-foreground hover:text-foreground text-[10px] font-bold text-center pt-2 underline underline-offset-4 cursor-pointer"
                    >
                      ← Back to Details
                    </button>
                  </div>
                )}

                {paymentStep === "razorpay_card" && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Enter Card Details</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Card Number</label>
                        <input 
                          type="text" 
                          value={cardNo}
                          onChange={(e) => setCardNo(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#1780e3]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-muted-foreground uppercase">Expiry (MM/YY)</label>
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/29"
                            className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#1780e3] text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-muted-foreground uppercase">CVV</label>
                          <input 
                            type="password" 
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#1780e3] text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setPaymentStep("razorpay_processing");
                        setTimeout(() => {
                          const tx = "pay_Roast_" + Math.random().toString(36).substring(2, 10).toUpperCase();
                          setSimulatedTxId(tx);
                          setPaymentStep("razorpay_success");
                          setTimeout(() => {
                            setIsUpgraded(true);
                            setShowPaywallModal(false);
                            setPaymentStep("paywall");
                          }, 2000);
                        }, 2000);
                      }}
                      className="w-full bg-[#1780e3] hover:bg-[#1571c9] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(23,128,227,0.3)] transition-all mt-2"
                    >
                      💳 Pay ₹199.00
                    </button>

                    <button 
                      onClick={() => setPaymentStep("razorpay_select")}
                      className="w-full text-muted-foreground hover:text-foreground text-[10px] font-bold text-center pt-2 underline underline-offset-4 cursor-pointer"
                    >
                      ← Change Payment Method
                    </button>
                  </div>
                )}

                {paymentStep === "razorpay_upi" && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Enter UPI Address</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Virtual Payment Address (VPA)</label>
                        <input 
                          type="text" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="success@razorpay"
                          className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#1780e3]"
                        />
                        <span className="text-[9px] text-muted-foreground block mt-1">E.g., mobile@upi, name@okhdfcbank</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setPaymentStep("razorpay_processing");
                        setTimeout(() => {
                          const tx = "pay_Roast_" + Math.random().toString(36).substring(2, 10).toUpperCase();
                          setSimulatedTxId(tx);
                          setPaymentStep("razorpay_success");
                          setTimeout(() => {
                            setIsUpgraded(true);
                            setShowPaywallModal(false);
                            setPaymentStep("paywall");
                          }, 2000);
                        }, 2000);
                      }}
                      className="w-full bg-[#1780e3] hover:bg-[#1571c9] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(23,128,227,0.3)] transition-all mt-2"
                    >
                      📱 Pay ₹199.00
                    </button>

                    <button 
                      onClick={() => setPaymentStep("razorpay_select")}
                      className="w-full text-muted-foreground hover:text-foreground text-[10px] font-bold text-center pt-2 underline underline-offset-4 cursor-pointer"
                    >
                      ← Change Payment Method
                    </button>
                  </div>
                )}

                {paymentStep === "razorpay_processing" && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    {/* Razorpay loading circle */}
                    <div className="relative w-16 h-16">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#1780e3] border-l-transparent border-b-transparent shadow-[0_0_10px_rgba(23,128,227,0.2)]"
                      />
                      <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#1780e3] animate-pulse" />
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-foreground">Processing Payment...</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Connecting with bank nodes. Please do not refresh this page or close this dialog.
                    </p>
                  </div>
                )}

                {paymentStep === "razorpay_success" && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    {/* Success Checkmark Badge */}
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success animate-bounce shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-success">Payment Successful!</h4>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1 select-all">Transaction ID: {simulatedTxId}</p>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto font-medium">
                      🚀 Upgrading resume features in 2 seconds...
                    </p>
                  </div>
                )}

                <p className="text-[9px] text-center text-muted-foreground mt-4 select-none">
                  ⚡ Powered by <span className="font-black text-[#1780e3]">Razorpay</span> Simulated Sandbox Checkout
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
