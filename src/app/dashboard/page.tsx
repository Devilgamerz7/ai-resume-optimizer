"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, Briefcase, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, John 👋</h1>
        <p className="text-muted-foreground">Here's an overview of your job search progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-full">+2 this week</span>
          </div>
          <p className="text-3xl font-bold mb-1">12</p>
          <p className="text-sm text-muted-foreground">Resumes Scanned</p>
        </div>
        
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-success/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-full">+15%</span>
          </div>
          <p className="text-3xl font-bold mb-1">84/100</p>
          <p className="text-sm text-muted-foreground">Average ATS Score</p>
        </div>

        <div className="glass rounded-xl p-6 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px]" />
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Pro Plan Active
            </h3>
            <p className="text-sm text-muted-foreground mb-4">You have unlimited resume scans and AI generations.</p>
            <button className="text-sm font-medium text-primary hover:underline">Manage Billing</button>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Scans</h2>
          <Link href="/dashboard/resume" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-sm">
                <th className="p-4 font-medium">Document Name</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">ATS Score</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Software_Engineer_Resume_v2.pdf
                </td>
                <td className="p-4 text-muted-foreground">Today, 10:45 AM</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    92
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href="/dashboard/resume" className="text-primary hover:underline font-medium">View Report</Link>
                </td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Frontend_Dev_TCS.pdf
                </td>
                <td className="p-4 text-muted-foreground">Yesterday</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                    64
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href="/dashboard/resume" className="text-primary hover:underline font-medium">View Report</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
