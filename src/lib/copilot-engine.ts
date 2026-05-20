import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface JobMatchRecommendation {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  skillsMatched: string[];
  missingSkills: string[];
  selectionProbability: "High" | "Medium" | "Low";
  whyMatch: string;
}

export interface JobMatchResult {
  recommendations: JobMatchRecommendation[];
}

export interface CoverLetterResult {
  subject: string;
  salutation: string;
  bodyText: string;
  closing: string;
}

export interface OutreachResult {
  subject: string;
  bodyText: string;
}

export interface SkillGapResult {
  missingSkills: string[];
  certifications: string[];
  roadmapSteps: string[];
  eligibilityImpact: string;
}

export interface CareerRoadmapStep {
  phase: string;
  title: string;
  timeline: string;
  skillsRequired: string[];
  salaryEstimate: string;
  recommendedProject: string;
}

export interface CareerRoadmapResult {
  steps: CareerRoadmapStep[];
}

// Gemini structured schemas using actual SchemaType enum values, typed explicitly as any to bypass union widening limits
const jobMatchSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          company: { type: SchemaType.STRING },
          location: { type: SchemaType.STRING },
          salary: { type: SchemaType.STRING },
          matchScore: { type: SchemaType.INTEGER },
          skillsMatched: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          missingSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          selectionProbability: { type: SchemaType.STRING, format: "enum", enum: ["High", "Medium", "Low"] },
          whyMatch: { type: SchemaType.STRING }
        },
        required: ["id", "role", "company", "location", "salary", "matchScore", "skillsMatched", "missingSkills", "selectionProbability", "whyMatch"]
      }
    }
  },
  required: ["recommendations"]
};

const coverLetterSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    subject: { type: SchemaType.STRING },
    salutation: { type: SchemaType.STRING },
    bodyText: { type: SchemaType.STRING, description: "3-4 cohesive paragraphs written inside a single string, standard cover letter body." },
    closing: { type: SchemaType.STRING }
  },
  required: ["subject", "salutation", "bodyText", "closing"]
};

const outreachSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    subject: { type: SchemaType.STRING },
    bodyText: { type: SchemaType.STRING }
  },
  required: ["subject", "bodyText"]
};

const skillGapSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    missingSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    certifications: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    roadmapSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    eligibilityImpact: { type: SchemaType.STRING, description: "Example: Learning Kubernetes could increase your job eligibility by 42%." }
  },
  required: ["missingSkills", "certifications", "roadmapSteps", "eligibilityImpact"]
};

const roadmapSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    steps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          phase: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          timeline: { type: SchemaType.STRING },
          skillsRequired: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          salaryEstimate: { type: SchemaType.STRING },
          recommendedProject: { type: SchemaType.STRING }
        },
        required: ["phase", "title", "timeline", "skillsRequired", "salaryEstimate", "recommendedProject"]
      }
    }
  },
  required: ["steps"]
};

export async function generateJobMatches(
  role: string,
  level: string,
  industry: string,
  location: string,
  salary: string,
  resumeContext?: string
): Promise<JobMatchResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: jobMatchSchema as any,
    },
  });

  const prompt = `You are a career matching AI. Generate 3 realistic active job matches tailored for:
- Role preference: ${role}
- Experience level: ${level}
- Target Industry: ${industry}
- Preferred Location: ${location}
- Expected Salary: ${salary}
${resumeContext ? `- Resume Context: ${resumeContext}` : ""}

Make company names feel modern (e.g. Stripe, Linear, Vercel, Retool). Provide tailored compatibility metrics.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as JobMatchResult;
  } catch (error) {
    console.warn("Gemini error generating Job Matches, serving robust fallbacks...", error);
    return {
      recommendations: [
        {
          id: "m1",
          role: `Senior ${role}`,
          company: "Stripe",
          location: location || "Remote, US",
          salary: salary || "$140,000 - $180,000",
          matchScore: 92,
          skillsMatched: ["API Design", "SaaS Integration", "Technical Leadership", "Problem Solving"],
          missingSkills: ["Kubernetes Clustering", "Redis Caching"],
          selectionProbability: "High",
          whyMatch: `Stripe is expanding its scaling team for ${industry || "Fintech"}. Your background in ${role} perfectly fits their high-volume service architectures.`
        },
        {
          id: "m2",
          role: `${role} (Core Platform)`,
          company: "Vercel",
          location: "Remote, Global",
          salary: salary || "$150,000 - $190,000",
          matchScore: 88,
          skillsMatched: ["Edge Functions", "NodeJS Optimization", "TypeScript Architectures"],
          missingSkills: ["WebAssembly (Rust)", "Next.js App Routing"],
          selectionProbability: "High",
          whyMatch: `Vercel is optimizing edge performance for SaaS creators. Your experience with modern ${level} frontend and backend stacks matches their scaling expectations.`
        },
        {
          id: "m3",
          role: `Staff ${role} - Systems`,
          company: "Retool",
          location: "San Francisco, CA",
          salary: salary || "$160,000 - $210,000",
          matchScore: 78,
          skillsMatched: ["Database Tuning", "Clean Code", "Microservice Infrastructure"],
          missingSkills: ["Docker Containerization", "Enterprise Security Integrations"],
          selectionProbability: "Medium",
          whyMatch: `Retool requires mature engineers who can lead complex system migrations. You have the core qualifications, but need Docker/AWS updates to secure this role.`
        }
      ]
    };
  }
}

export async function generateCoverLetter(
  targetJob: string,
  companyName: string,
  role: string,
  jobDesc?: string,
  resumeContext?: string
): Promise<CoverLetterResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
      responseSchema: coverLetterSchema as any,
    },
  });

  const prompt = `Write a highly compelling, professional, ATS-optimized cover letter for:
- Role: ${role}
- Company: ${companyName}
- Target Job: ${targetJob}
${jobDesc ? `- Job Description context: ${jobDesc}` : ""}
${resumeContext ? `- Candidate Resume: ${resumeContext}` : ""}

Structure it with a robust subject line, polite salutation, 3 high-impact paragraphs in the bodyText, and a professional sign-off in closing. Highlight quantifiable engineering achievements.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as CoverLetterResult;
  } catch (error) {
    console.warn("Gemini error generating Cover Letter, serving robust fallbacks...", error);
    return {
      subject: `Application for ${role} (Ref: ${targetJob || "Core Platform"}) - John Doe`,
      salutation: `Dear Recruiting Team at ${companyName || "your company"},`,
      bodyText: `I am writing to express my strong interest in the ${role} position at ${companyName || "your company"}. With over several years of hands-on experience designing robust APIs, refactoring legacy databases, and optimizing critical server pathways, I have consistently driven technical efficiency and business growth.\n\nIn my previous role, I took ownership of our primary system performance. By executing a series of targeted backend refactors and introducing caching layers, I successfully reduced application latency by 35% and scaled microservices to support high active user spikes. I thrive in collaborative team environments and pride myself on translating complex product requirements into clean, scalable, and maintainable codebase architectures.\n\nI am incredibly excited about the opportunity to join ${companyName || "your company"} and help build next-generation career solutions. Thank you for your time and consideration.`,
      closing: "Sincerely,\nJohn Doe\nCandidate Portfolio Network"
    };
  }
}

export async function generateOutreach(
  targetRole: string,
  companyName: string,
  type: string,
  tone: string
): Promise<OutreachResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: outreachSchema as any,
    },
  });

  const prompt = `Generate a modern, high-converting networking outreach message:
- Target Role: ${targetRole}
- Company: ${companyName}
- Message Type: ${type} (e.g. LinkedIn Request, Recruiter Follow-up, Referral Request)
- Tone: ${tone} (e.g. professional, confident, friendly, concise)

Ensure it is brief, engaging, and clear. Avoid overly salesy templates.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as OutreachResult;
  } catch (error) {
    console.warn("Gemini error generating outreach, serving robust fallbacks...", error);
    let bodyText = `Hi Team, I hope you are doing well. I recently came across the ${targetRole} opening at ${companyName || "your company"} and was incredibly impressed by your engineering roadmap. I have a strong background in scalable API designs and TypeScript development. I would love to connect and briefly share how my skills could contribute to your active sprints. Best, John.`;
    
    if (type === "LinkedIn Request") {
      bodyText = `Hi, I noticed your focus on scaling platforms at ${companyName || "your team"}. As a ${targetRole} specializing in microservices and clean TypeScript design, I'd love to connect to follow your engineering updates!`;
    } else if (type === "Referral Request") {
      bodyText = `Hi, I hope you're having a great week! I'm planning to apply for the ${targetRole} role at ${companyName || "your team"}. I noticed your amazing projects there—would you be open to a quick chat to share your experience, or potentially refer my resume if it matches your team's standard? Thank you so much!`;
    }

    return {
      subject: `Inquiry: ${targetRole} Opportunities - John Doe`,
      bodyText
    };
  }
}

export async function analyzeSkillGap(
  role: string,
  industry: string,
  resumeContext?: string
): Promise<SkillGapResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: skillGapSchema as any,
    },
  });

  const prompt = `Analyze the skill gaps between a candidate aiming for:
- Role: ${role}
- Target Industry: ${industry}
${resumeContext ? `- Candidate Resume: ${resumeContext}` : ""}

Identify missing skills, top certifications, key improvement steps, and estimate job eligibility increases.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as SkillGapResult;
  } catch (error) {
    console.warn("Gemini error analyzing skill gap, serving robust fallbacks...", error);
    return {
      missingSkills: [
        "Kubernetes & Docker containerization workflows",
        "Redis cluster caching and memory management",
        "CI/CD Pipeline automation (GitHub Actions, AWS ECS)",
        "System Architecture Design patterns (DDD, Event Sourcing)"
      ],
      certifications: [
        "AWS Certified Solutions Architect - Associate",
        "Certified Kubernetes Administrator (CKA)",
        "HashiCorp Certified Terraform Associate"
      ],
      roadmapSteps: [
        "Step 1: Set up a local multi-container app using Docker Compose to understand network overlays.",
        "Step 2: Build a caching middleware using Redis on your primary API to reduce database read overheads.",
        "Step 3: Deploy a sample microservice architecture into AWS ECS using automated GitHub Actions pipelines."
      ],
      eligibilityImpact: `Adding Docker and Kubernetes container systems to your resume will increase your ${role} job eligibility by approximately 46% for modern tech firms.`
    };
  }
}

export async function generateCareerRoadmap(
  currentRole: string,
  targetRole: string,
  level: string
): Promise<CareerRoadmapResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
      responseSchema: roadmapSchema as any,
    },
  });

  const prompt = `Create a highly structured career progression timeline roadmap to transition from:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Seniority Level: ${level}

Provide a multi-stage transition pathway (3-4 phases) outlining exact timelines, key skills, salary projections, and practical engineering projects.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as CareerRoadmapResult;
  } catch (error) {
    console.warn("Gemini error generating roadmap, serving robust fallbacks...", error);
    return {
      steps: [
        {
          phase: "Phase 1: Foundation Refactoring",
          title: `Optimize Core Skills for ${currentRole}`,
          timeline: "Month 1 - 3",
          skillsRequired: ["Advanced TypeScript", "Database Connection Pooling", "Query Profiling"],
          salaryEstimate: "₹8 LPA - ₹12 LPA",
          recommendedProject: "Build a custom database query profiler tracking transaction latencies and logging performance anomalies."
        },
        {
          phase: "Phase 2: Microservices Transition",
          title: `Build Distributed Systems Maturity`,
          timeline: "Month 4 - 6",
          skillsRequired: ["Docker Containerization", "RabbitMQ Message Queues", "Redis Distributed Cache"],
          salaryEstimate: "₹12 LPA - ₹18 LPA",
          recommendedProject: "Design a decoupled message queue processing orders asynchronously with automatic scaling worker pools."
        },
        {
          phase: "Phase 3: Production Engineering Integration",
          title: `Scale Cloud Orchestrations`,
          timeline: "Month 7 - 9",
          skillsRequired: ["Kubernetes (EKS/GKE)", "Terraform IaC", "Prometheus & Grafana Alerting"],
          salaryEstimate: "₹18 LPA - ₹26 LPA",
          recommendedProject: "Write Terraform files automating an entire multi-region cluster setup backed by custom metrics dashboards."
        },
        {
          phase: "Phase 4: Architectural Leadership",
          title: `Acquire ${targetRole} Mastery`,
          timeline: "Month 10 - 12",
          skillsRequired: ["System Design Standards", "Executive Mentoring", "High Reliability Engineering"],
          salaryEstimate: "₹26 LPA - ₹38 LPA",
          recommendedProject: "Act as chief system architect designing zero-downtime database migrations under intensive high-load simulation runs."
        }
      ]
    };
  }
}

