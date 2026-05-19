import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workspace_id, contact_ids } = body;

    if (!workspace_id || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request. workspace_id and contact_ids (array) are required." },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: `${contact_ids.length} chat(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Error in delete-chat API route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
