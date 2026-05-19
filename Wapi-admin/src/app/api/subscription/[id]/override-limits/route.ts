import { API_URL } from "@/src/constants";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await fetch(`${API_URL}/subscription/${id}/override-limits`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error overriding subscription limits:", error);
    return NextResponse.json({ success: false, error: "Failed to override subscription limits", message: error?.message }, { status: 500 });
  }
}