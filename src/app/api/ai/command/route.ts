import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { command, users, directorates, existingTasks } = await req.json();

    if (!command) {
      return NextResponse.json({ error: 'Command string is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        result: null,
        message: 'No GEMINI_API_KEY configured, client fallback parser active.',
      });
    }

    const systemPrompt = `You are Alpha Spark AI Project Manager, an intelligent organizational assistant.
You interpret natural language instructions from team leaders and convert them into structured workspace actions.

Available Directorates: ${JSON.stringify(directorates?.map((d: any) => ({ id: d.id, name: d.name, code: d.code })))}
Available Team Members: ${JSON.stringify(users?.map((u: any) => ({ id: u.id, name: u.displayName, title: u.title })))}
Current Tasks Count: ${existingTasks?.length || 0}

Analyze the user command: "${command}"

Respond ONLY with a valid JSON object matching this exact schema:
{
  "intent": "create_task",
  "naturalLanguageCommand": "${command}",
  "extractedTask": {
    "title": "Clean, concise title",
    "description": "Detailed task context",
    "category": "software_dev",
    "directorateId": "matching_directorate_id",
    "assigneeIds": ["usr-id"],
    "priority": "urgent",
    "status": "todo",
    "dueDate": "ISO_DATE_STRING"
  },
  "explanation": "Clear 1-sentence summary of action taken"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in AI command endpoint:', error);
    return NextResponse.json({ error: error.message || 'AI processing error' }, { status: 500 });
  }
}
