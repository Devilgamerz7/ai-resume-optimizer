import { NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/interview-engine";

export async function POST(req: Request) {
  try {
    const { role, level, industry, type, resumeContext, company } = await req.json();

    if (!role || !level || !industry || !type) {
      return NextResponse.json(
        { error: "Missing required setup parameters (role, level, industry, or type)" },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions(
      role,
      level,
      industry,
      type,
      resumeContext,
      company
    );

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("API error in generate-interview:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
