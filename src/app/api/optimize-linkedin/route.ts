import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf-parser";
import { parseDOCX } from "@/lib/docx-parser";
import { optimizeLinkedInWithGemini } from "@/lib/linkedin-engine";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetRole = formData.get("targetRole") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!targetRole || targetRole.trim().length === 0) {
      return NextResponse.json({ error: "Please enter a target job title." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    
    let resumeText = "";

    if (fileExtension === "pdf" || file.type === "application/pdf") {
      resumeText = await parsePDF(buffer);
    } else if (
      fileExtension === "docx" || 
      fileExtension === "doc" || 
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resumeText = await parseDOCX(buffer);
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload a PDF or DOCX file." }, { status: 400 });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from the uploaded file. It might be scanned or empty." }, { status: 400 });
    }

    // Call LinkedIn Optimizer Engine
    const optimizationResult = await optimizeLinkedInWithGemini(resumeText, targetRole);

    return NextResponse.json({ success: true, data: optimizationResult }, { status: 200 });

  } catch (error: any) {
    console.error("LinkedIn Optimizer Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during profile optimization." },
      { status: 500 }
    );
  }
}
