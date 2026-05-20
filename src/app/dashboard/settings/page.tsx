"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  Layers,
  Save,
  RotateCcw
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "billing" | "notifications">("profile");
  
  // Profile settings state
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@hired.ai");
  const [title, setTitle] = useState("Senior Fullstack Engineer");
  const [experience, setExperience] = useState("senior");
  
  // AI Prefs state
  const [temperature, setTemperature] = useState(0.7);
  const [starMethodOnly, setStarMethodOnly] = useState(true);
  const [creativityLevel, setCreativityLevel] = useState("balanced");

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [syncToLinkedIn, setSyncToLinkedIn] = useState(false);
  const [bgGlows, setBgGlows] = useState(true);

  // Interaction states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate secure saving delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSaving(false);
    setSaveSuccess(true);

    // Auto fadeout success message
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const tabs = [
    { id: "profile", name: "Profile Settings", icon: User },
    { id: "ai", name: "AI Preferences", icon: Sliders },
    { id: "billing", name: "Billing & Account", icon: CreditCard },
    { id: "notifications", name: "System Settings", icon: Bell },
  ] as const;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Workspace Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile, AI processing guidelines, and billing parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs Side Panel */}
        <div className="glass rounded-2xl p-2.5 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 border border-border/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSaveSuccess(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap md:w-full ${
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-inner font-bold" 
                    : "text-muted-foreground hover:text-white hover:bg-card/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Panel Box */}
        <div className="md:col-span-3">
          <form onSubmit={handleSaveChanges} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {/* Tab 1: Profile */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass p-8 rounded-3xl border border-border/80 relative overflow-hidden"
                >
                  <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-primary/10 blur-[40px] rounded-full" />
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Profile Parameters
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0B0F19]/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0B0F19]/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Target Job Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#0B0F19]/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Experience Tier</label>
                      <select 
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#0B0F19]/80 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium cursor-pointer"
                      >
                        <option value="entry">Entry Level (0-1 yrs)</option>
                        <option value="mid">Mid Level (2-4 yrs)</option>
                        <option value="senior">Senior Level (5-8 yrs)</option>
                        <option value="lead">Lead / Staff Level (8+ yrs)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: AI Preferences */}
              {activeTab === "ai" && (
                <motion.div
                  key="ai-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass p-8 rounded-3xl border border-border/80 relative overflow-hidden"
                >
                  <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full" />

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-400" /> AI Optimization Guidelines
                  </h3>

                  <div className="space-y-6">
                    {/* Temperature Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">AI Engine Temperature</label>
                        <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                          {temperature.toFixed(1)}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.1" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-primary bg-[#0B0F19]/80 border border-border rounded-lg h-2 cursor-pointer transition-all" 
                      />
                      <p className="text-[11px] text-muted-foreground">Lower settings yield exact matching scores. Higher settings generate more creative resume roasts.</p>
                    </div>

                    <hr className="border-border/40" />

                    {/* Checkbox controls */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input 
                          id="starMethod"
                          type="checkbox" 
                          checked={starMethodOnly}
                          onChange={(e) => setStarMethodOnly(e.target.checked)}
                          className="w-4.5 h-4.5 mt-0.5 rounded border-border/80 bg-[#0B0F19]/50 text-primary focus:ring-0 focus:ring-offset-0 accent-primary cursor-pointer transition-all"
                        />
                        <div>
                          <label htmlFor="starMethod" className={`text-sm font-semibold select-none cursor-pointer transition-colors ${starMethodOnly ? 'text-white' : 'text-muted-foreground'}`}>
                            Enforce STAR Method Structure
                          </label>
                          <p className="text-xs text-muted-foreground mt-0.5">Enforces Situation, Task, Action, and Result formats for all bullet rewrites.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block">Tone Signature</label>
                        <div className="grid grid-cols-3 gap-3">
                          {["concise", "balanced", "assertive"].map((tone) => (
                            <button
                              key={tone}
                              type="button"
                              onClick={() => setCreativityLevel(tone)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all capitalize border ${
                                creativityLevel === tone 
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-inner font-extrabold" 
                                  : "bg-[#0B0F19]/50 text-muted-foreground border-border/60 hover:text-white"
                              }`}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 3: Billing */}
              {activeTab === "billing" && (
                <motion.div
                  key="billing-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass p-8 rounded-3xl border border-border/80 relative overflow-hidden"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-yellow-400" /> Account Plan & Quotas
                  </h3>

                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">Current Subscription</span>
                        <h4 className="text-lg font-black text-white flex items-center gap-1.5">
                          Lifetime Premium Active <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">Unlimited resume analyses, roasts, and Copilot matched applications unlocked.</p>
                      </div>
                      <span className="text-xs bg-primary/20 border border-primary/30 text-white font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Pro Plan Active
                      </span>
                    </div>

                    {/* Usage Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-muted-foreground uppercase tracking-wide">Monthly Credits Consumed</span>
                        <span className="text-white">142 / 500 scans</span>
                      </div>
                      <div className="w-full bg-[#0B0F19] h-3.5 rounded-full p-0.5 border border-border overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all duration-1000 shadow-md shadow-primary/30"
                          style={{ width: "28.4%" }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">Credits reset automatically on the 1st of every month.</p>
                    </div>

                    <hr className="border-border/40" />

                    <div className="flex gap-4 items-center">
                      <button type="button" className="text-xs text-primary font-bold hover:underline">Download Purchase Invoices</button>
                      <span className="text-muted-foreground text-xs">•</span>
                      <button type="button" className="text-xs text-primary font-bold hover:underline">Manage Billing Operations</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Notifications / System */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass p-8 rounded-3xl border border-border/80 relative overflow-hidden"
                >
                  <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-yellow-500/5 blur-[40px] rounded-full" />

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" /> System & Sync Actions
                  </h3>

                  <div className="space-y-5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Enable Ambient Mesh particles</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Toggle animated floating meshes on dashboard routes (disable on low-end machines).</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={bgGlows}
                        onChange={(e) => setBgGlows(e.target.checked)}
                        className="w-9 h-5 rounded-full bg-border/40 checked:bg-primary accent-primary cursor-pointer transition-all border-none ring-0 focus:ring-0 appearance-none inline-block relative before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-all"
                      />
                    </div>

                    <hr className="border-border/40" />

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Auto-Sync optimized resumes to LinkedIn</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Pushes ATS keyword updates straight into your active LinkedIn profile tags.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={syncToLinkedIn}
                        onChange={(e) => setSyncToLinkedIn(e.target.checked)}
                        className="w-9 h-5 rounded-full bg-border/40 checked:bg-primary accent-primary cursor-pointer transition-all border-none ring-0 focus:ring-0 appearance-none inline-block relative before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-all"
                      />
                    </div>

                    <hr className="border-border/40" />

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Weekly Resume Grade Emails</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Sends automated email digests showcasing callback rankings and trending keyword updates.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="w-9 h-5 rounded-full bg-border/40 checked:bg-primary accent-primary cursor-pointer transition-all border-none ring-0 focus:ring-0 appearance-none inline-block relative before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setName("John Doe");
                    setEmail("john.doe@hired.ai");
                    setTitle("Senior Fullstack Engineer");
                    setExperience("senior");
                    setTemperature(0.7);
                    setStarMethodOnly(true);
                    setCreativityLevel("balanced");
                    setEmailAlerts(true);
                    setSyncToLinkedIn(false);
                    setBgGlows(true);
                    setSaveSuccess(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-white transition-all cursor-pointer bg-[#0B0F19]/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore Defaults
                </button>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                      Workspace Saved Successfully!
                    </motion.span>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-primary/95 hover:to-purple-600/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
