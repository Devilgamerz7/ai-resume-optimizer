import { NextResponse } from "next/server";
import { evaluateInterviewAnswers } from "@/lib/interview-engine";

export async function POST(req: Request) {
  try {
    const { questions, answers } = await req.json();

    if (!questions || !answers) {
      return NextResponse.json(
        { error: "Missing interview questions or answers data" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateInterviewAnswers(questions, answers);

    return NextResponse.json({ evaluation });
  } catch (error: any) {
    console.error("API error in evaluate-interview:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate interview answers" },
      { status: 500 }
    );
  }
}
