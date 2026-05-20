import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ATSChecklistItem {
  metricName: string;
  passed: boolean;
  critique: string;
}

export interface ResumeRoastResult {
  roastScore: number;
  overallVerdict: string;
  funnyComments: string[];
  atsFailures: {
    title: string;
    description: string;
    harshCritique: string;
  }[];
  atsChecklist: ATSChecklistItem[];
  bulletPointFixes: {
    original: string;
    critique: string;
    improved: string;
  }[];
  rewrittenSummary: {
    original: string;
    critique: string;
    improved: string;
  };
  shareableQuote: string;
}

const roastSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    roastScore: {
      type: SchemaType.INTEGER,
      description: "A humorous and highly punitive ATS score from 5 to 45 indicating how trash this resume is."
    },
    overallVerdict: {
      type: SchemaType.STRING,
      description: "A brutal, funny, but highly accurate 1-2 sentence overview of the resume's biggest failure."
    },
    funnyComments: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3-5 extremely witty, harsh, and funny recruiter one-liner comments about the formatting, content, or general vibe."
    },
    atsFailures: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: "The name of the failure (e.g. 'Action Verb Drought', 'Formatting Horror Story')" },
          description: { type: SchemaType.STRING, description: "The actual ATS problem detailed professionally." },
          harshCritique: { type: SchemaType.STRING, description: "A funny, biting comment about why this issue is ridiculous." }
        },
        required: ["title", "description", "harshCritique"]
      },
      description: "3 major ATS compliance or content formatting failures."
    },
    atsChecklist: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          metricName: { type: SchemaType.STRING, description: "The exact ATS criteria (e.g., 'Quantified Metrics', 'Strong Action Verbs', 'Bullet Point Clarity', 'Keyword Optimization', 'Clean Formatting', 'Impactful Summary', 'Achievement Density')" },
          passed: { type: SchemaType.BOOLEAN, description: "Whether they strictly passed this metric (be harsh)." },
          critique: { type: SchemaType.STRING, description: "A witty, sarcastic 1-sentence assessment of this metric in their resume." }
        },
        required: ["metricName", "passed", "critique"]
      },
      description: "Exactly 7 checklist items covering quantified metrics, action verbs, bullet clarity, keywords, formatting, summary, and achievement density."
    },
    bulletPointFixes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          original: { type: SchemaType.STRING, description: "The weak or passive original bullet point from their resume." },
          critique: { type: SchemaType.STRING, description: "A witty critique of why this bullet point is bad (e.g., 'Responsible for doing things is not a skill')." },
          improved: { type: SchemaType.STRING, description: "An optimized, high-impact, quantified, ATS-friendly rewritten bullet point." }
        },
        required: ["original", "critique", "improved"]
      },
      description: "3 before-and-after bullet point fixes."
    },
    rewrittenSummary: {
      type: SchemaType.OBJECT,
      properties: {
        original: { type: SchemaType.STRING, description: "The candidate's original fluff-filled, generic summary statement or objective." },
        critique: { type: SchemaType.STRING, description: "A witty, sarcastic critique of why their summary is boring recruiter repellent." },
        improved: { type: SchemaType.STRING, description: "A killer, high-impact, metrics-driven professional summary ready for modern recruiters." }
      },
      required: ["original", "critique", "improved"],
      description: "A complete professional summary rewrite comparing before vs after."
    },
    shareableQuote: {
      type: SchemaType.STRING,
      description: "A highly shareable, hilarious quote designed for Twitter/LinkedIn (e.g., 'My resume just got roasted by HireAI. Apparently my greatest achievement is successfully hiding my lack of skills. ATS Score: 18/100 🔥')"
    }
  },
  required: [
    "roastScore", "overallVerdict", "funnyComments", 
    "atsFailures", "atsChecklist", "bulletPointFixes", "rewrittenSummary", "shareableQuote"
  ]
};

export async function roastResumeWithGemini(resumeText: string, jobDescription: string): Promise<ResumeRoastResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.85,
      responseMimeType: "application/json",
      responseSchema: roastSchema,
    },
  });

  const systemInstruction = `You are a savage, witty, and brutally honest Senior Technical Recruiter and an elitist ATS Parser.
Your job is to roast the candidate's resume with high-class, hilarious, and sarcastic feedback.
While you must be extremely funny and roast the resume ruthlessly, your underlying points must be 100% accurate regarding resume best practices.

Evaluate:
- quantified metrics
- strong action verbs
- bullet point clarity
- keyword optimization
- clean formatting
- summary statements
- achievement density

Return the analysis STRICTLY matching the requested JSON structure.`;

  const userPrompt = `
--- SYSTEM INSTRUCTIONS ---
${systemInstruction}

--- TARGET JOB DESCRIPTION (IF ANY) ---
${jobDescription || "None provided. Roast this resume against general modern tech/industry standards."}

--- CANDIDATE RESUME ---
${resumeText}
  `;

  try {
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }
    
    return JSON.parse(text) as ResumeRoastResult;
  } catch (error: any) {
    console.warn("Gemini quota/error in roast engine, serving fallback:", error?.message || error);
    const hasMetrics = /\d+%|\d+x|\$\d+|₹\d+/i.test(resumeText);
    const hasActionVerbs = /built|designed|led|architected|optimized|reduced|increased|deployed|managed/i.test(resumeText);
    return {
      roastScore: hasMetrics && hasActionVerbs ? 38 : hasActionVerbs ? 28 : 18,
      overallVerdict: "This resume reads like it was written in a fever dream — technically functional, but ATS would rather hire a potato. The bullet points have the energy of someone who discovered their job description the night before the interview.",
      funnyComments: [
        "Your 'Responsible for managing' bullet point is the resume equivalent of saying 'I breathe air professionally.'",
        "Your skills section lists Microsoft Office in 2025. Bold move. Truly bold.",
        "This resume doesn't have weaknesses — it has character. Terrible, unemployable character.",
        "An ATS scanner would reject this resume so fast it would cause a server error.",
      ],
      atsFailures: [
        { title: "Quantified Metrics Drought", description: "Resume lacks concrete numbers, percentages, or business impact statements.", harshCritique: "'Improved performance' — by how much? 1%? You improved performance by not quitting? We need NUMBERS." },
        { title: "Action Verb Famine", description: "Passive voice and weak phrase starters dominate the bullet points.", harshCritique: "'Responsible for' is not an achievement. My dog is responsible for barking. Is your dog getting an interview too?" },
        { title: "Keyword Void", description: "Critical ATS keywords from modern job descriptions are missing throughout.", harshCritique: "ATS bots searched your resume for 'Kubernetes' and found... nothing. It returned a 404 for your career." },
      ],
      atsChecklist: [
        { metricName: "Quantified Metrics", passed: hasMetrics, critique: hasMetrics ? "Solid. Someone discovered numbers exist." : "Completely absent. Numbers are your friends. Meet them." },
        { metricName: "Strong Action Verbs", passed: hasActionVerbs, critique: hasActionVerbs ? "Decent verb usage detected." : "'Responsible for' appears 3 times. This is not a legal disclaimer." },
        { metricName: "Bullet Point Clarity", passed: false, critique: "Bullet points have the clarity of a terms-and-conditions document." },
        { metricName: "Keyword Optimization", passed: false, critique: "An ATS scanner would cry reading this. Actually cry." },
        { metricName: "Clean Formatting", passed: true, critique: "At least the formatting doesn't cause eye bleeding. Small wins." },
        { metricName: "Impactful Summary", passed: false, critique: "'Passionate professional seeking opportunities' — groundbreaking. Revolutionary. Totally unique among 10 million applicants." },
        { metricName: "Achievement Density", passed: hasMetrics, critique: hasMetrics ? "Some achievements present." : "Achievements section is as empty as their LinkedIn recommendations." },
      ],
      bulletPointFixes: [
        { original: "Responsible for managing database operations and performance optimization", critique: "You were 'responsible' for it like you're responsible for your taxes — reluctantly and with minimal detail.", improved: "Architected and optimized PostgreSQL schema reducing average query latency by 65% and eliminating 3 critical slow-query bottlenecks affecting 50K+ daily active users." },
        { original: "Helped with development of new features for the product", critique: "'Helped with' is the professional equivalent of saying you attended a meeting once.", improved: "Co-architected and shipped 12 product features across 4 sprint cycles, accelerating Q2 delivery by 3 weeks and generating $180K in new MRR." },
        { original: "Worked on improving system performance and reliability", critique: "Worked on it. Just... worked on it. No results. No metrics. Just vibes.", improved: "Reduced system downtime from 4.2% to 0.3% SLA by implementing Redis caching layers and circuit breaker patterns across 8 microservices." },
      ],
      rewrittenSummary: {
        original: "Passionate and motivated software engineer looking for exciting opportunities to grow and contribute to a dynamic team.",
        critique: "This summary has appeared verbatim on 2.4 million resumes. It says nothing about you, your skills, or your impact. Recruiters skip it before the period.",
        improved: "Senior Software Engineer with 5+ years building scalable distributed systems serving 100K+ concurrent users. Specialized in TypeScript, Node.js, and cloud-native microservices on AWS. Track record of reducing API latency by 40%+ and leading cross-functional engineering teams to ship 0-to-1 SaaS products in competitive hypergrowth environments.",
      },
      shareableQuote: "Just got my resume roasted by HireAI and discovered 'Responsible for managing tasks' is not a skill, it's a confession. ATS Score: 22/100. My career is on fire 🔥 — but not in the good way.",
    };
  }
}
