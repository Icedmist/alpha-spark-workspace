import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { command, users, directorates, existingTasks } = await req.json();

    if (!command) {
      return NextResponse.json({ error: 'Command string is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return structured response indicating fallback usage
      return NextResponse.json({
        result: null,
        message: 'No GEMINI_API_KEY configured, client fallback parser enabled.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are Alpha Spark AI Project Manager, an intelligent organizational assistant.
You interpret natural language instructions from team leaders and convert them into structured workspace actions.

Available Directorates: ${JSON.stringify(directorates?.map((d: any) => ({ id: d.id, name: d.name, code: d.code })))}
Available Team Members: ${JSON.stringify(users?.map((u: any) => ({ id: u.id, name: u.displayName, title: u.title })))}
Current Tasks Count: ${existingTasks?.length || 0}

Analyze the user command: "${command}"

Respond ONLY with a valid JSON object with the following schema:
{
  "intent": "create_task" | "update_status" | "assign_task" | "filter_overdue" | "generate_report" | "unknown",
  "naturalLanguageCommand": "${command}",
  "extractedTask": {
    "title": "Clean, concise title",
    "description": "Detailed task context",
    "category": "teaching" | "student_support" | "software_dev" | "graphic_design" | "marketing" | "finance" | "hr" | "operations" | "event" | "procurement" | "executive" | "custom",
    "directorateId": "matching_directorate_id",
    "assigneeIds": ["usr-id"],
    "priority": "low" | "medium" | "high" | "urgent",
    "status": "todo",
    "dueDate": "ISO_DATE_STRING"
  },
  "explanation": "Clear 1-sentence summary of action taken"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in AI command endpoint:', error);
    return NextResponse.json({ error: error.message || 'AI processing error' }, { status: 500 });
  }
}
