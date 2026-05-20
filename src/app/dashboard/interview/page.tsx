"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Check, Lock, ArrowRight, Mic, MicOff, 
  Video, VideoOff, Clock, ChevronRight, AlertCircle, 
  RefreshCw, XCircle, Play, ArrowLeft, BarChart2 
} from "lucide-react";
import { InterviewQuestion, InterviewEvaluation } from "@/lib/interview-engine";

export default function InterviewCoach() {
  // Phase handling
  const [phase, setPhase] = useState<"setup" | "loading" | "conversation" | "feedback">("setup");
  const [loadingText, setLoadingText] = useState("Generating custom interview session...");
  
  // Setup selections
  const [role, setRole] = useState("Software Engineer");
  const [level, setLevel] = useState("Mid-level");
  const [industry, setIndustry] = useState("Tech / SaaS");
  const [type, setType] = useState("Mixed");
  const [company, setCompany] = useState("");
  const [resumeContext, setResumeContext] = useState("");

  // Live session state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerText: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [validationError, setValidationError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  // Analytics & feedback state
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState(0);
  const [isUpgraded, setIsUpgraded] = useState(false);
  
  // Simulated checkout state
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"paywall" | "razorpay_select" | "razorpay_card" | "razorpay_upi" | "razorpay_processing" | "razorpay_success">("paywall");
  const [cardNo, setCardNo] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [upiId, setUpiId] = useState("candidate@upi");
  const [simulatedTxId, setSimulatedTxId] = useState("");

  // Timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "conversation") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Format timer into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  const handleStartInterview = async () => {
    setPhase("loading");
    setLoadingText("Configuring custom interview session...");
    
    // Simulate gradual preheating
    const phrases = [
      "Configuring custom interview session...",
      "Analyzing target industry standards...",
      "Synthesizing recruiter questions...",
      "Optimizing grading engine..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < phrases.length - 1) {
        step++;
        setLoadingText(phrases[step]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, industry, type, resumeContext, company }),
      });
      const data = await response.json();
      clearInterval(interval);

      if (data.error) throw new Error(data.error);

      setQuestions(data.questions || []);
      setCurrentIdx(0);
      setAnswers([]);
      setCurrentAnswer("");
      setTimer(0);
      setPhase("conversation");
    } catch (err: any) {
      clearInterval(interval);
      alert(err.message || "Failed to initialize interview.");
      setPhase("setup");
    }
  };

  const handleSubmitAnswer = async (isSkip: boolean = false) => {
    if (!isSkip && !currentAnswer.trim()) {
      setValidationError("Please input your response before submitting, or click 'Skip Question' to proceed.");
      return;
    }

    setValidationError("");
    const finalAnswerText = isSkip ? "[Skipped]" : currentAnswer.trim();
    const newAnswer = { questionId: questions[currentIdx].id, answerText: finalAnswerText };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Evaluate session
      setPhase("loading");
      setLoadingText("Recruiters compiling scores...");
      
      const phrases = [
        "Analyzing communication delivery...",
        "Evaluating factual correctness...",
        "Measuring STAR method metrics...",
        "Formatting constructive feedback deck..."
      ];
      let step = 0;
      const interval = setInterval(() => {
        if (step < phrases.length - 1) {
          step++;
          setLoadingText(phrases[step]);
        }
      }, 1200);

      try {
        const response = await fetch("/api/evaluate-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions, answers: updatedAnswers }),
        });
        const data = await response.json();
        clearInterval(interval);

        if (data.error) throw new Error(data.error);

        setEvaluation(data.evaluation);
        setPhase("feedback");
      } catch (err: any) {
        clearInterval(interval);
        alert(err.message || "Failed to compile feedback.");
        setPhase("setup");
      }
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            🎤 AI Interview Coach
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Practice realistic, industry-specific recruiter mock interviews and get instant actionable feedback.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 1: Setup */}
        {phase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Wizard forms */}
              <div className="lg:col-span-7 glass rounded-2xl p-8 border border-border/50 space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                  ⚙️ Configure Interview Setup
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase">Target Job Role</label>
                    <input 
                      type="text" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Software Engineer, Sales Manager"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase">Target Industry</label>
                    <input 
                      type="text" 
                      value={industry} 
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Tech, FinTech, Healthcare"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase">Experience Seniority</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Fresher", "Junior", "Mid-level", "Senior"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevel(lvl)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            level === lvl 
                              ? "bg-primary/10 border-primary text-primary" 
                              : "bg-background border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase">Interview Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["HR", "Technical", "Behavioral", "Mixed"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            type === t 
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

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-muted-foreground uppercase">Target Company <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, McKinsey"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-muted-foreground uppercase">Optional Resume Context <span className="text-muted-foreground text-[10px] font-normal">(Provide text to tailor questions)</span></label>
                  <textarea 
                    value={resumeContext} 
                    onChange={(e) => setResumeContext(e.target.value)}
                    placeholder="Paste resume text or key experiences to ask project-focused follow-ups..."
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStartInterview}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.01]"
                >
                  <Play className="w-4 h-4 fill-current" /> Start AI Interview Prep
                </button>
              </div>

              {/* Tips column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass rounded-2xl p-8 border border-border/50 bg-gradient-to-br from-primary/5 via-background/40 to-purple-500/5 relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-lg text-primary flex items-center gap-1.5">
                      💡 Pro Interview Guidelines
                    </h3>
                    <div className="space-y-4 pt-2">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">1</div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">Prepare Specific Examples</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Gemini evaluates STAR metrics (Situation, Task, Action, Result) in behavioral evaluations.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">2</div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">Quantify Outcomes</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Provide numbers, scaling parameters, or metric improvements to capture high technical accuracy marks.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">3</div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">Simulate Audio/Webcam</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Toggle webcam overlays and active waveforms to replicate elite recruiter interviews.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#070b13] border border-primary/20 rounded-xl p-4 mt-6 text-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary block">Premium Career Hub</span>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">Upgrade to unlock detailed PDF evaluations, unlimited sessions, and recruiter headline re-writes.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Preheat Loader */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-16 text-center space-y-6 border border-primary/30 max-w-xl mx-auto my-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[100px] pointer-events-none" />
            
            <div className="relative w-20 h-20 mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary border-l-transparent border-b-transparent shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500 border-t-transparent border-r-transparent shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              />
              <div className="absolute inset-4 bg-background border border-primary/20 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {loadingText}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Please wait while our Gemini 2.0 recruiter compiles specific scenarios matching your target experience levels.
            </p>
          </motion.div>
        )}

        {/* Phase 2: Live Conversation Screen */}
        {phase === "conversation" && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header tracker bar */}
            <div className="glass rounded-xl px-6 py-4 border border-border/50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase text-primary tracking-wider">Mock Session</span>
                <div className="w-px h-4 bg-border/80" />
                <span className="text-xs text-muted-foreground">Type: <strong className="text-foreground">{type}</strong></span>
                <div className="w-px h-4 bg-border/80 hidden sm:block" />
                <span className="text-xs text-muted-foreground hidden sm:block">Role: <strong className="text-foreground">{role} ({level})</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-mono text-foreground font-bold">{formatTime(timer)}</span>
                </div>
                <span className="text-xs font-bold text-foreground">Question {currentIdx + 1} of {questions.length}</span>
              </div>
            </div>

            {/* Main conversational split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Interviewer & Question Card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass rounded-2xl p-8 border border-primary/20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black relative">
                      <span>HR</span>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-background flex items-center justify-center" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider">AI Recruiter</h4>
                      <p className="text-[10px] text-muted-foreground">Active Interrogator Node</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground leading-relaxed">
                      "{questions[currentIdx]?.question}"
                    </h3>

                    <div className="bg-background/40 border border-border/80 rounded-xl p-4 text-[11px] leading-relaxed text-muted-foreground relative">
                      <span className="font-bold text-[#1780e3] block mb-1">💡 Recruiter Advice:</span>
                      {questions[currentIdx]?.hint}
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="glass rounded-2xl p-6 border border-border/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Your Professional Answer</label>
                    <span className="text-[10px] text-muted-foreground">{currentAnswer.length} chars</span>
                  </div>
                  
                  <textarea 
                    value={currentAnswer}
                    onChange={(e) => {
                      setCurrentAnswer(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    placeholder="Formulate your detailed response. Explain your situation, action, and resulting metric..."
                    rows={6}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-colors resize-none leading-relaxed"
                  />

                  {validationError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium animate-pulse">
                      <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" /> {validationError}
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <button
                      onClick={() => {
                        setCurrentAnswer("");
                        handleSubmitAnswer(true);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer"
                    >
                      Skip Question
                    </button>
                    
                    <button
                      onClick={() => handleSubmitAnswer(false)}
                      className="bg-primary hover:bg-primary/90 text-white text-xs font-black px-6 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
                    >
                      Submit & Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Audio Waves and Camera Simulation Overlay */}
              <div className="lg:col-span-5 space-y-6">
                {/* Webcam Mock */}
                <div className="glass rounded-2xl p-4 border border-border/50 bg-[#070b13] relative overflow-hidden flex flex-col justify-between aspect-video group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-0" />
                  
                  {isWebcamActive ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 z-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <span className="text-3xl animate-pulse">👨‍💻</span>
                        <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">Mock Video Feed Active</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Top toolbar */}
                  <div className="flex justify-between items-center relative z-10 select-none">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isWebcamActive ? "bg-red-500 animate-ping" : "bg-muted"}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/80">
                        {isWebcamActive ? "LIVE FEED" : "CAM OFF"}
                      </span>
                    </div>
                    {isWebcamActive && <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase">• REC</span>}
                  </div>

                  {!isWebcamActive && (
                    <div className="py-8 text-center space-y-2 relative z-10">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/60">
                        <VideoOff className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Camera feed is off. Enable for immersive practice.</p>
                    </div>
                  )}

                  {/* Bottom webcam toggle */}
                  <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/5">
                    <span className="text-[9px] text-white/60 font-mono">Future webcam evaluation support</span>
                    <button
                      onClick={() => setIsWebcamActive(!isWebcamActive)}
                      className={`text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isWebcamActive 
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {isWebcamActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                      {isWebcamActive ? "Disable Cam" : "Enable Cam"}
                    </button>
                  </div>
                </div>

                {/* Audio Wave Mock */}
                <div className="glass rounded-2xl p-6 border border-border/50 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-foreground">Speech Audio Analysis</h4>
                    <span className="text-[9px] text-muted-foreground tracking-wider uppercase">Future voice input</span>
                  </div>

                  {isMicActive ? (
                    <div className="h-16 flex items-center justify-center gap-1">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            height: [8, Math.random() * 45 + 15, 8] 
                          }}
                          transition={{ 
                            duration: 0.8 + Math.random() * 0.4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="w-1 bg-gradient-to-t from-primary to-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center text-center">
                      <p className="text-[10px] text-muted-foreground italic">Speech wave inactive. Toggle mic below.</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-border/40">
                    <button
                      onClick={() => setIsMicActive(!isMicActive)}
                      className={`text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isMicActive 
                          ? "bg-primary/20 text-primary hover:bg-primary/30" 
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isMicActive ? "Mic Unmute" : "Mic Mute"}
                    </button>
                    <span className="text-[9px] text-muted-foreground">Auto-transcription simulated</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Performance & Readiness Dashboard */}
        {phase === "feedback" && evaluation && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Top Score Summary Banner */}
            <div className="glass rounded-2xl p-8 border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none" />
              
              <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[15px]" />
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle 
                    cx="72" cy="72" r="62" 
                    className="stroke-muted-foreground/10 fill-none" 
                    strokeWidth="10" 
                  />
                  <motion.circle 
                    cx="72" cy="72" r="62" 
                    className="stroke-primary fill-none shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    strokeWidth="10" 
                    strokeDasharray={2 * Math.PI * 62}
                    initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - evaluation.overallScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{evaluation.overallScore}</span>
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Overall Score</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-block bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary">
                  🎉 Session Completed
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  Congratulations! Your Interview Evaluation is Ready.
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-4 py-2 bg-background border border-border rounded-xl text-center min-w-[100px]">
                    <span className="text-lg font-black text-foreground">{evaluation.technicalScore}%</span>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider">Tech Readiness</span>
                  </div>
                  <div className="px-4 py-2 bg-background border border-border rounded-xl text-center min-w-[100px]">
                    <span className="text-lg font-black text-foreground">{evaluation.communicationScore}%</span>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider">Communication</span>
                  </div>
                  <div className="px-4 py-2 bg-background border border-border rounded-xl text-center min-w-[100px]">
                    <span className="text-lg font-black text-primary">{formatTime(timer)}</span>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-wider">Total Duration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Dashboard view */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Specific feedback tabs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass rounded-2xl p-8 border border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-primary flex items-center gap-1.5">
                      💬 Recruiter Analysis Per Question
                    </h3>
                    <span className="text-[10px] text-muted-foreground">Select question to view rewrites</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFeedbackTab(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors border cursor-pointer ${
                          activeFeedbackTab === idx 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Q {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-background/30 border border-border p-4 rounded-xl">
                      <p className="text-xs font-black text-muted-foreground uppercase">Question asked:</p>
                      <p className="text-xs text-foreground font-semibold mt-1">"{questions[activeFeedbackTab]?.question}"</p>
                    </div>

                    <div className="bg-background/30 border border-border p-4 rounded-xl">
                      <p className="text-xs font-black text-muted-foreground uppercase">Your submitted answer:</p>
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                        {answers.find(a => a.questionId === questions[activeFeedbackTab]?.id)?.answerText || "[Skipped]"}
                      </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                      <p className="text-xs font-black text-primary uppercase">AI Recruiter Score & Feedback:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-foreground">Score: {evaluation.critiques[activeFeedbackTab]?.score}/100</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {evaluation.critiques[activeFeedbackTab]?.feedback}
                      </p>
                    </div>

                    {/* AI Answer Rewriting (Locked or Unlocked) */}
                    <div className="border border-border/80 rounded-2xl p-6 relative overflow-hidden bg-background/50">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <p className="text-xs font-black text-success uppercase flex items-center gap-1.5">
                          ✨ AI Recruiter Premium Answer Rewrite
                        </p>
                        {!isUpgraded && (
                          <span className="bg-primary/10 border border-primary/20 text-[9px] text-primary font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Premium
                          </span>
                        )}
                      </div>

                      <div className={`space-y-2 ${!isUpgraded ? "blur-[2.5px] opacity-30 select-none pointer-events-none" : ""}`}>
                        <p className="text-xs text-success bg-success/5 border border-success/15 p-4 rounded-xl leading-relaxed italic font-medium">
                          "{evaluation.critiques[activeFeedbackTab]?.improvedAnswer}"
                        </p>
                        <p className="text-[9px] text-success/80 font-black uppercase tracking-wider">
                          ✨ Optimized with executive impact verbs and STAR structures
                        </p>
                      </div>

                      {!isUpgraded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 rounded-2xl backdrop-blur-[2px] z-10 pointer-events-auto">
                          <div className="p-3 bg-background border border-border rounded-full shadow-lg mb-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowPaywallModal(true)}>
                            <Lock className="w-5 h-5 text-primary animate-pulse" />
                          </div>
                          <button 
                            onClick={() => setShowPaywallModal(true)}
                            className="text-xs font-bold text-primary hover:underline cursor-pointer"
                          >
                            Unlock AI Rewrites (₹199)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: STAR evaluations and paywalls */}
              <div className="lg:col-span-5 space-y-6">
                {/* STAR Checkmarks */}
                <div className="glass rounded-2xl p-8 border border-border/50 space-y-4">
                  <h3 className="font-extrabold text-base text-foreground">STAR Framework Adherence</h3>
                  <p className="text-[11px] text-muted-foreground">Detailed audit of Situation, Task, Action, and Result formats across behavioral responses.</p>
                  
                  <div className="space-y-3.5 pt-2">
                    {[
                      { label: "Situation", val: evaluation.starEvaluation.situation, desc: "Laid out clean professional contexts." },
                      { label: "Task", val: evaluation.starEvaluation.task, desc: "Stated goals, problems or core challenges." },
                      { label: "Action", val: evaluation.starEvaluation.action, desc: "Detailed exact actions taken to resolve bugs." },
                      { label: "Result", val: evaluation.starEvaluation.result, desc: "Quantified final business impacts or metrics." }
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          item.val 
                            ? "bg-success/20 text-success shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
                            : "bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        }`}>
                          {item.val ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <XCircle className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-foreground">{item.label} Method</h4>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-background/40 border border-border rounded-xl p-4 text-[10px] leading-relaxed text-muted-foreground mt-4">
                    <strong className="text-foreground block mb-0.5">STAR Audit Verdict:</strong>
                    {evaluation.starEvaluation.critique}
                  </div>
                </div>

                {/* General rec burns */}
                <div className="glass rounded-2xl p-8 border border-border/50 space-y-3 bg-gradient-to-br from-purple-500/5 to-primary/5">
                  <h3 className="font-extrabold text-base text-purple-400 flex items-center gap-1.5">
                    🎯 Recruiter Overall Assessment
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {evaluation.generalCritique}
                  </p>
                </div>

                {/* Reset button */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button 
                    onClick={() => {
                      setPhase("setup");
                      setQuestions([]);
                      setAnswers([]);
                      setEvaluation(null);
                      setTimer(0);
                    }}
                    className="text-muted-foreground hover:text-foreground text-sm font-medium underline underline-offset-4 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Practice Another Role
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
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
                      <h4 className="font-extrabold text-sm text-foreground">Why unlock AI Interview Coach Pro?</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">AI Rewrites:</strong> Instantly optimize your responses with perfectly structured STAR sentences.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Company-Specific:</strong> Tailor simulations directly to Netflix, Amazon, Meta, and Stripe recruit loops.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4.5 h-4.5 text-success shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground"><strong className="text-foreground">Prep Reports:</strong> Export clean PDF breakdowns of all feedback and scores to practice offline.</p>
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
                          const tx = "pay_Coach_" + Math.random().toString(36).substring(2, 10).toUpperCase();
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
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setPaymentStep("razorpay_processing");
                        setTimeout(() => {
                          const tx = "pay_Coach_" + Math.random().toString(36).substring(2, 10).toUpperCase();
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
                      Connecting with bank nodes. Please do not refresh this page.
                    </p>
                  </div>
                )}

                {paymentStep === "razorpay_success" && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success animate-bounce shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-success">Payment Successful!</h4>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1 select-all">Transaction ID: {simulatedTxId}</p>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto font-medium">
                      🚀 Unlocking prep answer rewrites in 2 seconds...
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
