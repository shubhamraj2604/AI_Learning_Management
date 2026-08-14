import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// ⚠️ ONLY FOR TESTING — delete this file after confirming email works
export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'thorp452@gmail.com',
      subject: '[Test] Inngest Failure Alert is Working!',
      html: `
        <h2>✅ Email Alert is Working!</h2>
        <p>This is a test of your Inngest failure notification system.</p>
        <hr/>
        <p><strong>Function ID:</strong> Generate-Study-Content</p>
        <p><strong>Error Message:</strong> Simulated timeout error from Gemini API — test only.</p>
        <p><strong>Original Event:</strong> studyType.content</p>
        <pre>${JSON.stringify({ courseId: "test_course_123", studyType: "Flashcards" }, null, 2)}</pre>
        <hr/>
        <p style="color:grey;font-size:12px;">Delete /api/test-email after confirming this works.</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
