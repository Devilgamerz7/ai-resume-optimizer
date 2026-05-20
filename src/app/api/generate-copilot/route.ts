import { NextResponse } from "next/server";
import { 
  generateJobMatches, 
  generateCoverLetter, 
  generateOutreach, 
  analyzeSkillGap, 
  generateCareerRoadmap 
} from "@/lib/copilot-engine";

export async function POST(req: Request) {
  try {
    const { task, payload } = await req.json();

    if (!task || !payload) {
      return NextResponse.json(
        { error: "Missing required 'task' or 'payload' parameter." },
        { status: 400 }
      );
    }

    let result;

    switch (task) {
      case "job-match": {
        const { role, level, industry, location, salary, resumeContext } = payload;
        if (!role || !level || !industry) {
          return NextResponse.json({ error: "Missing required matching parameters." }, { status: 400 });
        }
        result = await generateJobMatches(role, level, industry, location, salary, resumeContext);
        break;
      }

      case "cover-letter": {
        const { targetJob, companyName, role, jobDesc, resumeContext } = payload;
        if (!companyName || !role) {
          return NextResponse.json({ error: "Missing required company name or target role." }, { status: 400 });
        }
        result = await generateCoverLetter(targetJob, companyName, role, jobDesc, resumeContext);
        break;
      }

      case "outreach": {
        const { targetRole, companyName, type, tone } = payload;
        if (!targetRole || !companyName || !type || !tone) {
          return NextResponse.json({ error: "Missing outreach options." }, { status: 400 });
        }
        result = await generateOutreach(targetRole, companyName, type, tone);
        break;
      }

      case "skill-gap": {
        const { role, industry, resumeContext } = payload;
        if (!role || !industry) {
          return NextResponse.json({ error: "Missing role or industry parameters." }, { status: 400 });
        }
        result = await analyzeSkillGap(role, industry, resumeContext);
        break;
      }

      case "roadmap": {
        const { currentRole, targetRole, level } = payload;
        if (!currentRole || !targetRole || !level) {
          return NextResponse.json({ error: "Missing target roadmap parameters." }, { status: 400 });
        }
        result = await generateCareerRoadmap(currentRole, targetRole, level);
        break;
      }

      default:
        return NextResponse.json({ error: `Unsupported task type: ${task}` }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("API error in generate-copilot:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Copilot generation request." },
      { status: 500 }
    );
  }
}
