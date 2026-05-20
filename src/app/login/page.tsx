"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [socialProvider, setSocialProvider] = useState<"google" | "github" | null>(null);
  const router = useRouter();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (activeTab === "signup" && !name)) {
      return;
    }
    
    setIsLoading(true);
    setSocialProvider(null);
    
    // Simulate premium micro-interactive authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setAuthSuccess(true);
    
    // Success micro-interactive notification, then route directly to /dashboard
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    if (isLoading || socialProvider) return;
    
    setSocialProvider(provider);
    setIsLoading(true);
    
    // Simulate secure enterprise SSO handshake delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsLoading(false);
    setAuthSuccess(true);
    
    // Redirect cleanly to dashboard
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0F19] text-foreground relative overflow-hidden font-sans">
      
      {/* Absolute Ambient Background Meshes */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[145px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      {/* Header logo / Go Back Link */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <Link href="/" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-md shadow-primary/20">
            <Zap className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Hire<span className="text-primary font-extrabold">AI</span>
          </span>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        
        <div className="w-full max-w-md">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-glow p-8 rounded-3xl relative overflow-hidden bg-[#131B2B]/75 backdrop-blur-xl border border-border/80 shadow-2xl"
          >
            
            {/* Ambient inner card glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
            
            {/* Success Overlay Panel */}
            <AnimatePresence>
              {authSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#131B2B] z-30 flex flex-col items-center justify-center text-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white">Authentication Verified</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                    Welcome to the premium career operating suite. Redirecting you to the active workspace...
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4.5 h-4.5" /> Loading Dashboard
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title / Description */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === "signin" 
                  ? "Access your ATS roasts, interview coach, and copilots." 
                  : "Start scanning and optimizing your career paths for free."
                }
              </p>
            </div>

            {/* Glass Tabdeck Toggle */}
            <div className="flex bg-[#0B0F19]/80 p-1.5 rounded-2xl border border-border/80 mb-8 relative">
              <button
                type="button"
                onClick={() => { setActiveTab("signin"); setEmail(""); setPassword(""); setName(""); }}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${
                  activeTab === "signin" ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("signup"); setEmail(""); setPassword(""); setName(""); }}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${
                  activeTab === "signup" ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                Sign Up
              </button>
              
              {/* Dynamic slider background */}
              <motion.div
                layoutId="activeTabSlider"
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-primary/20 border border-primary/30 shadow-inner pointer-events-none"
                style={{
                  left: activeTab === "signin" ? "6px" : "calc(50% + 2px)",
                  right: activeTab === "signin" ? "calc(50% + 2px)" : "6px",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              
              <AnimatePresence mode="popLayout">
                {activeTab === "signup" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        required={activeTab === "signup"}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0B0F19]/50 border border-border/80 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F19]/50 border border-border/80 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Password
                  </label>
                  {activeTab === "signin" && (
                    <a href="#" className="text-xs font-bold text-primary hover:underline transition-all">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0F19]/50 border border-border/80 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {activeTab === "signin" && (
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border/80 bg-[#0B0F19]/50 text-primary focus:ring-0 focus:ring-offset-0 accent-primary cursor-pointer transition-all"
                  />
                  <label 
                    htmlFor="remember" 
                    className={`text-xs font-semibold select-none cursor-pointer transition-colors duration-200 ${
                      rememberMe ? "text-primary font-bold" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Keep me signed in for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-2xl font-bold text-sm hover:from-primary/95 hover:to-purple-600/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading && !socialProvider ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {activeTab === "signin" ? "Verify Credentials" : "Initialize Workspace"}
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>

            </form>

            {/* Premium Divider */}
            <div className="flex items-center my-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <div className="flex-1 h-px bg-border/60" />
              <span className="px-4">Enterprise Single Sign-On</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B0F19]/60 hover:bg-[#0B0F19] text-white border border-border/80 hover:border-primary/40 text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialProvider === "google" && isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                {socialProvider === "google" && isLoading ? "Connecting..." : "Google"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B0F19]/60 hover:bg-[#0B0F19] text-white border border-border/80 hover:border-primary/40 text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialProvider === "github" && isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                )}
                {socialProvider === "github" && isLoading ? "Connecting..." : "GitHub"}
              </button>
            </div>

          </motion.div>

        </div>

      </main>

      {/* Footer footer links */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/20 bg-[#0B0F19]/60 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} HireAI Careers. All rights reserved.</span>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Workspace Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
